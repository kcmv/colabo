# Puzzles - Development

# Creating New Puzzle

### In the Puzzle

we're doing this intrustion on example of the **moderation** puzzle

- creating the **puzzle (main) folder** in the **src/frontend/dev_puzzles** folder, i.e: `src/frontend/dev_puzzles/moderation`

it can be in the **grouping folder** for several puzzles, like:

```
- rima
  - rima_aaa
  - rima_core
```

Let's say we're going to have more puzzles under the **moderation** umbrella.

then we create the main puzzle, that most of the apps will require when using this puzzle umbrella.
The convention is to name this puzzle **core** . so we create `src/frontend/dev_puzzles/moderation/core`

we should copy an existing puzzle in it

there we will have or create the **lib** folder (**core/lib**) - here goes the main business logic of the puzzle

while the most of 'administrative' code goes into the main folder `src/frontend/dev_puzzles/moderation/core` and we will now examine files residing there:

in the **package.json** we will

- rename the puzzle (e.g. to "name": "@colabo-moderation/core")
- do the things under the lower paragraph "**Using a puzzle in other puzzle**"

**lib**/**module.ts** and **lib/materialModule.ts** are  one of 'administrative' files that are not in the main folder but in the **lib** folder. 

In **lib**/**module.ts** we will

- add all the **components** the puzzle has to the **moduleDeclarations** array
- we will rename the class to the name of ours needed
  export class **ColaboFlowCore**Module { }
  and we will export it in **index.ts**

in **lib/materialModule.ts** we put all Angular Material classes we use in the puzzle

**index.ts**

- this is like an API between the puzzle an the code that uses it
- this is the entry point for TSC - so everything that 
- everything that needs to be used by puzzle users, needs to be here
- we will export: 
  export {ColaboFlowCoreModule} from './lib/module';

### In the Apps

in the **colabo.config.js** of the **main project (puzzle-provider)** , i.e. in the /Users/sasha/Documents/data/development/KnAllEdge/src/frontend/colabo.config.js
we should add it

```
var puzzles = {
....
    offers: {
    "@colabo-moderation/core": {
    npm: "@colabo-moderation/core",
    path: "dev_puzzles/moderation/core"
    }
}
```

in the **app** that we're using the puzzle in, in its **colabo.config.js** we should include the puzzle in its:

```var puzzles = {
var puzzles = {
 dependencies: {
  "@colabo-moderation/core": {}
 }
}
```

add the puzzle path in the src/frontend/apps/psc/**tsconfig.json**

```
"include": [
    "src/**/*",
    ....
    "node_modules/@colabo-moderation/**/*"
  ]
```

in the apps that we're including it in, e.g. src/frontend/apps/psc/src/app/**app.module.ts**, we import the puzzle's module

```
import { ModerationCoreModule } from '@colabo-moderation/core/lib/module';
...
var moduleImports = [
	...
	ModerationCoreModule
]
```

frontend$> yarn

apps/pcs$> yarn

## Using a puzzle in other puzzle

- **package.json** - add into **peerDependenciesLocal** all the puzzles this puzzle depends on

- ```
  "peerDependenciesLocal": {
          "@colabo-flow/f-core": "0.0.1"
  },
  ```

- in parent puzzle **module.ts**:

  - import  the module of the child puzzle

  - ```
    import { ColaboFlowCoreModule } from '@colabo-flow/f-core/lib/module';
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