# Puzzles

## Frontend

[flow-audit](colabo/src/frontend/dev_puzzles/flow/audit/README.md)

+ support selecting flows and showing audit stats about them

## Backend

[flow-audit](colabo/src/frontend/dev_puzzles/flow/audit/README.md)

+ support retrieving, searching for and creating audits
+ it supports both direct backend access or through JSON API

## Isomorphic

[@colabo-flow/i-audit](colabo/src/isomorphic/dev_puzzles/flow/audit/README.md)

+ it provides VOs and interfaces

## Services

[colabo.flow.audit](colabo/src/services/puzzles/flow/audit/python)
+ https://pypi.org/project/colabo.flow.audit/
+ It supports creating and submitting audits from python code.
+ It uses gRPC mechanism to communicate with the gRPC provider

[@colabo-flow/s-audit](colabo/src/services/puzzles/flow/audit/node)
+ It should (since gRPC for audit is/was working for QMUL) support accepting audits (over gRPC) and store them in DB storage (MongoDB)
+ TBD