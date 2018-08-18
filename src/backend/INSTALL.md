# INSTALL

## Colabo packages

This packages come from the Colabo Ecosystem and from its [Colabo github repository](https://github.com/cha-os/knalledge).

You need to:

1. install it locally
2. export each of used packages as global npm packages (with `npm local` command)
3. import them in this project with:

```sh
npm link @colabo-knalledge/b-knalledge-storage-mongo
npm link @colabo-knalledge/b-knalledge-core
npm link @colabo-knalledge/b-knalledge-search
npm link @colabo-media/media-upload
npm link @colabo-rima/rima-connect
```

# TypeScript

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

# Changes

`node-inspector` is removed since it is making problems

```json
"devDependencies": {
  "node-inspector": "~1.1.1"
}
```

