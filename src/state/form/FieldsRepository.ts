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
   *
   * @param fieldId Which field to set the value for
   * @param newValue The value to set to the field (to its "data" property)
   * @param coerceValue Should the given value be coerced into a valid value
   *  for the given field? Valid value is a value that could have been entered
   *  by a human through the field's UI.
   */
  public setFieldValue(
    fieldId: string,
    newValue: any,
    coerceValue: boolean = false,
  ) {
    // get the field
    const field = this._fields.get(fieldId);

    if (field === undefined) {
      throw new Error(
        `Cannot set value, the field ${fieldId} in not ` +
          `present in the repository.`,
      );
    }

    // coerce the value
    const newData = coerceValue ? field.coerceData(newValue) : newValue;

    // set the value
    field.setData(newData);
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
    const { fieldId, data, visible, handleChange, coerceData } = props;

    // wrap handleChange so that it only applies to this field
    // (hide the "fieldId" argument)
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
        coerceData,
      });
    }, [fieldId, data, visible, setData, coerceData]);

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

  /**
   * Function that converts any value into a valid value for the field,
   * used by the robot automatic filling.
   * @param givenValue Any value, should be some javascript primitive though.
   * @returns Value that is inputtable by the user through the UI
   */
  readonly coerceData: (givenValue: any) => any;
}

/**
 * Arguments for the fields repo connection hook
 */
export interface FieldsRepositoryConnectionProps {
  /**
   * ID of the field (path of its value in the form data object)
   */
  readonly fieldId: string;

  /**
   * The parsed (number/string/boolean) value of the field,
   * exactly as stored in the form data object.
   */
  readonly data: any;

  /**
   * Does JSON Forms currently render the field as visible
   */
  readonly visible: boolean;

  /**
   * The "handleChange" function provided by JSON Forms to its controls
   */
  readonly handleChange: (path: string, newValue: any) => void;

  /**
   * Function that coerces any given data into a value that could have been
   * inputted by the user through the UI. It is used to accept robot-generated
   * values.
   */
  readonly coerceData: (givenValue: any) => any;
}
