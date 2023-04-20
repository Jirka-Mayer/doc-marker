import admissionElements from "./ui-schema_admission.json"
import hospitalizationElements from "./ui-schema_hospitalization.json"
import idtElements from "./ui-schema_idt.json"
import postAcuteElements from "./ui-schema_post-acute.json"
import dischargeElements from "./ui-schema_discharge.json"
import followUpElements from "./ui-schema_follow-up.json"

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
    },
    {
      "type": "Group",
      "label": "group.discharge",
      "elements": dischargeElements
    },
    {
      "type": "Group",
      "label": "group.follow_up",
      "elements": followUpElements,
      "rule": {
        "effect": "HIDE",
        "condition": {
          "type": "OR",
          "conditions": [
            {
              "scope": "#/properties/post_acute_care/properties/24_hour_hospitalized_time",
              "schema": {
                "enum": [
                  "died"
                ]
              }
            },
            {
              "scope": "#/properties/discharge/properties/destination/properties/discharge_destination",
              "schema": {
                "enum": [
                  "dead"
                ]
              }
            },
            {
              "scope": "#/properties/diagnosis/properties/stroke_type",
              "schema": {
                "enum": [
                  "mimics"
                ]
              }
            }
          ]
        }
      }
    }
  ]
}
