# Puzzles - Development

# Creating New Puzzle

- creating the puzzle (main) folder in the **src/frontend/dev_puzzles** folder

- in the puzzle folder we create folder **core** where the basis elements of puzzle, that all that use it, will need it

- **index.ts**

  - this is the entry point for TSC - so everything that 
  - everything that needs to be used by puzzle users, needs to be here

- ....

- rename the class in the module.ts and export it in **index.ts**

- u app u koju integrisemo, in its colabo.config.js we should include the puzzle in its:

  ```var puzzles = {
  var puzzles = {
   dependencies: {
    "@colabo-moderation/core": {}
   }
  }
  ```

- in the colabo.config.js of the main app, i.e. in the /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/colabo.config.js
  we should add it

- ```
  offers: {
  "@colabo-moderation/core": {
  npm: "@colabo-moderation/core",
  path: "dev_puzzles/moderation/core"
  }
  ```

- add the puzzle path in the src/frontend/apps/psc/tsconfig.json

- ```
  "include": [
      "src/**/*",
      ....
      "node_modules/@colabo-moderation/**/*"
    ]
  ```

- 

- [ September 18, 2018 14:50 ] Sasa Rudan: фронтенд:
  yarn
  [ September 18, 2018 14:50 ] Sasa Rudan: apps/pcs:
  yarn