#print pymongo.database.Database.collection_names(db)
from pymongo import MongoClient, database
# from bson import ObjectId

class ColaboKnalledgeMongo():

    def __init__(self):
        self.dbName = 'KnAllEdge';
        self.connection = MongoClient('mongodb://127.0.0.1:27017');
        self.db = self.connection[self.dbName];
        print ("Database '%s' has collections: %s" % (self.dbName, database.Database.collection_names(self.db)));

    def getCollection(self, collectionName):
        collection = self.db[collectionName];
        return collection;