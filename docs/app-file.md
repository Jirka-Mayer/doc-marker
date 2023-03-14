File format for the DocMarker
=============================

This document describes the structure of the DocMarker file. It is a JSON file. Fields starting with `_` sign are file-format specific and others are application specific. This is the documentation of the version `1` of the file.

Here's an example of the file's content:

```json
{
  "_version": 1,
  
  "_uuid": "4cda2132-15a3-4890-b80d-5e42ce8f520c",
  "_writtenAt": "2023-03-14T11:11:18Z",
  
  "_formId": "ResQPlus AppDevelopmentForm 1.0 CZ",
  "_reportDelta": { "ops": [] },
  "_formData": null,

  "_reportText": "Lorem ipsum.\nDolor sit amet.",
  "_highlights": {
    "foo.bar": [
      { "index": 10, "length": 15 }
    ]
  }
}
```

The `_version` field is an application-specific version of the entire file, an incrementing integer.

The `_uuid` is a unique identifier of the file to detect duplicates. It's a UUID v4 value. The `_writtenAt` is an ISO 8601 UTC time, when the file was last modified (written). This is to resolve UUID collisions.

The `_formId` field is the ID of the form used in the file, `_reportDelta` is the quill delta with the content of the text report and `_formData` is the JSON data filled out in the form.

The field `_reportText` stores the plain text of the report and the field `_highlights` stores the list of highlighted regions by field. These can be computed from the report delta, but are stored in plain format for easier file processing by external applications.


### Highlights and anonymizations

Inside the `_reportDelta` there are all the text styles, but also field highlights and anonymizations.

Field highlights have the following format:

```json
{
  "insert": "Lorem ipsum dolor sit amet.",
  "attributes": {
    "highlighted@foo.bar.baz": true
  }
}
```

The given text has a highlight corresponding with the form data at path `foo.bar.baz`.

Anonymization is stored in the following way:

```json
{
  "insert": "****************",
  "attributes": {
    "anonymized": "name-person"
  }
}
```


RES-Q+ Extension
----------------

Here, the RES-Q+ specific fields are described.

The RES-Q+ file has the following additional fields:

```json
{
  "patientId": "doc_marker_2023-03-15_104"
}
```
