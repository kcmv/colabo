# Moderation Database Commands

## Played Cards

### Finding

```mongo
db.getCollection("knodes").find({ type: "topiChat.talk.chatMsg", mapId: ObjectId("5be3fddce1b7970d8c6df406"), 'dataContent.dialoGameReponse.playRound': NumberInt(2)})
```

### Reseting DB

https://docs.mongodb.com/manual/reference/operator/update/unset/#up._S_unset

#### Reseting played Card

```mongo
db.getCollection("knodes").updateMany( { type: "topiChat.talk.chatMsg"}, { $unset: { 'dataContent.dialoGameReponse': '' } } )
```

#### Reseting All played Cards in Specific Map

```mongo
db.getCollection("knodes").updateMany( { type: "topiChat.talk.chatMsg", mapId: ObjectId("5be3fddce1b7970d8c6df406")}, { $unset: { 'dataContent.dialoGameReponse': '' } } )
```

#### Reseting All played Cards in Specific Map and Round

```mongo
db.getCollection("knodes").updateMany( { type: "topiChat.talk.chatMsg", mapId: ObjectId("5be3fddce1b7970d8c6df406"), 'dataContent.dialoGameReponse.playRound': NumberInt(1)}, { $unset: { 'dataContent.dialoGameReponse': '' } } )
```

## cwc_similarities

### Deleting All cwc_similarities

```mongo
db.getCollection("knodes").deleteMany({ type: "service.result.dialogame.cwc_similarities"})
```

### Deleting All cwc_similarities in the map

```mongo
db.getCollection("knodes").deleteMany({ type: "service.result.dialogame.cwc_similarities", mapId: ObjectId("5be3fddce1b7970d8c6df406")})
```

R

### Played Cards Edges

#### Deleting All cwc_similarities in the map

```mongo
db.getCollection("knodes").deleteMany({ type: "service.result.dialogame.cwc_similarities", mapId: ObjectId("5be3fddce1b7970d8c6df406")})
```