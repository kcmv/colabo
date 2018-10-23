# Running the NCA calcullation

```sh
# login from local terminal
ssh -i ~/.ssh/sasha-iaas-no.pem mprinc@158.39.75.130
ssh -i ~/.ssh/sinisha-iaas-no.pem sir@158.39.75.130
# get in the folder
cd /var/colabo/
# activate python environment with necessary packages, etc
source /var/colabo/colabo-env/bin/activate

# python sv_client.py <map_id> <cluster_size>
python sv_client.py "5bce4f50b6b1fc5d048c706d" 4
```

# Presenting the NCA clusters

```sh
# login with SFTP client (CyberDuck, Filezilla, ...)
# from `/var/colabo/` copy on the local machine
# you need to this only once - the HTML is the same
sdg_groups.html
# every time you rerun the calcullation
sdg.json
# then just open the `sdg_groups.html` in browser
```



# KnAllEdge content

## Map

Add map in kmaps (`right button > insert document`):

```json
{
    "_id" : ObjectId("5bce4f50b6b1fc5d048c706d"),
    "name" : "NCA Entrepreneurial",
    "rootNodeId" : ObjectId("5bce4f7eb6b1fc5d048c706e"),
    "type" : "CoLaboArthon",
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "parentMapId" : "",
    "dataContent" : null,
    "updatedAt" : ISODate("2018-09-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-09-10T01:07:10.400+0000"),
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
    "_id" : ObjectId("5bce4f7eb6b1fc5d048c706e"),
    "name" : "NCA Entrepreneurial",
    "type" : "model_component",
    "mapId" : ObjectId("5bce4f50b6b1fc5d048c706d"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-09-10T01:07:10.401+0000"),
    "createdAt" : ISODate("2018-09-10T01:07:10.400+0000"),
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
        "property" : "Welcome to 'Performing Sustainable CoEvolution @ PTW2018'"
    }
}
```

## USERS

Add USERS node in knodes (`right button > insert document`):

```json
{
    "_id" : ObjectId("5bce50c8b6b1fc5d048c706f"),
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5bce4f50b6b1fc5d048c706d"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "updatedAt" : ISODate("2018-09-10T01:18:20.440+0000"),
    "createdAt" : ISODate("2018-09-10T01:18:20.439+0000"),
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

edge:

```json
{
    "name" : "Users",
    "type" : "rima.users",
    "mapId" : ObjectId("5bce4f50b6b1fc5d048c706d"),
    "iAmId" : ObjectId("556760847125996dc1a4a24f"),
    "ideaId" : NumberInt(0),
    "sourceId" : ObjectId("5bce4f7eb6b1fc5d048c706e"),
    "targetId" : ObjectId("5bce50c8b6b1fc5d048c706f"),
    "dataContent" : null,
    "visual" : null,
    "updatedAt" : ISODate("2018-09-10T01:18:20.619+0000"),
    "createdAt" : ISODate("2018-09-10T01:18:20.618+0000"),
    "value" : NumberInt(0),
    "isPublic" : true,
    "__v" : NumberInt(0)
}
```

##
