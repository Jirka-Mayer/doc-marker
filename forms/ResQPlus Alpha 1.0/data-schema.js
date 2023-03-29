import anamnesis from "./data-schema_anamnesis.json"
import onset from "./data-schema_onset.json"
import admission from "./data-schema_admission.js"

export default {
  "type": "object",
  "properties": {
    "anamnesis": anamnesis,
    "onset": onset,
    "admission": admission
  }
}