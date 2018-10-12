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
    "_id" : ObjectId("5af39ce82843ddf04b459cb0"),
    "name" : "Poesia in strada - Collaborazione poetica sui rifugiati",
    "rootNodeId" : ObjectId("5af39ce82843ddf04b459cae"),
    "type" : "CoLaboArthon",
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "parentMapId" : "",
    "dataContent" : null,
    "updatedAt" : ISODate("2018-05-10T01:14:16.401+0000"),
    "createdAt" : ISODate("2018-05-10T01:14:16.400+0000"),
    "isPublic" : true,
    "participants" : [
        ObjectId("556760847125996dc1a4a24f")
    ],
    "version" : NumberInt(1),
    "activeVersion" : NumberInt(1),
    "__v" : NumberInt(0)
}
```

Add ROOT node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5af39ce82843ddf04b459cae"),
    "name" : "Poesia in strada - Collaborazione poetica sui rifugiati",
    "type" : "model_component",
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-05-10T01:14:16.063+0000"),
    "createdAt" : ISODate("2018-05-10T01:14:16.061+0000"),
    "visual" : {
        "isOpen" : true,
        "yM" : NumberInt(0),
        "xM" : NumberInt(0)
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
    "_id" : ObjectId("5af39ddc2843ddf04b459cb3"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-05-10T01:18:20.440+0000"),
    "createdAt" : ISODate("2018-05-10T01:18:20.439+0000"),
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
    "_id" : ObjectId("5af39ddc2843ddf04b459cb5"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5af39ce82843ddf04b459cae"),
    "targetId" : ObjectId("5af39ddc2843ddf04b459cb3"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-05-10T01:18:20.619+0000"),
    "createdAt" : ISODate("2018-05-10T01:18:20.618+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

Add TAGS node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5af39f8e2843ddf04b459cba"),
    "name" : "Tags",
    "type" : "rima.tags",
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-05-10T01:25:34.694+0000"),
    "createdAt" : ISODate("2018-05-10T01:25:34.693+0000"),
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
    "_id" : ObjectId("5af39f8e2843ddf04b459cbc"),
    "name" : "Tags",
    "type" : "rima.tags",
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5af39ce82843ddf04b459cae"),
    "targetId" : ObjectId("5af39f8e2843ddf04b459cba"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-05-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-05-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

Add CONTENT node in knodes (`right button > insert document`):

```json
{ 
    "_id" : ObjectId("5af6438da070880131440a23"), 
    "name" : "Content", 
    "type" : "clathon.content", 
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "visual" : {
        "isOpen" : true
    }, 
    "updatedAt" : ISODate("2018-05-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-05-10T01:25:34.933+0000"), 
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

Add CONTENT edge in kedges (`right button > insert document`):

```json
{ 
    "name" : "Content", 
    "type" : "clathon.content", 
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af39ce82843ddf04b459cae"), 
    "targetId" : ObjectId("5af6438da070880131440a23"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-05-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-05-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0), 
    "_id" : ObjectId("5af644c7a070880131440a2a")
}
```

# Prompts Population

**Nodes:**

```JSON
[
  {
      "_id" : ObjectId("5af5fa2f054a87e71f4ed862"),
      "name" : "i nostri occhi sono terribilmente enormi perché ...",
      "iAmId" : ObjectId("5af498bc24dccbbc244c4f0c"),
      "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
      "type" : "clathon.content.prompt",
      "dataContent" : {
          "humanID" : NumberInt(1)
      },
      "updatedAt" : ISODate("2018-05-11T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-05-11T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "_id" : ObjectId("5af5fafa8580c921207b5070"),
      "name" : "Negli occhi dei migranti, persino. Ci guardano come immortali, perché ...",
      "iAmId" : ObjectId("5af498bc24dccbbc244c4f0c"),
      "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
      "type" : "clathon.content.prompt",
      "updatedAt" : ISODate("2018-05-11T20:20:10.469+0000"),
      "createdAt" : ISODate("2018-05-11T20:20:10.465+0000"),
      "visual" : {
          "isOpen" : false
      },
      "dataContent" : {
          "humanID" : NumberInt(2)
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "_id" : ObjectId("5af5fbe031b2ef4220e0bbdc"),
      "name" : "Dove sei diretto? Perché vergognarsi di morire sulla tua porta di casa? Perché ...",
      "iAmId" : ObjectId("5af498bc24dccbbc244c4f0c"),
      "mapId" : ObjectId("5af39ce82843ddf04b459cb0"),
      "type" : "clathon.content.prompt",
      "dataContent" : {
          "humanID" : NumberInt(3)
      },
      "updatedAt" : ISODate("2018-05-11T20:24:00.939+0000"),
      "createdAt" : ISODate("2018-05-11T20:24:00.935+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true, 
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  }
]
```



**Edges:**

```json
[
  { 
    "name" : "Prompt", 
    "type" : "clathon.content.prompt", 
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5af5fa2f054a87e71f4ed862"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-05-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-05-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  },
  { 
    "name" : "Prompt", 
    "type" : "clathon.content.prompt", 
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5af5fafa8580c921207b5070"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-05-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-05-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  },
  { 
    "name" : "Prompt", 
    "type" : "clathon.content.prompt", 
    "mapId" : ObjectId("5af39ce82843ddf04b459cb0"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5af5fbe031b2ef4220e0bbdc"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-05-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-05-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  }
]
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
