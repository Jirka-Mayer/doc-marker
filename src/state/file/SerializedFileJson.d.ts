/**
 * Describes the structure of the serialized app file JSON
 */
export interface SerializedFileJson {
  /**
   * Version of this JSON file. Value depends on the customization and its
   * migrations. Can be integer, string, or left unused.
   */
  _version: number | string | undefined;

  /**
   * Version of DocMarker used to write this file.
   * E.g. DocMarker version "0.4.3"
   */
  _docMarkerVersion: string;

  /**
   * Version of the customization of DocMarker used to write this file.
   * E.g. DocMarker for RES-Q+, version "0.2.0"
   */
  _docMarkerCustomizationVersion: string;

  /**
   * Human-readable name of the customation of DocMarker used to write this
   * file, e.g. "DocMarker for RES-Q+"
   */
  _docMarkerCustomizationName: string;

  /**
   * Global identifier of a file. Generated once when the file is created
   * and then never changed.
   */
  _uuid: string;

  /**
   * Human-readable file name, optionally provided by the user.
   * Should not be null, use empty string instead if not known.
   * If missing, the UUID is generally displayed in its place in the UI.
   */
  _fileName: string;

  /**
   * ISO 8601 date string of when the file was created,
   * e.g. "2023-03-14T11:11:18Z"
   */
  _createdAt: string;

  /**
   * ISO 8601 date string of when the file was last modified,
   * e.g. "2023-03-14T11:11:18Z"
   */
  _updatedAt: string;

  /**
   * In what app mode has DocMarker last been when working with the file
   * e.g. text editing, anonymization or annotation
   */
  _appMode: "EDIT_TEXT" | "ANONYMIZE" | "ANNOTATE_HIGHLIGHTS";

  /**
   * ID of the form used in this file. The ID value depends on forms
   * provided with the customization.
   */
  _formId: string;

  /**
   * JSON object returned by JSON forms
   * for the corresponding formID specified above
   */
  _formData: any;

  /**
   * The "Delta" type JSON value returned by Quill.js, the rich-text editor
   * behind the report view. It contains the report text with all of its
   * formatting. The value also contains all anonymizations and highlights,
   * since they are implemented as custom formats for the Quill editor.
   * The format is described here: https://quilljs.com/docs/delta
   */
  _reportDelta: any;

  /**
   * The plain-text simplification of the report document. It's the
   * Quill delta object above, just stripped of all formatting and simplified
   * into a plain string. The character positions align. This value is ignored
   * when DocMarker loads these files, the delta is used instead. This is meant
   * as a simple read-only option for other consumers of this data format.
   */
  _reportText: string;

  /**
   * An extracted overview of all highlights in the text, groupped by their
   * form field ID. The gold data is encoded in the _reportDelta value,
   * but this is an extracted, read-only copy of that data for easier
   * consumption by other software.
   *
   * It's a JSON object that maps from form field IDs, to a list of highlights
   * in the text. If a form field ID is missing, no highlights have been
   * attached to it. A highlight range is defined by the starting character
   * index and its length in characters. You can use this value to extract
   * the corresponding highlighted text from the _reportText field above.
   */
  _highlights: {
    [formFieldId: string]: HighlightRange[];
  };
}

/**
 * Represents a range in the text, where a specific highlight is applied
 * (the text is linked to a given form field)
 */
export interface HighlightRange {
  /**
   * Where the range begins (0 means the first text character is included)
   */
  index: number;

  /**
   * How many text characters are within this range
   */
  length: number;
}
