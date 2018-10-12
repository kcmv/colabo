# Intro

This is a Search API implementation of the backend part of the KnAllEdge storage of the Colabo.Space ecosystem

It searches

```sh

# get all PARENTS of a node in the map
curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/search-nodes/parents/in-map/58068a04a37162160341d402/59d3fb284b077e6c540f758e

# get all CHILDREN nodes in the map
curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/search-nodes/children/in-map/58068a04a37162160341d402/59d3bdcf0d1f92de005c85a9

# get all nodes in the map with matching CONTENT
# TODO
curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/search-nodes/content/in-map/58068a04a37162160341d402/filters=name+content&tekst=Акорди

```

# Export

```sh
# It will create globaly accessable npm package `@colabo-knalledge/knalledge-search`
npm link
```

# Import

```sh
# Imports it in the local node_modules space of the hosting app
npm link @colabo-knalledge/knalledge-search
```