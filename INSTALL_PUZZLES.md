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
