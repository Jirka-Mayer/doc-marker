import anamnesis from "./data-schema_anamnesis.json"
import onset from "./data-schema_onset.json"
import admission from "./data-schema_admission.js"
import diagnosis from "./data-schema_diagnosis.json"
import treatment from "./data-schema_treatment.json"
import postAcuteCare from "./data-schema_post-acute-care.json"

export default {
  "type": "object",
  "properties": {
    "anamnesis": anamnesis,
    "onset": onset,
    "admission": admission,
    "diagnosis": diagnosis,
    "treatment": treatment,
    "post_acute_care": postAcuteCare
  },
  "required": [
    "anamnesis",
    "onset",
    "admission",
    "treatment",
    "post_acute_care"
  ],
  /* TODO: put here all the constraints */
  // "allOf": [
  // ]
}