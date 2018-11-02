# Installing from the colabo repository

If you are building from the [Colabo-repo](https://github.com/Cha-OS/colabo/)

```sh
# install tsc (TypeScript compiler)
sudo npm install -g typescript
cd tools
# install (and build (from TypeScript)) the Colabo Tools
yarn
# export the `colabo` tool globally
sudo npm run link
```

# Build

You need to compile them first (they are written in TypeScript): `tsc`. There is a `tsconfig.json` file describing building procedure, so you are good with just running `tsc` command.

NOTE: Building should be done automatically during the installation process


# Run

After building you can run the tools:

```sh
# Show info of the Colabo.space aspect of the backend part of the project
colabo ../backend/colabo.config.js puzzless-info
# equivalent (in the case you do not have not installed package)
node index.js ../backend/colabo.config.js puzzless-info
# equivalent (in the case you have only locally installed package)
# npx is available for npm > 5.2.0
npx colabo ../backend/colabo.config.js puzzless-info

# Offer backend Colabo.space puzzles to the local system
colabo ../backend/colabo.config.js puzzless-offer

# Install inside the project puzzles required for the backend Colabo.space
colabo ../backend/colabo.config.js puzzless-install

# debug the colabo tools
node --inspect=127.0.0.1:5858 index.js ../backend/colabo.config.js puzzless-offer
```

# Removing

Full cleaning from the local machine (if you have installed it from the local colabo repo):

```sh
which colabo

ls -al /usr/local/bin/colabo
ls -al /usr/local/lib/node_modules/colabo-tools
ls -al /Users/sasha/Documents/data/development/colabo.space/colabo/src/tools/dist

rm -r /Users/sasha/Documents/data/development/colabo.space/colabo/src/tools/dist/
Sasas-Air-2:bin sasha$ rm -r /usr/local/lib/node_modules/colabo-tools
Sasas-Air-2:bin sasha$ rm -r /usr/local/bin/colabo
```

Full cleaning from the local machine (if you have installed it from the public `@colabo/cli` package):

```sh
# it is installed with `npm install -g @colabo/cli`
# into: /usr/local/bin/colabo -> /usr/local/lib/node_modules/@colabo/cli/dist/index.js
```

# TODO

## Warnings

Catch all warnings during the tool running process. For example, if some puzzle offering provide WARN, it should be collected and delivered to the final report. So Promises in the `offerPuzzle()` should return semantic result.

Chech more under: `Parallel control flow` in https://basarat.gitbooks.io/typescript/docs/promise.html