DocMarker for RES-Q+
====================

Try it out at: https://ufallab.ms.mff.cuni.cz/~mayer/resq-doc-marker/

After cloning the repo:

```
npm install
```

To start the development server:

```
npm run start
```

To add new dependency:

```
npm install --save-dev XYZ
```

Developed on node `v16.14.0`.

To build the docker image:

```
npm run dockerBuild
```

To run the docker image:

```
npm run dockerRun
```

To push the docker image to Docker Hub:

```
npm run dockerPush
```

To build for a static website:

```
npm run build
```
