# Moderation Database Commands

## Notes

- to be used in ***"Studio 3T" IntelliShell***

## Played Cards

### Finding

```mongo
db.getCollection("knodes").find({ type: "topiChat.talk.chatMsg", mapId: ObjectId("5be3fddce1b7970d8c6df406"), 'dataContent.dialoGameReponse.playRound': NumberInt(2)})
```

https://docs.mongodb.com/manual/reference/operator/update/unset/#up._S_unset

### Reseting played Card

```mongo
db.getCollection("knodes").updateMany( { type: "topiChat.talk.chatMsg"}, { $unset: { 'dataContent.dialoGameReponse': '' } } )
```

### Reseting All played Cards in Specific Map

```mongo
db.getCollection("knodes").updateMany( { type: "topiChat.talk.chatMsg", mapId: ObjectId("5be3fddce1b7970d8c6df406")}, { $unset: { 'dataContent.dialoGameReponse': '' } } )
```

### Reseting All played Cards in Specific Map and Round

```mongo
db.getCollection("knodes").updateMany( { type: "topiChat.talk.chatMsg", mapId: ObjectId("5be3fddce1b7970d8c6df406"), 'dataContent.dialoGameReponse.playRound': NumberInt(1)}, { $unset: { 'dataContent.dialoGameReponse': '' } } )
```

### DG Responses  Edges

#### Deleting All response edges in map

```mongo
db.getCollection("kedges").remove({ type: "dialogame.response",  mapId: ObjectId("5be3fddce1b7970d8c6df406")})
```

#### Deleting All response edges in map and round

```mongo
db.getCollection("kedges").remove({ type: "dialogame.response",  mapId: ObjectId("5be3fddce1b7970d8c6df406"), 'dataContent.playRound': NumberInt(1)})
```

## cwc_similarities

### Deleting All *cwc_similarities*

```mongo
db.getCollection("knodes").deleteMany({ type: "service.result.dialogame.cwc_similarities"})
```

### Deleting All *cwc_similarities* in the map

```mongo
db.getCollection("knodes").deleteMany({ type: "service.result.dialogame.cwc_similarities", mapId: ObjectId("5be3fddce1b7970d8c6df406")})
```

### colaboflow.state

#### Reseting colaboflow.state

```mongo
db.getCollection("knodes").updateMany({type: 'colaboflow.state', mapId: ObjectId("5be3fddce1b7970d8c6df406")}, { $set: { "dataContent.playRound" : NumberInt(1) } })
```

## Users Management

### **Delete users in list and their edges**

```mongo
//nodes:
db.getCollection("knodes").remove({
 '_id': { $in: 
   [
ObjectId('5be4725d8bce9b0f7d697627'),
ObjectId('5be48554df2a152a7689924d'),
ObjectId('5be4cd17df2a152a76899255'),
ObjectId('5be4cd3cdf2a152a76899257'),
ObjectId('5be4cd9fdf2a152a76899259'),
ObjectId('5be55940df2a152a7689925b'),
ObjectId('5be55a09df2a152a7689925d')
] } 
})

//edges:
db.getCollection("kedges").remove({
 'targetId': { $in: [
ObjectId('5be4725d8bce9b0f7d697627'),
ObjectId('5be48554df2a152a7689924d'),
ObjectId('5be4cd17df2a152a76899255'),
ObjectId('5be4cd3cdf2a152a76899257'),
ObjectId('5be4cd9fdf2a152a76899259'),
ObjectId('5be55940df2a152a7689925b'),
ObjectId('5be55a09df2a152a7689925d')] }, type: 'rima.user' 
})
```

### Extracting Users

```mongo
//nodes:
db.getCollection("knodes").find({
 '_id': { $in: [ObjectId('5be4cd9fdf2a152a76899259'), 
  ObjectId('5bea48c29e58566cdf3cf8a2')] } 
})

//edges:
db.getCollection("kedges").find({
 'targetId': { $in: [ObjectId('5be4cd9fdf2a152a76899259'), 
  ObjectId('5bea48c29e58566cdf3cf8a2')] }, type: 'rima.user' 
})
```

**Delete users' CWCs**

```mongo
db.getCollection("kedges").remove({ type: "dialogame.response"
  ,
iAmId: { $in: [ObjectId('5be48554df2a152a7689924d'), 
  ObjectId('5be4cd17df2a152a76899255'), ObjectId('5be4cd3cdf2a152a76899257'), ObjectId('5be55940df2a152a7689925b'), 
  ObjectId('5be55a09df2a152a7689925d'), ObjectId('5be8016cea26326ca9035c66'), ObjectId('5be80175ea26326ca9035c68'),
  ObjectId('5be8b244568c282f94e27dd2'),
  ObjectId('55268521fb9a901e442172f8')
  ] }
})

//edges:
db.getCollection("kedges").remove({
 'targetId': { $in: [ObjectId('5be48554df2a152a7689924d'), 
  ObjectId('5be4cd17df2a152a76899255'), ObjectId('5be4cd3cdf2a152a76899257'), ObjectId('5be55940df2a152a7689925b'), 
  ObjectId('5be55a09df2a152a7689925d'), ObjectId('5be8016cea26326ca9035c66'), ObjectId('5be80175ea26326ca9035c68'),
  ObjectId('5be8b244568c282f94e27dd2')
  ] }, type: 'rima.user' 
})
```



