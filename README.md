RES-Q+ Client
=============

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
docker build --tag resqplus-client:dev .
```

To run the docker image:

```
docker run --rm -it -p 1234:80 resqplus-client:dev
```
