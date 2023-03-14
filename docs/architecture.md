Archtiecture of the entire application
======================================

The application is large and complicated, therefore many concerns are separated to make sense of the whole thing. The primary separation is the separation of user interface (UI) from the application state.

    [ UI ]  <--- separated --->  [ State ]

The UI is rendered using React and it's structure is independant on the state hierarchy. The state is extracted using the Jotai state management library. This lets us keep the state in a number of semi-independent stores, each dealing with a subset of the app's responsibility. The UI is updated to match the state. This simplifies the application logic as it only has to deal with the state, not the UI.


Application State
-----------------

The state is kept in stores defined in `src/state`. The primary purpose of the app is to create and modify *app files*, that is, the JSON files that the application produces. The structure of an app file is desribed in [app-file.md](app-file.md) and it serves as the basis of the overall application state. The app file more or less represents the serialized version of the application state, the application, however, may also hold additional runtime-only state.

The app file structure is not kept during runtime. When the file is loaded, it is dissolved into corresponding state stores and when the file is written, it is extracted again. The details of this loading/storing or serialization/deserialization procedure are implemented in the `src/state/fileStore.js` file. This file also keeps additional app file metadata that is not very useful at runtime (e.g. the file UUID). It also keeps track of whether a file is open or not.

             [fileStore]       [editorStore]     [userPreferencesStore]
               /      \
    [reportStore]   [formStore]

File store also watches other stores for changes and handles autosaving. In addition, it also exposes the list of stored files in local storage via jotai atoms to the rest of the application.

The `src/stores/editorStore.js` holds the runtime state of the application, like the active field or the current application mode.

The `src/stores/userPreferencesStore.js` holds the settings the user has specified for the app, like localization or view options. This store is also responsible for persisting this state (which currently does not happen).


User Interface
--------------

TODO
