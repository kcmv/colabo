# Colabo Tools

These are the tools to manage the Colabo.Space ecosystem

# Install

```sh
# install (and build (from TypeScript)) the Colabo Tools
yarn
# export the `colabo` tool globally
npm run link
```

# Build

You need to compile them first (they are written in TypeScript): `tsc`. There is a `tsconfig.json` file describing building procedure.

NOTO: Building should be done automatically during the installation process

# Run

After building you can run the tools:

```sh
# Show info of the backend aspect of the Colabo.space project
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

# TODO

## Warnings

Catch all warnings during the tool running process. For example, if some puzzle offering provide WARN, it should be collected and delivered to the final report. So Promises in the `offerPuzzle()` should return semantic result.

Chech more under: `Parallel control flow` in https://basarat.gitbooks.io/typescript/docs/promise.html

## Types

Make `@types/chalk` working properly: https://github.com/chalk/chalk/blob/master/types/index.d.ts
Currently it is not recognized