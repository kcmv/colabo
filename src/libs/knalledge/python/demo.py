import uuid
from colabo.knalledge import ColaboKnalledgeMongo
# http://api.mongodb.com/python/current/api/bson/objectid.html
from bson.objectid import ObjectId;

mid = "555555555555555555555555";
uid = "888888888888888888888888";

colaboKnalledge = ColaboKnalledgeMongo();

collection = colaboKnalledge.getCollection('knodes');

# make a UUID based on the host ID and current time
action_uuid = uuid.uuid1();
rid = 5;

kNode = {
    "mapId" : ObjectId(mid), 
    "name": "user played", 
    'type':'colaboflow.action',
    'iAmId':ObjectId(uid),
    "dataContent" : {
        "result" : {
            "uuid": action_uuid,
            'playRound':rid
        }
    }
}

# http://api.mongodb.com/python/current/api/pymongo/collection.html#pymongo.collection.Collection.insert_one
# https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
# http://api.mongodb.com/python/current/tutorial.html#inserting-a-document
result = collection.insert_one(kNode);
inserted_id = str(result.inserted_id);
print ("kNode created. inserted_id: %s" % (inserted_id) );
print(inserted_id);
