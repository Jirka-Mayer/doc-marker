Developing on
-------------

CZ:
https://qualityregistry.eu/resq/InitialDataEntry?eventDefinitionCRFId=4840&studyEventId=494919&subjectId=495585&eventCRFId=507812&exitTo=ViewStudySubject?id=495145

EN:
https://qualityregistry.eu/resq/InitialDataEntry?eventDefinitionCRFId=4840&studyEventId=498559&subjectId=499229&eventCRFId=511386&exitTo=ViewStudySubject?id=498788


Dotazy
------

Bylo provedeno vstupní vyšetření INR?
--> chybí možnost "neznámé"

V UI schématu je tohle 2x, asi chyba:
#/properties/treatment/properties/thrombolysis/properties/transfer_timestamp

no_thrombectomy_reasons
nová hodnota "not_possible"? (Technically not possible)

dvě nové kolonky pro detail transient_ischemic_stroke?
#/properties/treatment/properties/transient_ischemic_stroke/properties/clinical_symptoms
#/properties/treatment/properties/transient_ischemic_stroke/properties/symptoms_duration


Multiselekty
------------

- multiselect leader = hlavička, která umožní označit celý blok jako neznámý / explicitně prázdný
- leader může mít hodnoty: [yes, no, unknown] nebo [yes, no]
- tělo jsou booleans, nebo nullable booleans pokud leader může být unknown
- když je leader YES:
  - musím explicitně zaškrtat, které hodnoty jsou YES a ostatní jsou automaticky NO
  - tělo se pak ve formuláři zobrazuje
- když je leader NO:
  - všechny hodnoty jsou automaticky NO
  - a tělo se ve formuláři nezobrazuje
- když je leader UNKNOWN (null):
  - všechny hodnoty jsou UNKNOWN (null) - proto musejí být nullable
  - a tělo se ve formuláři nezobrazuje
- když je leader UNDEFINED:
  - všechny hodnoty jsou UNDEFINED a celek se tváří jako nevyplněný
  - tělo se pak ve formuláři nezobrazuje
- leader existuje jako separátní hodnota (přestože je redundantní), aby šel uložit rozpracovaný formulář a znovu načíst
- medikace je nově organizovaná hierarchicky, nejdříve vyberu antikoagulant a
  pak můžu vybrat, které konkrétně. Chová se to jako nested multiselekt.
- poslední implementace RES-Q+ je, že multiselect leader je speciální renderer,
  které se matchne přes `options: { multiselect: true }` a ten si najde svoje tělo
  a ovládá ho. Komponenty těla jsou standardní checkboxy, tj. separátní "controls".
- mně by se kvůli text highlights a aktivitě líbilo mít celý multiselekt blok
  jako jeden vlastní renderer, který veškerou tuhle logiku drží v sobě
