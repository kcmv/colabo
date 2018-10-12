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
npm link @colabo-puzzles/f-core
npm link @colabo-knalledge/f-core
npm link @colabo-knalledge/f-store_core
npm link @colabo-knalledge/f-view_node
npm link @colabo-knalledge/f-search
npm link @colabo-ware/core
npm link @colabo-ware/rfid
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

Add ROOT node in knodes (`right button > insert document`):

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

Add USERS node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("f7baf6913c0c84b84f0d4029"),
    "name" : "Users",
    "type" : "rima.users",
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

Add USERS edge in kedges (`right button > insert document`):

```json
{
    "_id" : ObjectId("fa379b0f800f2fdd33d2d978"),
    "name" : "Users",
    "type" : "rima.users",
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

Add TAGS node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("f7baf6913c0c84b84f0d4030"),
    "name" : "Tags",
    "type" : "rima.tags",
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

Add TAGS edge in kedges (`right button > insert document`):

```json
{
    "_id" : ObjectId("fa379b0f800f2fdd33d2d979"),
    "name" : "Tags",
    "type" : "rima.tags",
    "mapId" : ObjectId("f7baf6923c0c84b84f0d402a"),
    "iAmId" : ObjectId("556760847125996dc1a4a241"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("f7baf6913c0c84b84f0d4028"),
    "targetId" : ObjectId("f7baf6913c0c84b84f0d4030"),
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

(TEST ONLY)

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

# Interests population

Interesting images
+ https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn0.iconfinder.com%2Fdata%2Ficons%2Fpositive-and-neutral-character-traits-alphabet-v-w%2F281%2Fpositive-wxyz003-512.png&imgrefurl=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F2306705%2Fhobbies_hobby_interests_man_skill_skillful_well-rounded_icon&docid=CNrs61HBDNW4JM&tbnid=60jNBkVYemEYdM%3A&vet=10ahUKEwixouGogLDaAhUODKwKHQY-B8UQMwjHASgdMB0..i&w=466&h=512&bih=780&biw=1440&q=interests&ved=0ahUKEwixouGogLDaAhUODKwKHQY-B8UQMwjHASgdMB0&iact=mrc&uact=8#h=512&imgdii=60jNBkVYemEYdM:&vet=10ahUKEwixouGogLDaAhUODKwKHQY-B8UQMwjHASgdMB0..i&w=466

(TEST ONLY)

```JSON
{
  "tagsGroups": [
    {
      "name": "Diversity Background",
      "parentTagsGroup": null,
      "image": {
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuUi6NLEdnBBJxtgrclUt2o5orAvHNc79vV01mfr39wtF_6Hq"
      }
    },
    {
      "name": "Interests",
      "parentTagsGroup": null,
      "image": {
        "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
      }
    },
    {
      "name": "Interest Helping",
      "parentTagsGroup": "Interests",
      "image": {
        "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
      }
    },
    {
      "name": "Interest 2",
      "parentTagsGroup": "Interests",
      "image": {
        "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
      }
    }
  ],
  "tags": [
    {
      "name": "Art",
      "tagGroup": "Diversity Background",
      "image": {
        "url": "https://images.fineartamerica.com/images-medium-large-5/hummingbird-of-watercolor-rainbow-olga-shvartsur.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009592295"
      }
    },
    {
      "name": "Refugee",
      "tagGroup": "Diversity Background",
      "image": {
        "url": "http://www.refugeesarewelcome.org/wp-content/uploads/2016/04/RS4622_jordan2012jeffrey-2675-copy.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009595752"
      }
    },
    {
      "name": "Hunger",
      "tagGroup": "Interest Helping",
      "image": {
        "url": "https://i.ndtvimg.com/i/2015-12/hunger-problem-india-istock_650x400_51449064006.jpg"
      },
      "coLaboWareData": {
          "type": 1,
          "value": "0009595752"
      }
    }
  ]
}
```

(TEST ONLY)
Here is also a test interest between the user and tag:
USER_ID: 5acd58f603c526c90d8b124a
TAG_ID: 5acd65aa03c526c90d8b1254
```json
{
    "_id" : ObjectId("fa379b0f800f2fdd33d2d980"),
    "name" : "Interest",
    "type" : "rima.user_interest",
    "mapId" : ObjectId("f7baf6923c0c84b84f0d402a"),
    "iAmId" : ObjectId("556760847125996dc1a4a241"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5acd58f603c526c90d8b124a"),
    "targetId" : ObjectId("5acd65aa03c526c90d8b1254"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "createdAt" : ISODate("2018-04-07T17:31:05.031+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}

```

Users:
01. African Wild Dog, 0000627088
02. Amur Leopard, 0009893200
03. Amur Tiger, 0009610151

Tags:

ROLES:
Refugee, 0009592295
Local, 0009672284
Activist, 0009671736

Interest Helping:
Hunger, 0009609788
Health, 0009595752
Food, 0009668945

Interest 2:
Interest A1, 0003739468
Interest A2, 0003678978
Interest A3, 0003736466

# Updating

https://stackoverflow.com/questions/43931986/how-to-upgrade-angular-cli-to-the-latest-version

## angular

`yarn add @angular/animations@5.0.1 @angular/common@5.0.1 @angular/compiler@5.0.1 @angular/core@5.0.1 @angular/forms@5.0.1 @angular/http@5.0.1 @angular/platform-browser@5.0.1 @angular/platform-browser-dynamic@5.0.1 @angular/router@5.0.1`

` @angular/material@5.0.1
@angular/cdk@
@angular/flex@`
