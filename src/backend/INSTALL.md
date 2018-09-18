# 	INSTALL

***NOTE***: Before installing backend you need to install Colabo.Space tools. Please read how to install them in the [tools/README.md](../tools/README.md) document.


## Install Colabo Backend Core

```sh
cd colabo
cd src/backend
# NOTE: some of the packages will be installed as tarbales from the colabo.space website
# - http://colabo.space/downloads/express-resource-1.0.0.tgz
#   - it is the `express-resource` package on steroids
# - http://colabo.space/downloads/deep-assign-2.0.0.tgz
yarn

# we can also run:
npm run clean_full
# time cistis SVE bildovanje u njemu i puzlama njegovim itd
# to je za provjeru
#pa onda kada uradis:
yarn
# onda mozes vidjeti da li je sve stabilno
```

***That is all***. Backend of the Colabo.Space ecosystem should be installed now. 

The following section ist describing the process under hood.

## Install Backend Colabo Puzzles (Packages)

***NOTE***: This is done automatically during the install process (please check the script `prepare` inside the `package.json` for any project) and it is not necessary to be done manually.

These puzzles come from the Colabo Ecosystem and from its [Colabo github repository](https://github.com/Cha-OS/colabo).

We developed colabo tools for automating the task of managing colabo puzzles. They are integrated in the backend/frontend build/install process and they are not necessary to run separatelly.

After installing them (check [tools/README.md](../tools/README.md)), you can just run inside the backend folder. 

```sh
# show colabo config file and all puzzles
colabo puzzles-info
# export offered puzzles
colabo puzzles-offer
# install required puzzles
colabo puzzles-install
```

### Explanation

This is just an explanation and not necessary to be done manually, because it is done through the colabo commands.

1. each offered puzzle is exported globally as a npm package (by getting inside the puzzle folder and running `npm link` command)
2. each required puzzles is imported with something like:

```sh
cd src/backend
npm link @colabo-knalledge/b-knalledge-storage-mongo
```

# Development

## TypeScript

There is `tsconfig.json` file describing what we are interested in compiling and how.

+ https://www.typescriptlang.org/docs/handbook/compiler-options.html
+ https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

When you are developing you should update it if you are introducing new files/folders. You run compiler with

```sh
tsc
```

or you can compile only one specific entry point:

```sh
tsc KnAllEdgeBackend.ts
```

but keep in mind that in our case it didn't follow symbolic paths in the `node_modules`, so we needed to compile it additionally:

```sh
tsc dev_puzzles/knalledge/knalledge-search/index.ts
```
Here is a reference on a [opposite :) case](https://github.com/Microsoft/TypeScript/issues/9552)

# Test

```sh
http://localhost:8001/kmaps/all.json
http://localhost:8001/knodes/one/default/59d3d92d73a8d7b33b00970b
http://localhost:8001/knodes/one/default/59d3b3f90d1f92de005c858e
```

# Running

Start the server

```
npm start
```

### Problems

- [`npm install v8-profiler` fails with node v7.0.0 on osx #98](https://github.com/node-inspector/v8-profiler/issues/98)
- [Pre-built binaries not found for v8-debug@0.7.7 and node@7.1.0](https://github.com/node-inspector/node-inspector/issues/950)
- [fetch fails with 404 when trying to retrieve https://registry.npmjs.org/i/-/i-0.3.2.tgz against node4-lts](https://github.com/npm/npm/issues/14025)

# Changes

`node-inspector` is removed since it is making problems

```json
"devDependencies": {
  "node-inspector": "~1.1.1"
}
```

# Full Cleaning previous built and installation

```sh
rm -r node_modules/
rm -r dev_puzzles/*/*/node_modules
rm -r dev_puzzles/*/*/dist
rm -r dist/
```

or `npm run clean_full`