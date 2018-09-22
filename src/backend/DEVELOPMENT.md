# Backend-Development

# General

- after any **change of the code**

  - we start `src/backend$ **yarn**`

  - then we restart the app. E.g. execute again
    `apps/colabo-space$ npm start`

# Changing API



- if we want to extend an API, e.g. adding the 4th req. parameter in **kNode Service**, we start by changing the entry point for that backend dev_puzzle:
  **src/backend/dev_puzzles/knalledge/knalledge-core/index.ts**
  where we change:
  `var knodes = app.resource('knodes', require('./lib/modules/kNode'), { id: 'type?/:actionType?/:searchParam?/:searchParam2?/:searchParam3?' });`
  to
  `var knodes = app.resource('knodes', require('./lib/modules/kNode'), { id: 'type?/:actionType?/:searchParam?/:searchParam2?/:searchParam3?/:searchParam4?' });`
- than in
  **src/backend/dev_puzzles/knalledge/knalledge-core/lib/modules/kNode.js**
  we extend exports.index = function(req, res) {
  by adding var id4 = req.params.searchParam4; and extending the call of
  exports._index = function(id, id2, id3, id4, type, res, callback) {
  which subscription we also extend 
- 