# Structure description

We will use puzzle `@colabo-flow/b-audit` as an example.

Puzzles are encapsulated in folders. Each folder contains fundamental files and folders necessary for puzzle to build and be properly used.

The puzzle `@colabo-flow/b-audit` is stored in the `audit` folder, which is contained in parent `flow` folder which presents puzzle `namespace` folder, corresponding to the `@colabo-flow` name.

+ `package.json` - describes puzzle as a npm module
+ `tsconfig.json` - explains TypeScript building process of the puzzle
+ `index.ts` - contains public API of the puzzle
+ `lib` - contains the most of the business logic of the puzzle
+ `dist` - contains compiled (and built) version of the puzzle

# package.json

## module parameter

+ [What is the “module” package.json field for?](https://stackoverflow.com/questions/42708484/what-is-the-module-package-json-field-for)
+ [5.1. Determining if source is an ES Module](https://github.com/nodejs/node-eps/blob/4217dca299d89c8c18ac44c878b5fe9581974ef3/002-es6-modules.md#51-determining-if-source-is-an-es-module)
+ [ES Module Interoperability](https://github.com/nodejs/node-eps/blob/master/002-es-modules.md)
