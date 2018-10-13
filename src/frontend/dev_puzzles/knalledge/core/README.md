# Intro

knalledge_core is a Colabo puzzle that provides a core support for the KnAllEdge component of the Colabo ecosystem.

It is contains core entities of KnAllEdge, description of a node, edge, map, etc

# TODO

## Removing bower dependencies

currently `debug` and `debugpp` components which are bower components are moved out of the bower knalledge (CF) (src/frontend/bower_components) folder and moved to this puzzle into lib folder. later we want to use npm versions of installation for both components and make sure they integrate properly, but for the moment this should be fine

It seems that debug is not from bower
