# Intro

***NOTE***: Before installing this app you need to install Colabo.Space ***tools***, ***backend*** and ***fronted***. Please read how to install them in the [INSTALL.md](../../../INSTALL.md) document.

```sh
cd src/frontend/demos/knalledge/knalledge-view-node
yarn
```

## Install Frontend Colabo Puzzles (Packages)

***NOTE***: This is done automatically during the install process (please check the script `prepare` inside the `package.json`) and it is not necessary to be done manually.

# Run

```sh
cd src/frontend/demos/knalledge/knalledge-view-node
# run predefined npm script
npm start
# run with local ng
./node_modules/\@angular/cli/bin/ng serve -o -p 8889
# run with local ng using npx
npx ng serve -o --port 8889
# or with global ng
ng serve -o -p 8889
# or with default port (`angular.json` (architect.serve.options.port)) and without openning browser (no `-o`)
ng serve
```

# Deploy

TBD

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
