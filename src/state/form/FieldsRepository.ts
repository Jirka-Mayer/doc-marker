import { useCallback, useEffect } from "react";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";

/**
 * Global service that keeps track of all currently rendered fields in the
 * form, provides data about their current state and allows their control
 * from plain javascript. Fields must explicitly register themselves into
 * this repository via the useFieldsRepositoryConnection react hook.
 */
export class FieldsRepository {
  /**
   * All the fields currently in the form and their immediate state.
   * This is a read-only image you can query to perform whole-form operations.
   */
  public get fields(): ReadonlyMap<string, Field> {
    return this._fields;
  }

  private _fields = new Map<string, Field & FieldInternal>();

  /////////////////////////////////////
  // Programmatic Field Manipulation //
  /////////////////////////////////////

  /**
   * Sets the value of a field by invoking the `handleChange` function
   * from JSON forms. It is identical to a user, typing in the value manually,
   * except it sidesteps debouncing and other mutations that the renderer
   * may perform. This sets exactly the value that will appear in the exported
   * data object from the form.
   *
   * Note that the change is NOT IMMEDIATE! It has to go through the react
   * render loop, before it is picked up by the repo connection hook and
   * finally updated in this repository. The onChange event will be raised
   * at that moment.
   */
  public setFieldValue(fieldId: string, newValue: any) {
    const field = this._fields.get(fieldId);

    if (field === undefined) {
      throw new Error(
        `Cannot set value, the field ${fieldId} in not ` +
          `present in the repository.`,
      );
    }

    field.setData(newValue);
  }

  /**
   * Removes all fields from the repository, happens immediately.
   */
  public clearFields() {
    const fieldIds = [...this._fields.keys()];
    for (const fieldId of fieldIds) {
      this.handleFieldDestroyed(fieldId);
    }
  }

  ////////////
  // Events //
  ////////////

  private _onChange = new SimpleEventDispatcher<string>();

  /**
   * Event gets fired each time a field in the list of all fields changes
   * value, gets created, or gets destoryed. The field ID is provided as the
   * argument to the event handler.
   */
  public get onChange(): ISimpleEvent<string> {
    return this._onChange.asEvent();
  }

  ////////////////////////////////
  // Repository Connection Hook //
  ////////////////////////////////

  private handleFieldCreatedOrUpdated(field: Field & FieldInternal) {
    this._fields.set(field.fieldId, field);
    this._onChange.dispatch(field.fieldId);
  }

  private handleFieldDestroyed(fieldId: string) {
    this._fields.delete(fieldId);
    this._onChange.dispatch(fieldId);
  }

  /**
   * React hook that connects a DocMarker field (custom renderer) to the
   * fields repository.
   */
  public useFieldsRepositoryConnection(props: FieldsRepositoryConnectionProps) {
    // deconstruct props
    const { fieldId, data, visible, handleChange } = props;

    // wrap handleChange so that it only applies to this field
    const setData = useCallback(
      (newValue: any) => handleChange(fieldId, newValue),
      [fieldId, handleChange],
    );

    // field construction & update handler
    useEffect(() => {
      this.handleFieldCreatedOrUpdated({
        fieldId,
        data,
        visible,
        setData,
      });
    }, [fieldId, data, visible, setData]);

    // field destruction handler
    useEffect(() => {
      return () => {
        this.handleFieldDestroyed(fieldId);
      };
    }, [fieldId]);
  }
}

/**
 * Metadata available about a field, stored in the repository
 * and available to the user of the repository
 */
export interface Field {
  /**
   * DocMarker ID of the field
   * (NOT the `id` given by JSON forms, but the `path` in the data object)
   */
  readonly fieldId: string;

  /**
   * The value stored in the field, passed to the renderer from JSON forms
   */
  readonly data: any;

  /**
   * Is the field visible according to JSON forms
   */
  readonly visible: boolean;
}

/**
 * Additional data stored in a field, which is only supposed to be held
 * locally inside the repository
 */
interface FieldInternal {
  /**
   * Callback that sets the value of the field.
   * Internally calls the `handleChange` function from JSON forms.
   */
  readonly setData: (newValue: any) => void;
}

/**
 * Arguments for the fields repo connection hook
 */
export interface FieldsRepositoryConnectionProps {
  readonly fieldId: string;
  readonly data: any;
  readonly visible: boolean;
  readonly handleChange: (path: string, newValue: any) => void;
}
