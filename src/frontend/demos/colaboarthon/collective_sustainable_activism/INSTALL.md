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
# npm link @colabo-knalledge/knalledge_view_node
# npm link @colabo-knalledge/knalledge_search
# npm link @colabo-colaboware/colaboware_core
# npm link @colabo-colaboware/colaboware_rfid
```

# Deploy

Build

```sh
# set the server backend addr at
# KnAllEdge/src/frontend/dev_puzzles/knalledge/knalledge_store_core/cf.service.ts
# to
# static serverAP = "http://158.39.75.120:8001"; // colabo-space-1
ng build --prod --build-optimizer
```


# KnAllEdge content

## Map

Add map in kmaps (`right button > insert document`):

```json
{ 
    "_id" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "name" : "Forum Vlasina + Remaking Tesla", 
    "rootNodeId" : ObjectId("5b49e94636390f03580ac9a8"), 
    "type" : "CoLaboArthon", 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "parentMapId" : "", 
    "dataContent" : null, 
    "updatedAt" : ISODate("2018-07-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-07-10T01:07:10.400+0000"),
    "isPublic" : true, 
    "participants" : [
        ObjectId("556760847125996dc1a4a24f")
    ], 
    "version" : NumberInt(1), 
    "activeVersion" : NumberInt(1), 
    "__v" : NumberInt(0)
}
```

## ROOT node

Add ROOT node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b49e94636390f03580ac9a8"),
    "name" : "Forum Vlasina + Remaking Tesla",
    "type" : "model_component",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-07-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-07-10T01:07:10.400+0000"),
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
        "property" : "Welcome to 'Networking for collective sustainable activism'"
    }
}
```

## USERS

Add USERS node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b4a16e800ea79029ca0c395"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-07-10T01:18:20.440+0000"),
    "createdAt" : ISODate("2018-07-10T01:18:20.439+0000"),
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
    "_id" : ObjectId("5b4a1b3c00ea79029ca0c39a"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"),
    "targetId" : ObjectId("5b4a16e800ea79029ca0c395"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-07-10T01:18:20.619+0000"),
    "createdAt" : ISODate("2018-07-10T01:18:20.618+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

## SDGs

Add SDG node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b4a91d800ea790a4738a6e5"),
    "name" : "SDGs",
    "type" : "const.sdgs",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-07-10T01:25:34.694+0000"),
    "createdAt" : ISODate("2018-07-10T01:25:34.693+0000"),
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

Add SDG edge in kedges (`right button > insert document`):

```json
{
    "_id" : ObjectId("5b4a922700ea790a4738a6e9"),
    "name" : "SDGs",
    "type" : "const.sdgs",
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
    "iAmId" : ObjectId("5b4a91d800ea790a4738a6e5"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"),
    "targetId" : ObjectId("5af39f8e2843ddf04b459cba"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"),
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

## CONTENT

Add CONTENT node in knodes (`right button > insert document`):

```json
{ 
    "_id" : ObjectId("5b4a926600ea790a4738a6ea"), 
    "name" : "Content", 
    "type" : "clathon.content", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "visual" : {
        "isOpen" : true
    }, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
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
    "_id" : ObjectId("5b4a92ca00ea790a4738a6eb"),
    "name" : "Content", 
    "type" : "clathon.content", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5b49e94636390f03580ac9a8"), 
    "targetId" : ObjectId("5b4a926600ea790a4738a6ea"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
}
```

## SDGs Population

**Nodes:**

```JSON
[
  {
      "_id" : ObjectId("5b4b218c00ea790a4738a702"),
      "name" : "1. NO POVERTY",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(1),
          image: {
              url: 'assets/images/sdg1.jpg'
              // width: image.width,
              // height: image.height
          },
          goal:  "To end poverty in all its forms everywhere by 2030",
          desc: "More than 700 million people still live in extreme poverty and are struggling to fulfil the most basic needs like health, education, and access to water and sanitation, to name a few. The overwhelming majority of people living on less than $1.90 a day live in Southern Asia and sub-Saharan Africa. However, this issue also affects developed countries. Right now there are 30 million children growing up poor in the world’s richest countries."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "_id" : ObjectId("5b4b21b700ea790a4738a703"),
      "name" : "2. ZERO HUNGER",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(2),
          image: {
              url: 'assets/images/sdg2.jpg'
              // width: image.width,
              // height: image.height
          },
          goal:  "To end hunger, achieve food security and improved nutrition and promote sustainable agriculture",
          desc: "A profound change of the global food and agriculture system is needed to nourish today’s 795 million hungry and the additional 2 billion people expected by 2050. Extreme hunger and malnutrition remains a barrier to sustainable development and creates a trap from which people cannot easily escape. Hunger and malnutrition mean less productive individuals, who are more prone to disease and thus often unable to earn more and improve their livelihoods."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
  {
      "_id" : ObjectId("5b4b21d900ea790a4738a704"),
      "name" : "3. GOOD HEALTH AND WELL-BEING",
      "iAmId" : ObjectId("556760847125996dc1a4a24f"),
      "mapId" : ObjectId("5b49e7f736390f03580ac9a7"),
      "type" : "const.sdgs.sdg",
      "dataContent" : {
          "humanID" : NumberInt(3),
          image: {
              url: 'assets/images/sdg3.jpg'
              // width: image.width,
              // height: image.height
          },
          goal:  "Ensure healthy lives and promote well-being for all at all ages",
          desc: "Мore than 6 million children still die before their fifth birthday every year. 16,000 children die each day from preventable diseases such as measles and tuberculosis. Every day hundreds of women die during pregnancy or from child-birth related complications. In many rural areas, only 56 percent of births are attended by skilled professionals. AIDS is now the leading cause of death among teenagers in sub-Saharan Africa, a region still severely devastated by the HIV epidemic."
      },
      "updatedAt" : ISODate("2018-07-10T20:16:47.306+0000"),
      "createdAt" : ISODate("2018-07-10T20:16:47.301+0000"),
      "visual" : {
          "isOpen" : false
      },
      "isPublic" : true,
      "version" : NumberInt(1),
      "activeVersion" : NumberInt(1),
      "__v" : NumberInt(0)
  },
]
```

**Edges:**

```json
[
  { 
    "_id" : ObjectId("5b4b22d900ea790a4738a705"),
    "name" : "SDG", 
    "type" : "const.sdgs.sdg", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5af5fa2f054a87e71f4ed862"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  },
  { 
    "_id" : ObjectId("5b4b22fd00ea790a4738a706"),
    "name" : "SDG", 
    "type" : "const.sdgs.sdg", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5b4b21b700ea790a4738a703"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  },
  { 
    "_id" : ObjectId("5b4b231e00ea790a4738a707"),
    "name" : "SDG", 
    "type" : "const.sdgs.sdg", 
    "mapId" : ObjectId("5b49e7f736390f03580ac9a7"), 
    "iAmId" : ObjectId("556760847125996dc1a4a24f"), 
    "ideaId" : NumberInt(0), 
    "sourceId" : ObjectId("5af6438da070880131440a23"), 
    "targetId" : ObjectId("5b4b21d900ea790a4738a704"), 
    "dataContent" : null, 
    "visual" : null, 
    "updatedAt" : ISODate("2018-07-10T01:25:34.934+0000"), 
    "createdAt" : ISODate("2018-07-10T01:25:34.933+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true, 
    "__v" : NumberInt(0)
  }
]
```

## Users Population

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
