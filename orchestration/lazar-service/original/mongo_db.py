# -*- coding: utf-8 -*-
import pymongo
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['KnAllEdge']
print pymongo.database.Database.collection_names(db)

collection = db['knodes']
#db.create_collection('Reduced_Cluster')
summarycollection = db['Reduced_Cluster']
summarycollection.remove()

docs = collection.find({"knodes":{"$dataContent":{"name":"Sinisa"}}}, timeout=False)

for doc in docs:
    print(doc['dataContent']['type'].encode('utf-8', errors='replace'))
    
