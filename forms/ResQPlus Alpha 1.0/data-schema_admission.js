export default {
  "type": "object",
  "default": {},
  "properties": {
    "admission_timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "arrival_mode": {
      "type": "string",
      "enum": [
        "ems",
        "private",
        "hospital"
      ]
    },
    "ems_prenotification": {
      "type": "boolean",
      "default": false
    },
    "hospitalized_in": {
      "type": "string",
      "enum": [
        "icu",
        "telemetry_bed",
        "standard_bed"
      ]
    },
    "admission_department": {
      "type": "string",
      "enum": [
        "neurology",
        "neurosurgery",
        "critical_care",
        "internal_medicine",
        "other"
      ]
    },
    "first_contact_place": {
      "type": "string",
      "enum": [
        "direct_CT/MR",
        "emergency",
        "outpatient_clinic",
        "other_department"
      ]
    },
    "transferred_from_hospital": {
      "type": "string"
    },
    "medical_examination": {
      "type": "object",
      "default": {},
      "properties": {
        "systolic_pressure": {
          "type": "integer",
          "minimum": 0,
          "maximum": 299
        },
        "diastolic_pressure": {
          "type": "integer",
          "minimum": 0,
          "maximum": 299
        },
        "cholesterol": {
          "type": ["number", "null"]
        },
        "glucose": {
          "type": ["number", "null"]
        },
        "inr_mode": {
          "type": "string",
          "enum": [
            "device",
            "lab",
            "not_done"
          ]
        },
        "gcs": {
          "type": "integer",
          "maximum": 15,
          "minimum": 3
        },
        "nihss": {
          "type": ["integer", "null"],
          "maximum": 42,
          "minimum": 0
        }
      },
      "required": [
        "systolic_pressure",
        "diastolic_pressure",
        "cholesterol",
        "glucose",
        "nihss"
      ]
    }
  },
  "required": [
    "hospitalized_in"
  ]
}