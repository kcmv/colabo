# Intro

`@colabo-flow/b-audit` is a ***b-colabo.space*** puzzle.

A backend part of the ColaboFlow Audit support for the Colabo.Space ecosystem.

-----

# API Requests

Get all audits:

+ http://127.0.0.1:6001/colabo-flow/audit/get-audits/all/any.json

Filter by action name:

+ [name === 'searchUser'](http://127.0.0.1:6001/colabo-flow/audit/get-audits/filter-by-name/searchUser.json)
+ [name === 'checkCache']http://127.0.0.1:6001/colabo-flow/audit/get-audits/filter-by-name/checkCache.json)

-----

This puzzle is automatically created with the [colabo tools](https://www.npmjs.com/package/@colabo/cli)