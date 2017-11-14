# Intro

This is MEAN stack app so you should have node + npm installed and then do a standard npm install based on the `package.json`

`npm install`

or even better

`yarn install`

You can set yarn as angular-cli default:

`ng set --global packageManager=yarn`

# linked npm packages

Some of the packages are not available (or not the latests) at the npm repository, so you should link them localy from the corresponding local repositories.

## Colabo packages

This packages come from the Colabo Ecosystem and from its [Colabo github repository](https://github.com/cha-os/knalledge).

You need to:

1. install it locally
2. export each of used packages as global npm packages (with `npm local` command)
3. import them in this project with:

```sh
npm link @colabo-puzzles/puzzles_core
npm link @colabo-knalledge/knalledge_core
npm link @colabo-knalledge/knalledge_store_core
```
