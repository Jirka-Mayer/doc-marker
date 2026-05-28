# Quill Extended

The left panel of DocMarker which contains the rich text depends on the [Quill.js v1](https://v1.quilljs.com/) rich text editor. Quill represents documents in the so-called [Delta format](https://v1.quilljs.com/docs/delta), which acts as a clear source of truth for the editor and this helps eliminate problems comming from different implementations of the [`contenteditable` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) between web browsers.

Therefore DocMarker uses Quill as a black-box, that pretends to contain a document in the Delta format and renders UI that allows the user to modify it and provides API that allows DocMarker to also modify it.

Since the logic behind DocMarker is much richer, than ordinary rich-text editing, we also extend the Quill editor heavily. Or rather, we misuse its ability to define additional text formats (e.g. highlighted text, strike-through text, etc.) to implement DocMarker's ability to "highlight" text corresponding to a given form field. We define one distinct "style" of text, for each individual form field.

In order to shield the final user from these messy implementation details (hundreds of new custom styles), we wrap the native `Quill` editor instance in our own class called `QuillExtended`. The goal of this wrapper is to pretend to be a `Quill` editor like any other, just extended with our text highlighting and anonymization features. This extensions uses composition, not inheritance, to make the translation within the wrapper explicit and also prevent the user from breaking invariants by using native `Quill` methods we didn't anticipate. The wrapper also allows us to better integrate the Quill editor with React.


## Delta

This is what a short document represented in the Delta format looks like:

```json
{
  "ops": [
    { "insert": "Gandalf", "attributes": { "bold": true } },
    { "insert": " the " },
    { "insert": "Grey", "attributes": { "color": "#cccccc" } }
  ]
}
```

Inline text styles are stored in the `attributes` field for a given span of text. The `Quill` static class has a number of formats registered (via `Quill.register(...)`) and these are used by the `Quill` instance when rendering the delta. There is a "bold" format registered which looks for the `bold: true` value in `attributes` and then the format specifies which CSS classes should be applied to that given `<span>` of text when the HTML is rendered.

Because the `Quill` library does not export good typescript types, DocMarker defines `interface` types for the Delta format JSON objects in the `QDelta.ts` file:

```ts
import { QDelta } from "QDelta.ts"

const myDelta: QDelta = {
    ops: [
        { insert: "Hello world!" }
    ]
};
```

> **Note:** Quill does export *some* types, but their typescript-efficacy is kinda limited (e.g. the `DeltaOperation` interface groups all operations into one in an ugly way) and the `Delta` type is actually a `class` and so cannot be used for JSON-deseralized POJOs, which is the usecase DocMarker mostly cares about.

For individual delta operations, the `QDelta.ts` file also defines tester functions:

```ts
import { QOperation, isInsert, QInsertOp } from "QDelta.ts"

const operation: QOperation = myDelta.ops[0];

if (isInsert(operation)) {
    // operation is now of type QInsertOp
    console.log("Inserting text:", operation.insert);
}
```


## Anonymization Overview

The anonymized text is just another Quill format (just like `"bold"`), that renders a gray background for the text in question.

Note that `QuillExtened` does not trigger the replacement of anonymized text with asterisks `******`. That logic belongs to higher levels of DocMarker. `QuillExtended` just handles marking of text spans that are anonymized and their rendering, plus has a method that performs this asterisks replacemenet when requested.

The `"anonymized"` format is registered in `defineAnonymizationAttributor.ts`. This function is called only once, to register the format as such into the Quill library. Then, when a `Quill` instance is being constructed, the `"anonymized"` format must be passed in as one of the enabled formats for the given instance.

```ts
// register "anonymized" format into the Quill library
defineAnonymizationAttributor();

// and when creating a new Quill instance...
const quill = new Quill(htmlElement, {
    ...
    formats: [
        "bold", "italic", ...

        // enable the format
        "anonymized",
    ]
});
```

In the Delta format, anonymized text is represented in this way:

```json
{
  "ops": [
    {
        "insert": "Gandalf the Grey",
        "attributes": { "anonymized": "name-person" }
    },
    {
        "insert": " arrived to the Shire."
    },
  ]
}
```

Which will get turned into asterisks once the text is actually anonymized:

```json
{
  "ops": [
    {
        "insert": "******* *** ****",
        "attributes": { "anonymized": "name-person" }
    },
    {
        "insert": " arrived to the Shire."
    },
  ]
}
```

But regardless of what actual text there is, the `anonymized` format is present.

The specific values allowed are called *kinds*, i.e. which kind of anonymization is this? Their specific list is extracted from the `quillStyles.module.scss` file and as of writing of this documentation, it's these values:

```
name-person
name-organization
personalInformation
contactInformation
other
```

The `anonymized` format uses these as a whitelist, meaning any other value will be ignored if given to Quill through its API.

When rendered to HTML, the `<span>` element will get a corresponding CSS class for each of these values:

```scss
.anonymization--{kind}

// i.e.
.anonymization--name-person
.anonymization--name-organization
.anonymization--personalInformation
.anonymization--contactInformation
```

The `quillStyles.module.scss` file then defines all of these classes to look the same, as a gray background text.


## Text Highlights Overview

When a form field gets a highlighted text span, that highlight is also implemented using a custom Quill format. However, there is one separate format for each form field (but all have the same visual appearance). To make matters worse, these formats must be defined statically before any Quill instance gets created, so we don't yet know what fileds will exist in the form.

This forces us to pre-define a set number of formats (1 000 of them) and number them from `0` upwards. Then, when a form is loaded and we need to display its highlights, the `QuillExtended` class holds a mapping from form field IDs to these highlight format numbers. This is translation layer is internal to `QuillExtended` and is completely hidden from the user.

This is what a delta with highlights looks *to the user*:

```json
{
  "ops": [
    {
        "insert": "Gandalf the Grey arrived to the "
    },
    {
        "insert": "Shire",
        "attributes": { "highlighted@locations.arrival_to": true }
    },
  ]
}
```

The text `Shire` is highlighted for the form field `locations.arrival_to`.

However, internally, the Quill format mapped to the field `locations.arrival_to` is `highlight-37`, so the inner `Quill` instance represents the same document with this delta:

```json
{
  "ops": [
    {
        "insert": "Gandalf the Grey arrived to the "
    },
    {
        "insert": "Shire",
        "attributes": { "highlight-37": true }
    },
  ]
}
```

These Quill formats are registered in the `defineHighlightAttributors.ts` file and must be enabled on a newly created `Quill` instance:

```ts
import {
    allHighlightFormatNames,
    defineHighlightAttributors
} from "defineHighlightAttributors.ts";

// register "highlight-0", "highlight-1", ... formats
// into the Quill library
defineHighlightAttributors();

// and when creating a new Quill instance...
const quill = new Quill(htmlElement, {
    ...
    formats: [
        "bold", "italic", ...

        // enable these formats
        ...allHighlightFormatNames, // "highlight-0", "highlight-1", ...
    ]
});
```


## Extended Delta Format

Because the public user-facing Delta format is slightly different to the internal Delta (because of the allocation of `highlight-X` formats), the `QuillExtended` instance needs to insert a translation layer into the Quill's API whenever delta is going in and out of the internal `Quill` instance.

This translation is performed by the `DeltaMapper` service (internal service within `QuillExtended`).

It has two primary mapping methods:

- `exportDelta(d) -> d` map internal delta object into an external delta object
- `importDelta(d) -> d` maps external delta object into an internal delta object

These are used when Quill's content is requested. However, some Quill's API methods accept only attributes (e.g. formatting methods), so there are additional methods for that:

- `importAttributesObject(obj) -> obj`
- `exportAttributesObject(obj) -> obj`

And even more granular:

- `importAttribute(key, value) -> [key, value]`
- `exportAttribute(key, value) -> [key, value]`


## React

The `QuillExtended` class does not contain any React-specific code. It is fully plain typescript with events providing the necessary reactivity. However, since it's ultimately consumed from within a React application, it exposes specialized methods that are designed to be called directly from React `useEffect` hooks and events that are to be used to trigger React re-renders.

All the logic that actually binds this class to the React app (UI-wise) is located inside the `QuillBinder` react component. It is written to be a thin shell, with all of the complex logic being bundled inside `QuillExtended`. Please refer to the `QuillBinder` component to better understand how the connection is made.

In addition to the UI, there's also the state. To expose the state (text, highlights, selection ranges) of the `QuillExtended` instance to React code, there exists the `ReportStore` service. It exposes the plain typescript state through Jotai atoms in such a way, that it can be consumed by React components in the rest of the application.


## Quill State Renderer

The `QuillExtended` editor changes appearance based on the DocMarker state. More specifically, it reacts to:

- The current `AppMode`, rendering differently for anonymization and highlighting modes.
- The currently selected form field, emphasizing the corresponding highlighted text.

Observation of these two state values is performed by the `QuillBinder` component and it is forwarded as calls to two separate re-render metods on `QuillExtended`.

Within `QuillExtended`, this rendering functionality is factored out into the `QuillStateRenderer` service, which is what ultimately adds and removes CSS classes to/from the Quill and container `<div>` HTML elements. The specific appearance is then specified in the `quillStyles.module.scss` file.


## Events

The underlying `Quill` instance [emits events](https://v1.quilljs.com/docs/api#events) on state change to provide reactivity. Users can register to them via this syntax:

```js
quill.on("event-name", (arg1, arg2, arg3) => {
  // handler
})
```

This is a quite dynamic way of registering event handlers. The library [`strongly-typed-events`](https://www.npmjs.com/package/strongly-typed-events) provides a typescript-first way of defining event. The `QuillExtended` wrapper uses these to define events explicitly. Under the hood, there is one registration to the internal `Quill` instance for each event type, which in-turn invokes the `strongly-typed-events` event and all of its subscribers.

There are these events available:

| STE Event | Quill Event | Description |
| --------- | ----------- | ----------- |
| `onTextChanged` | `text-change` | Fires when text contents change |
| `onSelectionChanged` | `selection-change` | Fires when text selection range changes |
| `-` | `editor-change` | Combines previous two, not exposed in `QuillExtended` |
| `onSelectedFormatChanged` | `-` | Fires when the set of formats under the cursor change - used to update the Toolbar UI through React. Event introduced by the `QuillExtended` wrapper. |

TODO: add the asterisking method to quill


## History

The Quill editor has a [history module](https://v1.quilljs.com/docs/modules/history) enabled by default and it provides the undo/redo functionality to the Quill editor. It works by debouncing changes to the Quill's state and making snapshots, to which the user can return.

Because DocMarker tracks much more state and that state is interlinked with the form, **this history module is explicitly disabled**. Instead, the `HistoryStore` service provides this exact functionality, but to the complete state of the DocMarker application. Refer to that service to learn more about how undo/redo works in DocMarker.


## Toolbar (UI)

The Quill editor has a [toolbar module](https://v1.quilljs.com/docs/modules/toolbar) enabled by default and it renders UI buttons for controlling formatting of the rich text within the Quill editor. In DocMarker, this UI capability is provided by the broader React app instead, which means this Quill module is explicitly disabled.

The toolbar is only available in the text-edting mode of DocMarker and it is implemented in the `Toolbar` React component. It is bound to `QuillExtended` throught the `ReportStore` service.


## Word Selection

The `QuillExtended` wrapper contains logic to grow text-selections in the highlighting app mode to whole words. The idea being that the user highlights text at the word-level, not character-level. This logic is implemented in the `WordSelector` internal service and it works by interception `onSelectionChanged` events before they get emitted and adjusting the selection if needed.

**However, this logic is disabled, because it tunred out to be detremental to the annotation process from the UX perspective.** Also, its effects on the information retrieval model were null.


## Quill API

This is an overview of [Quill API methods](https://v1.quilljs.com/docs/api) that are or are not exposed in `QuillExtended`, more specifically these are their possible states:

- ☑️ Method exposed without any changes
- ✅ Method exposed with interception logic in place
- ❌ Method not exposed (was not needed yet)

| Exposed | Method | Note |
| ------- | ------ | ---- |
| | **Content** | |
| ❌ | `deleteText` | |
| ✅ | `getContents` | Mapping deltas |
| ☑️ | `getLength` | |
| ☑️ | `getText` | |
| ❌ | `insertEmbed` | Not supported by design |
| ❌ | `insertText` | |
| ✅ | `setContents` | Mapping deltas |
| ❌ | `setText` | |
| ❌ | `updateContents` | |
| | **Formatting** | |
| ✅ | `format` | Mapping deltas |
| ✅ | `formatLine` | Mapping deltas |
| ✅ | `formatText` | Mapping deltas |
| ✅ | `getFormat` | Mapping deltas |
| ✅ | `removeFormat` | Not removing highlights and anonymizations |
| | **Selection** | |
| ☑️ | `getBounds` | |
| ☑️ | `getSelection` | |
| ☑️ | `setSelection` | |
| | **Editor** | |
| ☑️ | `blur` | |
| ☑️ | `focus` | |
| ☑️ | `disable` | |
| ☑️ | `enable` | |
| ☑️ | `hasFocus` | |
| ❌ | `update` | |
| | **Events** | |
| ✅ | `text-change` / `onTextChanged` | Mapping deltas |
| ✅ | `selection-change` / `onSelectionChanged` | Intercepted for word selection |
| ❌ | `editor-change` | Was not necessary |
| ❌ | `off` | Replaced by `strongly-typed-events` library |
| ❌ | `on` | Replaced by `strongly-typed-events` library |
| ❌ | `once` | Replaced by `strongly-typed-events` library |
| ❌ | **Model** | Not supported by design |
| ❌ | **Extension** | Not supported by design |


## Extended API

These are API methods added by the `QuillExtended` wrapper to facilitate DocMarker functionality:

| Method | Description |
| ------ | ----------- |
| **Anonymization** | |
| `anonymizeText` | Anonymizes (or removes anonymization) of a given kind in a given range |
| `getAnonymizedRange` | Get the range of anonymized text at a given text location |
| `getAnonymization` | Returns the anonymization kind in a given text range |
| **Highlights** | |
| `highlightText` | Highlights (or removes highlight) for a given field in a given range |
| `getHighlightRange` | Given a field ID and text location, returns the range of the field's highlight at this location. |
| `scrollHighlightIntoView` | Scrolls the Quill editor so that the highlight for the given field ID gets into view. If there are multiple highlights, then calling this function repeatedly loops over them. |
| **Rendering** | Used by `QuillBinder` |
| `attachTo` | Attaches the HTML div container to page DOM |
| `detach` | Detaches the HTML div from the page DOM |
| `renderFieldActivity` | Adjust UI to reflect the currently active field |
| `renderAppMode` | Adjust UI to reflect the currently selected app mode |
| **Word Selection** | |
| `enableWordSelection` | Enables the word selection mode |
| `disableWordSelection` | Disables the word selection mode |
| `isWordSelectionEnabled` | Checks whether word selection is enabled |
| **Selection** | |
| `isClickInsideText` | If the users clicks (changes selection to length 0), this method checks whether the selection is at the end/beginning of text line, in which case the user probably clicked next to the text, or if the click actually was over the textual content. |
| **Formatting** | |
| `getInlineFormatRange` | You point into the text at a specific location and specify a format and its value. This method tells you what is the range of that format value under that specific location (where the format span begins and ends). |
| **Events** | |
| `onSelectedFormatChanged` | Fires when the set of formats under the cursor change - used to update the Toolbar UI through React. |
