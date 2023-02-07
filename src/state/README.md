# Application state

The state of the appication is kept in a set of stores, each having a particular responsibility. The state is managed by the library [Jotai](https://jotai.org/) which lets us decouple the state from the React component hierarchy and build up complex state from simple atoms.


## File Store

File store contains state about the opened file. It tracks, whether a file is open, what file is open, properties of this file and also provides actions for loading, storing, downloading, importing, or exporting the file.

It outsources two of its most complex responsibilities into the *report store* and *form store*. These two store are controled by the *file store* but act semi-independently.


## Report Store

Report store encapsulates the Quill editor which holds the state of the discharge report. It integrates this state into React by providing read-only atoms and action atoms that can modify this state.


## Form Store

Form store contains the loaded form definition (ui schema and data schema) and the current state of the form (the data, field states, and any other additional data).


## Editor Store

Editor store contains all the run-time temporary state of the app (as a *file editor* app). This state is not persisted in any way. It contains the app mode, the active form field and other working state that spans the entire application.

## User Preferences Store

User preferences store also holds state of the editor app (like *editor store*), but the primary distinction is that its state is persisted to local storage. This includes the chosen app language, time format, or debugging info visibility.
