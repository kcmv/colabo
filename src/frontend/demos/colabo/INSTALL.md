# Intro

This is a MEAN stack app so you should have node + npm installed and then do a standard npm install based on the `package.json`

`npm install`

or even better

`yarn install`

You can set the yarn as an angular-cli default:

`ng set --global packageManager=yarn`

# linked npm packages

Some of the packages are not available (or not the latests) at the npm repository, so you should link them locally from the corresponding local repositories.

## Colabo packages

This packages come from the Colabo Ecosystem and from its [Colabo github repository](https://github.com/cha-os/knalledge).

You need to:

1. install it locally
2. export each of used packages as global npm packages (with `npm local` command)
3. import them in this project with:

```sh
npm link @colabo-puzzles/f-core
npm link @colabo-knalledge/f-core
npm link @colabo-knalledge/f-store_core
npm link @colabo-knalledge/f-view_node
```

# Updating

https://stackoverflow.com/questions/43931986/how-to-upgrade-angular-cli-to-the-latest-version

## angular

`yarn add @angular/animations@5.0.1 @angular/common@5.0.1 @angular/compiler@5.0.1 @angular/core@5.0.1 @angular/forms@5.0.1 @angular/http@5.0.1 @angular/platform-browser@5.0.1 @angular/platform-browser-dynamic@5.0.1 @angular/router@5.0.1`

` @angular/material@5.0.1
@angular/cdk@
@angular/flex@`
