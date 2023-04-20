import _ from "lodash"

// This file is structured by UI - by the qualityregistry.eu form
// "RES-Q 3.0 standard form CZ"

export default function(data) {
  
  function get(path) {
    return _.get(data, path)
  }

  function int2str(value) {
    return "" + value
  }

  function enumMap(value, map) {
    return map[value]
  }

  function boolMap(value, map) {
    return map[value ? "true" : "false"]
  }

  function time2HHMM() {} // TODO

  function time2DDMMRRRR() {} // TODO

  return {


    //////////////////////////////////
    // Data při přijetí (Admission) //
    //////////////////////////////////

    // Věk při přijetí
    input6814: int2str(get("anamnesis.age")),

    // Biologické pohlaví
    input6815: enumMap(get("anamnesis.sex"), {
      "male": "1",
      "female": "2"
    }),

    // Pacient se s příznaky CMP probudil?
    input6816: boolMap(get("onset.wakeup_stroke"), {
      "true": "1",
      "false": "2"
    }),

    // Kdy šel pacient spát?
    input6817: time2HHMM(get("onset.sleep_timestamp")),

    // CMP během hospitalizace
    input6818: boolMap(get("onset.inhospital_stroke"), {
      "true": "1",
      "false": "2"
    }),

    // Místo prvního kontaktu s pacientem ve vaší nemocnici
    input6819: enumMap(get("admission.first_contact_place"), {
      "direct_CT/MR": "1",
      "emergency": "2",
      "outpatient_clinic": "3",
      "other_department": "4"
    }),

    // Datum přijetí
    input6820: time2DDMMRRRR(get("admission.admission_timestamp")),

    // Čas příjezdu do nemocnice
    input6821: time2HHMM(get("admission.admission_timestamp")),

    // Datum vzniku CMP (Onset)
    input6822: time2DDMMRRRR(get("onset.onset_timestamp")),

    // Čas vzniku CMP (Onset) - podmíněné, že to není wakeup stroke
    input6823: time2HHMM(get("onset.onset_timestamp")),

    // Odkud pacient přijel do vaší nemocnice?
    input6824: enumMap(get("admission.arrival_mode"), {
      "ems": "1",
      "private": "2",
      "hospital": "3"
    }),

    // Byla příjezd pacienta notifikována záchrannou službou?
    // - podmíněné, že byl přivezen EMS
    input6825: boolMap(get("admission.ems_prenotification"), {
      "true": "1",
      "false": "2"
    }),

    // První nemocnice, kam byl pacient přijat
    // - podmíněné, že byl přivezen z jiné nemocnice
    input6826: get("admission.transferred_from_hospital"),

    // Pacient byl 1. den přijat na
    input6827: enumMap(get("admission.hospitalized_in"), {
      "icu": "1",
      "telemetry_bed": "2",
      "standard_bed": "3"
    }),

    // Na které oddělení byl pacient přijat?
    input6828: enumMap(get("admission.admission_department"), {
      "neurology": "1",
      "neurosurgery": "2",
      "critical_care": "3",
      "internal_medicine": "4",
      "other": "5"
    }),


    //////////////////////////////////////////////
    // Data při hospitalizaci (Hospitalization) //
    //////////////////////////////////////////////

    // TODO ...

  }
}