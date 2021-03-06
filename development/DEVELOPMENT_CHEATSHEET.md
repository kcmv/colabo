# colabo tools for puzzles

To publish puzzle: `@colabo-topichat/b-talk` you need to create organization first at https://npmjs.com

NOTE: `@colabo-topiChat/b-talk` is wrong; no capital letters

Each package you want to publish has to have in `package.json`:

```json
    "private": false,
    "publishConfig": {
        "access": "public"
    },
```
[Publishing an Org Scoped Package](https://www.npmjs.com/docs/orgs/publishing-an-org-scoped-package.html)

You publish by running `npm publish` inside the puzzle folder.

https://docs.npmjs.com/cli/unpublish

You unpublish by running `npm unpublish @colabo-rima/rima_aaa@0.1.0`. You have 72 hours to do that! Later you have to write an email.


You can list all organizations at:

https://www.npmjs.com/settings/mprinc/profile

But if you have too many organizations, then not all of them are visible, so you need to access them directly: https://www.npmjs.com/org/colabo-topichat

This are current Colabo sub-organizations:

https://www.npmjs.com/org/colabo
https://www.npmjs.com/org/colabo-knalledge
https://www.npmjs.com/org/colabo-flow
https://www.npmjs.com/org/colabo-media
https://www.npmjs.com/org/colabo-puzzles
https://www.npmjs.com/org/colabo-rima
https://www.npmjs.com/org/colabo-topichat
https://www.npmjs.com/org/colabo-utils

or

https://www.npmjs.com/settings/colabo-topichat/packages

# Linked components/modules

Components are linked globally into: `/usr/local/lib/node_modules/@colabo*`

Most of the components that we develop as a part of the Colabo ecosystem are in separate folders and are exported into npm packages eventually.

However to increase development speed and to avoid fix-publish-update loop we are using npm support to link them explicitly.

+ https://docs.npmjs.com/cli/link
+ https://github.com/npm/npm/issues/7742

There will be a script `src/frontend/scripts/development-prepare-npm-links.js` that should help with the process of exporting and importing npm packages.

**NOTE for developers**: After creating any new external puzzle
* you HAVE to add it in the `npm_packaged_puzzles` hash array in the [src/frontend/packaged_puzzles.js](src/frontend/packaged_puzzles.js) file. This file is used both for the refference, but also for the automated tasks of npm linking, etc.

## "Exporting the package"

```sh
cd <folder with the (local) package>
npm link # makes it available (globally) / creates a symlink in the global folder
# it will put it in the `{prefix}/lib/node_modules/<package>`
# where the `prefix` is usually : `/usr/local` (`npm config ls prefix`)
# and path is `/usr/local/lib/node_modules/`
# Note that *package-name* is taken from package.json, not from directory name.
```

### Preparing library for proper importing in another hosting app

If you want to let developers build the lib through the hosting app this method will make it possible to build the library with the methods and configuration of the hosting app

More details at [stories linked library](https://github.com/angular/angular-cli/wiki/stories-linked-library)

1. in the lib's `package.json` in the `peerDependencies` (this is used when in the host app we are using the pre-built library) and `devDependencies` (yes twice :), this is for building library separately, not through the hosting app) add all mutual (lib vs. host) dependencies or in other words all libraries the lib is using but you are not interested in compiling them into since they will and should be provided with the hosting app (like all @angular, angular material, etc).

in this way you should be fine building lib in many scenarios
  - build it separatelly
  - build it through (and with) hosting app
  - load it (as prebuilt) to hosting app

## "Importing the package"

```sh
cd <folder where we want the (local) package>
npm link <package-name> #  create a symbolic link from globally-installed package-name to node_modules/ of the current folder
cd
```

**NOTE**: `package-name` is a name of the npm package, as declared under the `name` parameter in the packages's `package.json` file

So we would do something like this:

```sh
npm link @colabo-knalledge/knalledge_view_enginee
```

### Preparing the (other) hosting app for proper importing of our labs

If you want to let developers build the lib through the hosting app this method will make it possible to build the library with the methods and configuration of the hosting app

More details at [stories linked library](https://github.com/angular/angular-cli/wiki/stories-linked-library)

2. in the host's `tsconfig.json` (some are suggesting `tsconfig.app.json`, but it should work for tests as well ?)
  1. direct (with parameter `paths` (that is relative to `baseUrl` parameter)) the TS compiler to point all mutual (lib vs. host) dependencies or in other words all libraries the lib is using, but are not compiled into the lib (they are listed in the lib's `peerDependencies` section in the `package.json`), since they will and should be provided with our/the hosting app (like all @angular, angular material, etc) to point and be used your local (host) dependencies
  2. include libs that are linked (this still need to be investigated) into compilation path with `include` parameter

```json
{
  ...
  "compilerOptions": {
    ...
    "baseUrl": "./",
    "note1": "these paths are relative to `baseUrl` path.",
    "paths": {
      "@angular/*": [
        "node_modules/@angular/*"
      ]
    }
    ...
  },
  ,
  "include": [
      "src/**/*",
      "node_modules/@colabo-knalledge/**/*"
  ]
  ...
}
```
3. configure angular-cli build to follow symlinks: in the `.angular-cli.json` add:

```json
{
  ...
  "defaults": {
    "build": {
      "preserveSymlinks": true
    }
  }
  ...
}
```
in this way you should be fine building lib in many scenarios
  - build it separatelly
  - build it throuh (and with) hosting app
  - load it (as prebuilt) to hosting app
  
## "Un-Importing the package"
```sh
cd node_modules

rm \node<folder where we linked the (local) package>
#example:
rm \@colabo-knalledge/knalledge_view_enginee
```

# List of npm-packaged puzzles

You can find them in the [src/frontend/packaged_puzzles.js](src/frontend/packaged_puzzles.js) file
