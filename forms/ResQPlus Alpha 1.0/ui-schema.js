import admissionElements from "./ui-schema_admission.json"
import hospitalizationElements from "./ui-schema_hospitalization.json"

export default {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Group",
      "label": "group.admission",
      "elements": admissionElements
    },
    {
      "type": "Group",
      "label": "group.hospitalization",
      "elements": hospitalizationElements
    }
  ]
}
