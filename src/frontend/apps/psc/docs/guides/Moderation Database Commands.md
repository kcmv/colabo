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



