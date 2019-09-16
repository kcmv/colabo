# Puzzles

## Backend

+ At the backend there is a puzzle providing access to existing tasks (GOs), and providing stats about GOs (maybe not implmented?!)
+ It has to be refactored and properly redesigned

## Isomorphic

+ It seems (? :( ) that it is just a copy of audit puzzle, not implemented yet

## Services

Node
+ it should (?) support server part of gRPC supporting execution of cFlow puzzles
+ it is unclear and knot know how and where it is executing :(

Python
[colabo.flow.go](colabo/src/services/puzzles/flow/go/python)
+ https://test.pypi.org/project/colabo.flow.go/
+ it enables python code to execute cFlow puzzless across gRPC
+ It also provides demo examples of various complexity of puzzles, and cordinations across them
    + colabo/src/services/puzzles/flow/go/python/colabo/flow/go/colaboflow_go_demo.py
    + colabo/src/services/puzzles/flow/go/python/demo-flows
    + colabo/src/services/puzzles/flow/go/python/demo-puzzles

It also supports loading flows (JSON) and necessary python puzzles as modules internally into flow executing code and sharing datasets. It is more experimental reimplementation of initial bukvik model heading toward cFlow. It is just demo.