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
   * ISO 639 langauge of the report text,
   * May be missing if the user did not provide this information.
   */
  _reportLanguage: string | undefined;

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
    [formFieldId: string]: TextRange[];
  };

  /**
   * Predictions by the robot (automatic form filling) for individual
   * form fields. If a field is missing from the list, it was not predicted,
   * or the prediction was discarded (e.g. confidence too low).
   *
   * This whole field may be missing, in which case there are no predictions.
   */
  _robotPredictions?: {
    [formFieldId: string]: {
      /**
       * List of evidences (text highlights) that were predicted by the robot.
       * They were also used in the answer prediction as-is. Empty list means
       * the robot predicted no evidences for the field, which does happen for
       * some questions (they are evidence-less). Should the robot provide
       * no prediction (e.g. being too uncertain), then this whole robot
       * prediction object for this field would be missing instead,
       * since without evidences the value cannot be predicted.
       */
      evidences: SerializedEvidence[];

      /**
       * The value returned by the robot as the predicted value of the field.
       * Undefined means the robot did not predict any value (left the field
       * empty, which corresponds to the default value for empty fields).
       * Robot may have not predicted any value because of its low confidence,
       * despite having many evidences extracted previously.
       */
      predictedValue: any | undefined;

      /**
       * True when the predicted value matches data in the form. This means
       * the user has not modified the predicted data and so it's either
       * the correct prediction, or has not yet been verified (depending on
       * the isHumanVerified value). This value is null if there is no
       * predicted value by the robot (and thus it makes no sense).
       */
      matchesFormData: boolean | null;

      /**
       * Whether the predicted value was manually verified by the human
       * annotator. This value is null when it makes no sense, e.g.
       * if the predicted value is undefined or if it does not match the
       * value in the form (the user has overwritten/corrected the value).
       */
      isHumanVerified: boolean | null;

      /**
       * Version of the model that was used for evidence extraction
       */
      evidenceModelVersion: string;

      /**
       * Version of the model that was used for answer prediction
       */
      predictionModelVersion: string;

      /**
       * Any additional metadata that may be stored, depending on the models
       * used. This depends on the DocMarker customization and the model that
       * it is connected to. May be missing if not set by the robot integration.
       */
      evidenceMetadata: any | undefined;

      /**
       * Any additional metadata that may be stored, depending on the models
       * used. This depends on the DocMarker customization and the model that
       * it is connected to. May be missing if not set by the robot integration.
       */
      predictionMetadata: any | undefined;
    };
  };
}

/**
 * Represents a range in the text
 */
export interface TextRange {
  /**
   * Where the range begins (0 means the first text character is included)
   */
  index: number;

  /**
   * How many text characters are within this range
   */
  length: number;
}

/**
 * Represents a robot prediction evidence in the serialized JSON file
 */
export interface SerializedEvidence {
  /**
   * Range in the report text, which contains the evidence.
   */
  range: TextRange;

  /**
   * The text within the evidence range. This value was used for answer
   * prediction.
   */
  text: string;

  /**
   * True when the text within the rage of the report matches the text field
   * of this evidence. In other words, the report text was not modified
   * since the time the evidence was extracted. This value provides an indirect
   * way to determine, whether the user modified the report text after the
   * robot prediction was performed and so whether you can rely on the current
   * report text to be the original input for evidence extraction or not.
   */
  matchesReportText: boolean;
}
