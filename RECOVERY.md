## recover deleted node

### find mapid

Go to kmaps and find map and its id. In our case it is `57c92028ca4a05322fe26eb4`.

query:
```json
{ "name": "Futuriser" }
```

### find root node

{ "name": "Futuriser", $and: [ { "mapId": ObjectId("57c92028ca4a05322fe26eb4") } ] }

Futuriser root node: 57c92027ca4a05322fe26eb2

### find node that is the parent of the deleted node

In our case it is `Futuriser`

go to knodes and search for the `Futuriser` node with our mapid

```json
{ "name": "Futuriser", $and: [ { "mapId": ObjectId("57c92028ca4a05322fe26eb4") } ] }
```

we got our id: `57c92027ca4a05322fe26eb2`

### Create the missing node

We just create it through web interface. In our case it is `group 2`


Then we find its id in the db tool:

```json
{ "name": "group 2", $and: [ { "mapId": ObjectId("57c92028ca4a05322fe26eb4") } ] }
```
It is `57cbdd31ca4a05322fe2af26`

### Find nodes without parent

#### Open list of all nodes

in knodes collection find all nodes that belong to the map:

```json
{mapId: ObjectId("57c92028ca4a05322fe26eb4")}
```

Search through them and find any potentially missing node and get their IDs.

Ids:

```
57c92062ca4a05322fe26ec3
57cab827ca4a05322fe2854e
57c9553dca4a05322fe28041
...
```

#### Find the furthest precestor node id

start with suspected node id as targetId. In kedges run:

{ "mapId": ObjectId("57c92028ca4a05322fe26eb4"), $and: [ { "targetId": ObjectId("57cab827ca4a05322fe2854c") } ] }

get sourceId and iteratively replace it for the targetId in the previous query until you reach the node without parent, and remember that id as unconnected node

#### Find unconnected node

You can check the node with:

{ "_id": ObjectId("57cab827ca4a05322fe2854e"), $and: [ { "mapId": ObjectId("57c92028ca4a05322fe26eb4") } ] }

For each node that is not connected, create a new edge and add it to kedges collection:

{
    "name" : "", 
    "type" : "type_knowledge", 
    "mapId" : ObjectId("57c92028ca4a05322fe26eb4"), 
    "iAmId" : ObjectId("556760847125996dc1a4a241"), 
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("57cbdd31ca4a05322fe2af26"), 
    "targetId" : ObjectId("57cbd9aaca4a05322fe2af02"), 
    "dataContent" : null, 
    "updatedAt" : ISODate("2016-09-02T06:47:15.320+0000"), 
    "createdAt" : ISODate("2016-09-02T06:47:15.317+0000"), 
    "value" : NumberInt(0), 
    "isPublic" : true
}

### Joining collection

{
	"name": "Futuriser", 
	$and: [ { "mapId": ObjectId("57c92028ca4a05322fe26eb4") }],
	$lookup:
	{
		from: 'kedges',
		localField: '_id',
		foreignField: 'targetId',
		as: edge
	}
}


{"name": "Futuriser", $lookup: {from: 'kedges', localField: '_id', foreignField: 'targetId', as: 'edge'}, $and: [ { "mapId": ObjectId("57c92028ca4a05322fe26eb4") }]}


$lookup:
{
	from: 'kedges',
	localField: '_id',
	foreignField: 'targetId',
	as: edge
}


db.knodes.aggregate([{
$lookup:
{
	from: 'kedges',
	localField: '_id',
	foreignField: 'targetId',
	as: 'edge'
}
}])

db.knodes.aggregate([{
$match:{
	mapId: ObjectId("57c92028ca4a05322fe26eb4") 
},
$lookup:{
	from: 'kedges',
	localField: '_id',
	foreignField: 'targetId',
	as: 'edge'
}
}]);

.find({edge: null});

start mongo client

KnAllEdge-2016-09-04

edge" : [ ]


http://stackoverflow.com/questions/24300966/how-to-combine-aggregation-queries-mongodb
https://jira.mongodb.org/browse/SERVER-21612
https://docs.mongodb.com/manual/reference/operator/aggregation/group/
http://stackoverflow.com/questions/25436630/mongodb-how-to-find-and-then-aggregate
http://stackoverflow.com/questions/19405791/what-version-of-mongodb-is-installed-on-ubuntu
https://docs.mongodb.com/manual/mongo/
http://stackoverflow.com/questions/14789684/find-mongodb-records-where-array-field-is-not-empty-using-mongoose
https://docs.mongodb.com/manual/reference/operator/query/exists/
https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
http://stackoverflow.com/questions/20056903/mongodb-search-on-multiple-collections
https://docs.mongodb.com/manual/reference/method/db.collection.find/
https://www.google.com/search?q=mongo+query+across+collections&oq=mongo+query+across+collections&aqs=chrome..69i57.19836j0j7&sourceid=chrome&ie=UTF-8#q=mongodb+query+across+collections
