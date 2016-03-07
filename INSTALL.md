# Building Process

The majority of server and client components are built on **MEAN stack** so the environment necessary for starting tool should be straightforward.

## Server
Server is at the moment completely built as **node.js** environment. Therefore you need node and npm tools installed to run it properly. When you have them installed all you need to do is to install necessary packages with

    npm install

**NOTE**: Backend needs a special ```express-resource``` package on steroids. You can download it as a separate package [here](). After or even before issuing ```npm install``` you should (re)place the content of the archive:

1. in your ```backend/node_modules``` folder and
2. in ```backend/modules/topiChat```

and (re)start the server

    npm start

## MongoDB

Default MongoDB installation should be good enough. The mongo database must be running before starting the server.

# Running the backend

When you want to run the server you need to run specific ```package.json``` command: start. You do it by running:

npm start

Server will start, connect to default mongodb port and start listening for client connections on the announced port.

## Client

![KnAllEdge - frontend class-diagram](documents/diagrams/KnAllEdge-frontend-class-diagram.png)

Client is implemented at the moment as a ng1/2 hybrid (Angular1/Angular2). Angular

### Debugging support

Debugging is handled with the support of the [debugpp](https://www.npmjs.com/package/debugpp) and [debug](https://www.npmjs.com/package/debug) libraries. Therefore in the browser console you need to enable debugging in order to see it:

This is how you would globally enable debugging:
```js
localStorage.debug = '*';
```

or just for particular namespace (and all subspaces)
```js
localStorage.debug = 'knalledge.collaboPluginsServices.*';
```

or just for the semantic-subspace (`error` in this case) of a for particular namespace:
```js
localStorage.debug = 'knalledge.collaboPluginsServices.*.error';
```

### Development deployment

#### server
Anything that should be served OUT of the dist/dev folder, should be mapped in the server config to be available: `src/frontend/tools/utils/code_change_tools.ts`

This is how we have enabled `bower_components`:

```js
let routes:any = {
  ...
  '/bower_components': 'bower_components'
};

```

### DefinitelyTyped conflicts

jQuery and Protractor (Seleinum) both use the same global variable: ```$```. There fore TypeScript compiler complains:

    ⨯ Unable to compile TypeScript

    typings/main/ambient/jquery/jquery.d.ts (3212,13): Subsequent variable declarations must have the same type.  Variable '$' must be of type 'cssSelectorHelper', but here has type 'JQueryStatic'. (2403)

At the moment there is no simple solution except remove it from some of the tools, etc.
We did remove it manually:

Here are
