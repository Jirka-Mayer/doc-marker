# Report State

The state regarding the discharge report and the Quill editor should be represented by a single store from the perspective of the React application. This store is called the *report store*.

The store however needs to talk to the Quill instance, since that is the true owner of the state. But there is a lot of UI baggage attached to the Quill instance (e.g. highlight styling) and that should not really be placed under the "state" category.

The "Quill and its friends" are kept outside the `state` folder in a `quill` folder and only the store is kept here.
