# RES-Q+ AppDevelopmentForm 1.0 CZ

This is a form used for the development of this application. It is based around the `RES-Q 3.0 standard form CZ` and is designed to export easily into the `qualityregistry.eu` web form. It's purpouse is only to develop this app and possibly to gather the first training samples for the early stages of development. Since the development currently happens in Czech Republic, we decided to create a CZ variant of the development form first.

DO NOT USE THIS FORM BLINDLY AS A BASIS FOR ANY PRODUCTION-READY FORM. IT WAS DESIGNED WITH MINIMAL CONSIDERATIONS TO ANY STANDARDS/SEMANTICS/APIs. WHEN DESIGNING A PRODUCTION FORM, THINK ABOUT ALL OF THESE THINGS FIRST:

- What is the ingestion API for the registry?
- How is the data schema structured (ideally language-agnostically with well defined semantics)?
- How does the UI schema map onto the data schema?
- What role do discharge report annotations play (text highlighs for each field)?
- Do all fields need to be annotated? Which do, which don't?
- What about the application-related metadata (which fields were filled by a human, which by a robot, which were verified)?


## Design decisions made for this development form


### Enums

Because the online form represents enum values as integers (string integers due to HTML constrains), we decided to use these same numbers in the possible data schema values. To not lose interpretability of the data, we append the english label of the value next to the number. This label is however ignored during export. An example with gender values:

```js
// gender is a string enum with the following values
["1 (Male)", "2 (Female)", "3 (Other)"] // <-- this form uses these!

// these are exported into the online form as
["1", "2", "3"]

// which could in the future be exported as
["male", "female", "other"]

// but more likely will (and should) be something well defined, e.g.:
["https://schema.org/Male", "https://schema.org/Female", "???"]
```
