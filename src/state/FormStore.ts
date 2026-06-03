import { atom } from "jotai";
import { JotaiStore } from "./JotaiStore";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { ErrorObject } from "ajv";

/**
 * Data of the form as defined by JSON Forms and the schema
 */
export type FormData = any | null;

/**
 * Validation errors returned by JSON Forms
 */
export type FormErrors = ErrorObject[] | undefined;

export interface FormDataChangedEventArgs {
  /**
   * Form data just before the change
   */
  readonly oldValue: FormData;

  /**
   * Latest form data, currently rendered by the form
   */
  readonly newValue: FormData;

  /**
   * Who initiated the form data change. Inernal means that the user
   * interacted with the Form UI which caused a change from within the
   * JSON Forms library. External means that the DocMarker app
   * drove the change externally into the FormComponent via a modified
   * props value (e.g. when a file is loaded).
   */
  readonly origin: "internal" | "external";
}

/**
 * Encapsulates state related to the JSON Forms form
 * with all of its data and errors.
 */
export class FormStore {
  private readonly jotaiStore: JotaiStore;

  constructor(jotaiStore: JotaiStore) {
    this.jotaiStore = jotaiStore;
  }

  /////////////
  // Form ID //
  /////////////

  /**
   * Stores the ID of the currently used form.
   * Null means no file is currently open, thus no form
   * should be rendered.
   */
  public readonly formIdAtom = atom<string | null>(null);

  /**
   * Stores the ID of the currently used form.
   * Null means no file is currently open, thus no form
   * should be rendered.
   */
  public get formId(): string | null {
    return this.jotaiStore.get(this.formIdAtom);
  }
  public set formId(value: string | null) {
    this.jotaiStore.set(this.formIdAtom, value);
  }

  /**
   * Atom that is observed by the FormComponent and it
   * should reload the form when this atom changes.
   */
  private readonly formReloadTriggerAtom = atom<number, [undefined], void>(
    (get) => get(this.formReloadTriggerAtomBase),
    (get, set, _) => {
      let oldValue = get(this.formReloadTriggerAtomBase);
      const newValue = (oldValue + 1) % 100;
      set(this.formReloadTriggerAtomBase, newValue);
    },
  );
  private readonly formReloadTriggerAtomBase = atom<number>(0);

  /**
   * Trigger re-loading of the from definition and once that
   * reload completes, the UI will render the new form
   */
  public triggerFormReload(): void {
    this.jotaiStore.set(this.formReloadTriggerAtom, undefined);
  }

  ///////////////
  // Form Data //
  ///////////////

  /*
    JSON Forms keeps a copy of the form data inside. It has a reducer and it keeps
    its state. It watches the "data" we give to it via useEffect and updates its
    internal state when our provided data changes.
    https://github.com/eclipsesource/jsonforms/blob/master/packages/react/src/JsonFormsContext.tsx#L137

    This has a few unfortunate consequences and it prevents us from updating the
    data externally in a frequent manner. Also, JSON Forms calls onChange update
    even when the source of change is us, setting the data externally.

    Also for some reason, onChange is called with a 10ms latency and debounced,
    which furhter complicates driving the form data externally.

    For all these reasons I chose to separate the "modify internally" event
    from the "modify externally" event. I did that by separating the two APIs
    using two atoms: formData and formRenderingData, the latter being
    the internal API.

    We also keep track of data we have set via the external API and when it comes
    back to us via the onChange event, we ignore the event. This also helps
    breaking the unintended feedback loop.
  */

  /**
   * The "initial" form data (read by JSON Forms)
   */
  private readonly initialFormDataAtom = atom<FormData>(null);

  /**
   * The "actual" form data (written by JSON Forms)
   */
  private readonly actualFormDataAtom = atom<FormData>(null);

  private readonly externalWritesLog = new ExternalWritesLog();

  /**
   * This atom presents the internal API for form data, used by the form component.
   * Do not use this for reading/writing form data! Use the other atom instead.
   */
  private readonly formDataRenderingAtom = atom<FormData, [FormData], void>(
    // used only when the JSON Forms component renders for the first time
    // and then is watched in useEffect for changes and triggers additional re-renders:
    // https://github.com/eclipsesource/jsonforms/blob/master/packages/react/src/JsonFormsContext.tsx#L137
    (get) => get(this.initialFormDataAtom),

    // triggered by JSON Forms "onChange" event
    (get, set, newValue: FormData) => {
      const oldValue = get(this.actualFormDataAtom);

      // setting this will present a new value of the form data to the rest
      // of the APP but will NOT cause JSON forms to re-render
      set(this.actualFormDataAtom, newValue);

      // silence changes caused by us
      // (their corresponding event has been emitted already)
      if (this.externalWritesLog.has(newValue)) {
        return;
      }

      // trigger internal change event
      this.onFormDataChangedDispatcher.dispatch({
        oldValue: oldValue,
        newValue: newValue,
        origin: "internal", // user used some form control
      });
    },
  );

  /**
   * This atom presents the external API for reading and writing form data
   */
  public readonly formDataAtom = atom<FormData, [FormData], void>(
    (get) => get(this.actualFormDataAtom),
    (get, set, newValue: FormData) => {
      const oldValue = get(this.actualFormDataAtom);

      // setting this will present a new value of the form data to the rest
      // of the APP but will NOT cause JSON forms to re-render
      set(this.actualFormDataAtom, newValue);

      // this will trigger JSON Forms re-render with the new data
      // it will in cause onChange to be called and its event will be silenced
      set(this.initialFormDataAtom, newValue);

      // remember this external write value to silence the later onChange event
      this.externalWritesLog.add(newValue);

      // trigger external change event
      this.onFormDataChangedDispatcher.dispatch({
        oldValue: oldValue,
        newValue: newValue,
        origin: "external", // someone set the form data programatically
      });
    },
  );

  /**
   * Presents the external API for reading and writing form data
   */
  public get formData(): FormData {
    return this.jotaiStore.get(this.formDataAtom);
  }
  public set formData(value: FormData) {
    this.jotaiStore.set(this.formDataAtom, value);
  }

  /**
   * Event fires whenever form data changes
   */
  public get onFormDataChanged(): ISimpleEvent<FormDataChangedEventArgs> {
    return this.onFormDataChangedDispatcher.asEvent();
  }
  private readonly onFormDataChangedDispatcher =
    new SimpleEventDispatcher<FormDataChangedEventArgs>();

  /////////////////
  // Form Errors //
  /////////////////

  /**
   * Read-only view of the current errors detected when validating
   * form data against its schema.
   */
  public readonly formErrorsAtom = atom<FormErrors>((get) =>
    get(this.formErrorsBaseAtom),
  );
  private readonly formErrorsBaseAtom = atom<FormErrors>(undefined);

  /**
   * Read-only view of the current errors detected when validating
   * form data against its schema.
   */
  public get formErrors(): FormErrors {
    return this.jotaiStore.get(this.formErrorsAtom);
  }

  /**
   * Sets the form errors values, called only by the FormComponent
   */
  private setFormErrors(newValue: FormErrors): void {
    this.jotaiStore.set(this.formErrorsBaseAtom, newValue);
  }

  //////////////////
  // Internal API //
  //////////////////

  /**
   * Internal API of the FormStore, which is used
   * exclusively from the FormComponents and should
   * not be used by the rest of the DocMarker applicaiton.
   */
  public readonly internal = {
    formReloadTriggerAtom: this.formReloadTriggerAtom,
    formDataRenderingAtom: this.formDataRenderingAtom,
    setFormErrors: this.setFormErrors.bind(this),
  };
}

/**
 * Tracks external writes to the form data atom
 * to catch internal changes reflected from JSON Forms
 * back to the external write atom in order to ignore them.
 */
class ExternalWritesLog {
  private static readonly TTL_AGE_MS = 5 * 60 * 1000; // 5 minutes

  private readonly externalWrites = new Set<FormData>();
  private readonly writesTtl: TtlRecord[] = [];

  public has(value: FormData): boolean {
    return this.externalWrites.has(value);
  }

  public add(value: FormData): void {
    this.externalWrites.add(value);
    this.writesTtl.push({
      time: new Date(),
      value: value,
    });

    this.pruneWritesTtl();
  }

  private pruneWritesTtl(): void {
    const now = new Date();

    while (
      this.writesTtl.length > 0 &&
      now.valueOf() - this.writesTtl[0].time.valueOf() >
        ExternalWritesLog.TTL_AGE_MS
    ) {
      this.externalWrites.delete(this.writesTtl[0].value);
      this.writesTtl.shift();
    }
  }
}

interface TtlRecord {
  readonly time: Date;
  readonly value: FormData;
}
