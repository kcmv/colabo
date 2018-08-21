# Colabo Tools

There are ***colabo tools*** for offering and injecting puzzles. They are in the `tools` folder. Read more in the [README.md](tools/README.md)

# Linked npm packages

Some of the packages are not available (or not the latests) at the npm repository, so you should link them locally from the corresponding local repositories.

## Colabo packages

This packages come from inside the Colabo Ecosystem and inside this same repository [Colabo github repository](https://github.com/cha-os/knalledge).

You need to:

1. export each of used packages as global npm packages (with `npm local` command)
2. import them in this project with:

```sh
npm link @colabo-puzzles/puzzles_core
npm link @colabo-knalledge/knalledge_core
# npm link @colabo-knalledge/knalledge_store_core
npm link @colabo-knalledge/knalledge_view_enginee
npm link @colabo-knalledge/knalledge_view_interaction
```

+ in newer versions of ts compiler we need explicitly to include all external TS files, otherwise we would get error: **Error**: XXX is not part of the compilation output. Please check the other error messages for details.
+ solution:
  - add all TS code (`@angular`, ``@colabo-*`... libs) into path
  - in `tsconfig.json`

```json
{
  //...
  "include": [
    "src/**/*",
    "node_modules/@colabo-puzzles/**/*",
    "node_modules/@colabo-knalledge/**/*",
    "node_modules/@fdb-stats/**/*",
    "node_modules/@fdb-graph/**/*"
  ]
}
```


Currently for the each npm scope (`@colabo-puzzles`, `@colabo-knalledge`, ...) we should make a route at the browser file `src/frontend/tools/utils/code_change_tools.ts`:

```js
let routes:any = {
  // ...
  // npm-scopes for different colabo puzzles
  // TODO: hopefully we can avoid it
  // (with the ng cli and webpack it is not necessary)
  '/node_modules/@colabo-knalledge': join(APP_DEST, 'dev_puzzles/knalledge'),
  '/node_modules/@colabo-puzzles': join(APP_DEST, 'dev_puzzles/puzzles'),
```

# INFO

## NPM packages

+ [package.json - Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json)
+ [Understanding Packages and Modules](https://docs.npmjs.com/getting-started/packages)
+ Packing package into a tarball
  + [npm-pack](https://docs.npmjs.com/cli/pack)
  + go inside the package and run `npm pack`
  + to unpack and check you can do: `tar zxvf express-resource-1.0.0.tgz`
Reffering to tarball packages (`package.json`):

```json
{
  // ...
    "dependencies": {
        // ...
        "deep-assign": "http://colabo.space/downloads/deep-assign-2.0.0.tgz",
        "express": "3.x",
        "express-resource": "http://colabo.space/downloads/express-resource-1.0.0.tgz",
        // ...
    },
}
```
