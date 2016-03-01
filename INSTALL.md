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
