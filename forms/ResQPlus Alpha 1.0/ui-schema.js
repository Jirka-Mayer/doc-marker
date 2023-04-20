import admissionElements from "./ui-schema_admission.json"
import hospitalizationElements from "./ui-schema_hospitalization.json"
import idtElements from "./ui-schema_idt.json"
import postAcuteElements from "./ui-schema_post-acute.json"

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
    },
    {
      "type": "Group",
      "label": "group.IDT",
      "elements": idtElements
    },
    {
      "type": "Group",
      "label": "group.post_acute.label",
      "elements": postAcuteElements
    }
  ]
}
