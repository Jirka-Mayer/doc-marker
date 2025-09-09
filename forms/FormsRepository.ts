import { DmOptions } from "../src/options";
import { Form } from "./Form";
import { FormDefinitions } from "./FormDefinition";

/**
 * Global service that loads forms
 */
export class FormsRepository {
  /**
   * Which form is selected in the picker when a new file is being created
   */
  public readonly defaultFormId: string;

  /**
   * IDs of all available forms
   */
  public readonly allFormIds: string[];

  /**
   * Definitions of all forms
   */
  private readonly allFormDefinitions: FormDefinitions;

  public constructor(dmOptions: DmOptions) {
    this.defaultFormId = dmOptions.defaultFormId;
    this.allFormIds = Object.keys(dmOptions.forms);
    this.allFormDefinitions = dmOptions.forms;
  }

  /**
   * Loads a form definition given a form ID
   */
  async loadForm(formId: string): Promise<Form> {
    const definition = this.allFormDefinitions[formId];

    if (!definition) throw new Error("Form ID is unknown: " + formId);

    const dataSchema = await definition.dataSchemaImporter();
    const uiSchema = await definition.uiSchemaImporter();
    const translationImporters = definition.translationImporters;

    return new Form(formId, dataSchema, uiSchema, translationImporters);
  }
}
