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
npm link @colabo-puzzles/puzzles_core
npm link @colabo-knalledge/knalledge_core
npm link @colabo-knalledge/knalledge_store_core
npm link @colabo-knalledge/knalledge_search
npm link @colabo-knalledge/knalledge_view_node
```

# Build

```sh
ng build --prod --build-optimizer
```

# Problems

## Module build failed: Error: Missing binding Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js 8.x

For: `npm run dev` from host machine

Detailed error:

```txt
 error  in ./resources/assets/sass/app.scss

Module build failed: Error: Missing binding /Users/sasha/Documents/data/development/jobs/SEO/PayOnDelivery/pod/node_modules/node-sass/vendor/darwin-x64-57/binding.node
Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js 8.x

Found bindings for the following environments:
  - Linux 64-bit with Node.js 8.x
```

https://github.com/sass/node-sass/issues/2148
+ npm rebuild node-sass every time you switch. Or collect multiple binaries in the vendor directory.

https://github.com/sass/node-sass/issues/1527
+ If is still not working, you can add manually the file : https://github.com/sass/node-sass/releases/tag/v4.2.0. This is what I did finally.
    + https://github.com/sass/node-sass/releases/tag/v4.7.2

darwin-x64-57_binding.node -> 
    pod/node_modules/node-sass/vendor/darwin-x64-57/binding.node

# Updating

https://stackoverflow.com/questions/43931986/how-to-upgrade-angular-cli-to-the-latest-version

## angular

`yarn add @angular/animations@5.0.1 @angular/common@5.0.1 @angular/compiler@5.0.1 @angular/core@5.0.1 @angular/forms@5.0.1 @angular/http@5.0.1 @angular/platform-browser@5.0.1 @angular/platform-browser-dynamic@5.0.1 @angular/router@5.0.1`

`@angular/material@5.0.1
@angular/cdk@
@angular/flex@`
