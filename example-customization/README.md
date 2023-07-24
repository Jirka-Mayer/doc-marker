Example DocMarker customization
===============================

Copy this folder and modify the code to create your own DocMarker customization.


## Building the application

After copying this folder, install dependencies:

```
npm install
```

To start the development Parcel server:

```
npm run start
```

To build the application into the `dist` folder:

```
npm run build
```


## Developing together with DocMarker

Clone the [DocMarker repository](https://github.com/Jirka-Mayer/doc-marker) and then tell NPM to symlink the `doc-marker` dependency in your `package.json` with the DocMarker clone:

```
npm link ../../path-to-clone-of/doc-marker
```

Also, `npm install` must be run inside the DocMarker clone to resolve its dependencies. They will not be installed in the customization's `node_modules`, unfortunately.

This way you can work on both projects simultaneously and immediately test changes made to the DocMarker library. The only problem is that Parcel does not detect file changes in the DocMarker, because it's behind a symlink. You need to restart parcel to see the changes.

Also, you can have the same set up with your own fork of the DocMarker repostiory of you don't have access to the original repo or you want to maintain your own advanced modifications.
