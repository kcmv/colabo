# Linked components/modules

Most of the components that we develop as a part of the Colabo ecosystem are in separate folders and are exported into npm packages eventually.

However to increase development speed and to avoid fix-publish-update loop we are using npm support to link them explicitly.

+ https://docs.npmjs.com/cli/link
+ https://github.com/npm/npm/issues/7742

## "Exporting the package"

```sh
cd <folder with the (local) package>
npm link # makes it available (globally) / creates a symlink in the global folder
# it will put it in the `{prefix}/lib/node_modules/<package>`
# where the `prefix` is usually : `/usr/local` (`npm config ls prefix`)
# and path is `/usr/local/lib/node_modules/`
# Note that *package-name* is taken from package.json, not from directory name.
```

## "Importing the package"

```sh
cd <folder where we want the (local) package>
npm link <package-name> #  create a symbolic link from globally-installed package-name to node_modules/ of the current folder
cd
```

So we would do something like this:

```sh
npm link @colabo-knalledge/knalledge_view_enginee
```

## @colabo-knalledge/knalledge_core

- Location: dev_puzzles/knalledge/knalledge_core

## @colabo-knalledge/knalledge_view_enginee

- Location: dev_puzzles/knalledge/knalledge_view_enginee
