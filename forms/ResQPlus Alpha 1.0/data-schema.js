import anamnesis from "./data-schema_anamnesis.json"
import onset from "./data-schema_onset.json"
import admission from "./data-schema_admission.js"
import diagnosis from "./data-schema_diagnosis.json"
import treatment from "./data-schema_treatment.json"

export default {
  "type": "object",
  "properties": {
    "anamnesis": anamnesis,
    "onset": onset,
    "admission": admission,
    "diagnosis": diagnosis,
    "treatment": treatment
  }
}