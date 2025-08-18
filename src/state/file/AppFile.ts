import { currentOptions } from "../../options";
import * as uuid from "uuid";
import * as packageJson from "../../../package.json";
import { AppMode } from "../editor/AppMode";
import { SerializedFileJson } from "./SerializedFileJson";

const DOC_MARKER_VERSION = packageJson["version"] as string;

/**
 * A wrapper around the serialized JSON file that DocMarker edits.
 * AppFile = the file that the Doc Marker application works with.
 */
export class AppFile {
  /**
   * Raw JSON body of the file
   */
  private body: SerializedFileJson;

  private constructor(body: SerializedFileJson) {
    this.body = JSON.parse(JSON.stringify(body)); // clone
    this.validate();
  }

  /**
   * Generates the UUID for a new file
   */
  public static generateNewUuid(): string {
    return uuid.v4();
  }

  /**
   * Creates AppFile instance from a given parsed JSON file body
   */
  public static fromJson(body: SerializedFileJson): AppFile {
    return new AppFile(body);
  }

  /**
   * Creates a new empty file
   * @param formId Which form the file should use
   */
  public static createNewEmpty(formId: string): AppFile {
    const now = new Date();

    const emptyFile: SerializedFileJson = {
      _version: currentOptions.file.currentVersion,
      _docMarkerVersion: DOC_MARKER_VERSION,
      _docMarkerCustomizationVersion: currentOptions.customization.version,
      _docMarkerCustomizationName: currentOptions.customization.name,

      _uuid: this.generateNewUuid(),
      _fileName: "",
      _createdAt: now.toISOString(),
      _updatedAt: now.toISOString(),

      _appMode: AppMode.EDIT_TEXT,

      _formId: formId,
      _formData: null,

      _reportDelta: { ops: [] },
      _reportText: "",
      _highlights: {},
    };

    const emptyFileWithCustomization =
      currentOptions.file.onCreateEmpty(emptyFile);

    return AppFile.fromJson(emptyFileWithCustomization);
  }

  /**
   * Returns a clone of the underlying JSON file
   */
  public toJson(): any {
    return JSON.parse(JSON.stringify(this.body)); // clone body
  }

  /**
   * Returns a clone of the underlying JSON file as a string
   */
  public toJsonString(): string {
    return JSON.stringify(this.body);
  }

  /**
   * Returns a clone of the underlying JSON file as a pretty-printed string
   */
  public toPrettyJsonString(): string {
    return JSON.stringify(this.body, null, 2);
  }

  /**
   * Runs validation checks on the file JSON to ensure it isn't malformed
   */
  private validate() {
    const json = this.body as any;

    if (json["_version"] !== currentOptions.file.currentVersion)
      throw new Error("Invalid file version: " + json["_version"]);

    if (!json["_uuid"]) throw new Error("Missing file UUID");

    if (!json["_createdAt"]) throw new Error("Missing file '_createdAt' field");

    if (!json["_updatedAt"]) throw new Error("Missing file '_updatedAt' field");

    // ... validate other fields as well ...
  }

  ////////////////////////
  // Body Field Getters //
  ////////////////////////

  public get uuid(): string {
    return this.body._uuid;
  }

  public get createdAtString(): string {
    return this.body._createdAt;
  }

  public get createdAtDate(): Date {
    return new Date(this.body._createdAt);
  }

  public get updatedAtString(): string {
    return this.body._updatedAt;
  }

  public get updatedAtDate(): Date {
    return new Date(this.body._updatedAt);
  }

  public get fileName(): string {
    return this.body._fileName;
  }

  ///////////
  // Other //
  ///////////

  /**
   * Returns file name that is never empty
   */
  public static constructFileName(
    fileName: string | null,
    uuid: string,
  ): string {
    return fileName || AppFile.constructUuidFileName(uuid);
  }

  /**
   * Returns the default file name is only the UUID is known
   * (user has not specified any other file name)
   */
  public static constructUuidFileName(uuid: string): string {
    return "file-" + uuid.substring(0, 8);
  }

  /**
   * Returns file name that is never empty
   */
  public constructFileName(): string {
    return AppFile.constructFileName(this.fileName, this.uuid);
  }

  /**
   * Download this app file to the user's computer
   */
  public download(): void {
    // export JSON
    const jsonString = this.toPrettyJsonString();

    // download file
    let dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    let a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", this.constructFileName() + ".json");
    a.click();
  }
}
