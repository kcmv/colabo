# Puzzles - Development

# Creating New Puzzle

- creating the puzzle (main) folder in the **src/frontend/dev_puzzles** folder

- we should copy an existing puzzle

- in this folder we're probably going to have or we'll create folder **core** where the basis elements of puzzle, that all that use it, will need it

- there we will have or create the lib folder (**core/lib**)

- in the **package.json** we will

  - rename the puzzle (e.g. to "name": "@colabo-moderation/core")
  - do the things under the lower paragraph "**Using a puzzle in other puzzle**"
  - 

- in the lib/ **modulet.ts** we will

  - add all the **components** the puzzle has to the **moduleDeclarations** array
  - we will rename the class to the name of ours needed
    export class **ColaboFlowCore**Module { }
    and we will export it in **index.ts**

- **index.ts**

  - this is the entry point for TSC - so everything that 
  - everything that needs to be used by puzzle users, needs to be here
  - we will export: 
    export {ColaboFlowCoreModule} from './lib/module';

- 

- in the app that we're using the puzzle in, in its **colabo.config.js** we should include the puzzle in its:

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
  var puzzles = {
  ....
      offers: {
      "@colabo-moderation/core": {
      npm: "@colabo-moderation/core",
      path: "dev_puzzles/moderation/core"
      }
  }
  ```

- add the puzzle path in the src/frontend/apps/psc/**tsconfig.json**

- ```
  "include": [
      "src/**/*",
      ....
      "node_modules/@colabo-moderation/**/*"
    ]
  ```

- in the apps that we're including it in, e.g. src/frontend/apps/psc/src/app/app.module.ts, we import the puzzle's module

- ```
  import { ModerationCoreModule } from '@colabo-moderation/core/lib/module';
  ...
  var moduleImports = [
  	...
  	ModerationCoreModule
  ]
  ```

- frontend$> yarn

- apps/pcs$> yarn

## Using a puzzle in other puzzle

- **package.json** - add into **peerDependenciesLocal** all the puzzles this puzzle depends on

- ```
  "peerDependenciesLocal": {
          "@colabo-colaboflow/core": "0.0.1"
  },
  ```

- in parent puzzle **module.ts**:

  - import  the module of the child puzzle

  - ```
    import { ColaboFlowCoreModule } from '@colabo-colaboflow/core/lib/module';
    ...
    var moduleImports: any[] = [
      ...
      ColaboFlowCoreModule
    ];
    ```


# Puzzles Development

## General

- if we **change code in a puzzle**, we don't have to do anything further. Just regular running of  `ng serve --open` is enough to compile all the changes and progress them
  - this also goes for the case when we change a puzzle that is used in a puzzle that is used in an app 

## Backend Puzzle

- each time we change the backend code or a puzzle, we should do a **build** or **yarn**
- 