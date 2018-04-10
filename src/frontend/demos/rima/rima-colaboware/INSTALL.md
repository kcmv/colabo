# Intro

This is a MEAN stack app so you should have node + npm installed and then do a standard npm install based on the `package.json`

`npm install`

or even better

`yarn install`

You can set the yarn as an angular-cli default:

`ng set --global packageManager=yarn`

# linked npm packages

Some of the packages are not available (or not the latests) at the npm repository, so you should link them locally from the corresponding local repositories.

## Colabo packages

This packages come from the Colabo Ecosystem and from its [Colabo github repository](https://github.com/cha-os/knalledge).

You need to:

1. install it locally
2. export each of used packages as global npm packages (with `npm local` command)
3. import them in this project with:

```sh
npm link @colabo-puzzles/puzzles_core
npm link @colabo-knalledge/knalledge_core
npm link @colabo-knalledge/knalledge_store_core
npm link @colabo-knalledge/knalledge_view_node
npm link @colabo-knalledge/knalledge_search
npm link @colabo-colaboware/colaboware_core
npm link @colabo-colaboware/colaboware_rfid
```

# KnAllEdge content

Add map in kmaps (`right button > insert document`):

```json
{
    "_id" : ObjectId("f7baf6923c0c84b84f0d402a"),
    "name" : "Play Perform Learn Grow Conference 2018 - Thessaloniki",
    "rootNodeId" : ObjectId("f7baf6913c0c84b84f0d4028"),
    "type" : "CollaboArte",
    "iAmId" : ObjectId("556760847125996dc1a4a241"),
    "ideaId" : NumberInt(0),
    "parentMapId" : "",
    "dataContent" : null,
    "__v" : NumberInt(0),
    "updatedAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "createdAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "isPublic" : false,
    "participants" : [
    ],
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1)
}
```

Add root node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("f7baf6913c0c84b84f0d4028"),
    "name" : "CoLaboArthon Map",
    "type" : "type_knowledge",
    "mapId" : ObjectId("f7baf6923c0c84b84f0d402a"),
    "iAmId" : ObjectId("556760847125996dc1a4a241"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "createdAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "visual" : {
        "isOpen" : true
    },
    "isPublic" : true,
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1),
    "__v" : NumberInt(0),
    "decorations" : {

    },
    "up" : {

    },
    "dataContent" : {
        "propertyType" : "text/markdown",
        "property" : "Welcome to CoLaboArthon"
    }
}
```

Add users node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("f7baf6913c0c84b84f0d4029"),
    "name" : "Users",
    "type" : "type_users",
    "mapId" : ObjectId("f7baf6923c0c84b84f0d402a"),
    "iAmId" : ObjectId("556760847125996dc1a4a241"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "createdAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "visual" : {
        "isOpen" : true
    },
    "isPublic" : true,
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1),
    "__v" : NumberInt(0),
    "decorations" : {

    },
    "up" : {

    },
    "dataContent" : {
    }
}
```

Add users edge in kedges (`right button > insert document`):

```json
{
    "_id" : ObjectId("fa379b0f800f2fdd33d2d978"),
    "name" : "Users",
    "type" : "type_users",
    "mapId" : ObjectId("f7baf6923c0c84b84f0d402a"),
    "iAmId" : ObjectId("556760847125996dc1a4a241"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("f7baf6913c0c84b84f0d4028"),
    "targetId" : ObjectId("f7baf6913c0c84b84f0d4029"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "createdAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

# Users Population

```JSON
[
  {
    "name": "01. Hawskbill Turtle",
    "number": "01",
    "image": {
      "url": "http://r.ddmcdn.com/s_f/o_1/cx_0/cy_34/cw_2001/ch_2001/w_720/APL/uploads/2015/11/Hawksbill-Turtle-FRONT-PAGE.jpg"
    },
    "coLaboWareData": {
        "type": 1,
        "value": "0009592295"
    }
  },
  {
    "name": "02. Giant Panda",
    "number": "02",
    "image": {
      "url": "http://r.ddmcdn.com/s_f/o_1/cx_11/cy_776/cw_1957/ch_1957/w_720/APL/uploads/2015/11/giant-panda-FRONT-PAGE.jpg"
    },
    "coLaboWareData": {
        "type": 1,
        "value": "0009595752"
    }
  }
]
```

# Updating

https://stackoverflow.com/questions/43931986/how-to-upgrade-angular-cli-to-the-latest-version

## angular

`yarn add @angular/animations@5.0.1 @angular/common@5.0.1 @angular/compiler@5.0.1 @angular/core@5.0.1 @angular/forms@5.0.1 @angular/http@5.0.1 @angular/platform-browser@5.0.1 @angular/platform-browser-dynamic@5.0.1 @angular/router@5.0.1`

` @angular/material@5.0.1
@angular/cdk@
@angular/flex@`
