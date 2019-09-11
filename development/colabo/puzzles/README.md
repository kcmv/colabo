NOTE: Should go to: http://colabo.space/components

# Info

![Colabo Puzzle enabled system](https://colabo.space/data/images/puzzles/colabo-puzzles-system-overview.jpg)

# Migrating code into puzzle

Migration of an existing code is rather traightforward when using TypeScript or node.js. First you have to identify a puzzle boundaries, then you need to create a new puzzle:

```sh
cd <puzzle_parent_folder>
colabo puzzle-create
# provide all necessary parameters
```

When a new puzzle is created, you need to move the old code into the puzzle. Finally you should change all puzzle references from the previous relative imports into global imports through the `npm package name` associated with the puzzle.

<!--
# Tips and Tricks of Healthy Puzzles

+ always use puzzle 

-->

# Publishing Puzzles

## Backend

+ Go to the puzzle folder
+ run `npm publish`
+ this is demanding process regarding the `package.json` so you have everything right
+ it will end up published on npmjs.com
+ This is an example: https://www.npmjs.com/org/colabo-utils

Here is an example which of the puzzle [@colabo-flow/b-services](https://www.npmjs.com/package/@colabo-flow/b-services) belongs to the [colabo-flow](https://www.npmjs.com/org/colabo-flow) colabo sub-organization (sub-space)


```json
{
    "name": "@colabo-flow/b-services",
    "description": "This is a ColaboFlow service puzzle of the backend part of the Colabo.Space ecosystem",
    "version": "0.0.5",
    "private": false,
    "publishConfig": {
        "access": "public"
    },
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "git://github.com/Cha-OS/colabo.git"
    },
    "scripts": {
        "build": "tsc"
    },
    "main": "dist/index.js",
    "module": "dist/index.js",
    "dependencies": {
        "amqplib": "^0.5.2",
        "chalk": "^2.4.1",
        "uuid": "^3.3.2"
    },
    "peerDependencies": {},
    "devDependencies": {}
}
```

**name** - puzzle name. @colabo-flow/b-services"

**description** - puzzle description

**version** - any meaningfull version that follow [semantic versioning](https://semver.org/)

**private** - should be `false` to be able to publish 

**publishConfig** - should be set as in example

**license** - you need to provide a license to be able to publish

**repository** - you need to provide a valid repository that will be linked to the published puzzle

**main** - it is the main entry point for the puzzle. It is the import and require point

**module** - it is used by bundler tools for ESM, and it can be treated same as ***main***

**dependencies** - are all internal dependencies of the puzzle. It should contain both regular ***npm packages*** and other ***colabo puzzles*** that your puzzle depends on

# Colabo.Puzzles

+ [speciffic puzzles (components)](https://github.com/Cha-OS/colabo/tree/master/development/speciffic%20components)

## ColaboFlow

+ [ColaboFlow.Go! presentation](https://docs.google.com/presentation/d/1_cvK_HFgdY6YIAAOyUJ33kn9RRkOCMkeYSghi2jSjJ8/edit?usp=sharing)
  + presented in the context of the [Audio Commons](https://www.audiocommons.org/) project
+ [ColaboFlow.Audit! presentation](https://docs.google.com/presentation/d/1aZUxoy04VcvulQIyp0ONsPmGUlN63UVQ1-9IMkYms8g/edit#slide=id.g4baa8d952e_0_10)
  + presented in the context of the [Audio Commons](https://www.audiocommons.org/) project
+ [ColaboFlow introduction](https://colabo.space/en/flow/)
+ [ColaboFlow infrastructure install](https://github.com/Cha-OS/colabo/tree/master/development/colabo/flow)

