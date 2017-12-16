(NOTE: this is a raw document, based on instructions for the integation of Colabo into [FDB infastructure](http://dbfederation.cs.umu.se/) at the [UmU University](umu.se) (Umeå, Sweden))

# Intro

This is a MEAN stack app so you should have `node + npm` pre-installed and then do a standard npm install based on the `package.json` file

`npm install`

or even better

`yarn install`

as yarn is the prefered approach.

## Angular-CLI

Currently for the simplicity purpose and for faster migration this project is developed and deployed through NG-CLI. That means you should have it installed.

For the document regarding the NG-CLI (Angular CLI), please check [NG-CLI.md](NG-CLI.md).

NOTE: After the transition period we will integrate more reliable and production ready `colabo build` infrastructure.

# linked npm packages

Some of the packages that this app depends on (like the packages from the `CoLabo` ecosystem) are not available (or not the latests versions) at the npm repository, so you should link them localy from the corresponding local repositories.

## Preparing external project dependencies

***NOTE***: The following ellaborative procedure is nothing but about dealing with healthy modular JS development. It depends on npm support and mainly on isolating modules/components/puzzles (any word should work here ;) ) into separate npm packages. Those packages are expensive to keep only in npm repository because development process would be insane, so we keep them localy, concurently develop in each codebase and keep everything healthy with the help of `npm link` that is providing us with feeling that we have separate npm packages by symbolicly linking to each folder that stands for the npm package.

***NOTE***: The only additional layer the `CoLabo` practices provide are more structural organization of those packages inside of the colabo config file: `colabo.config.js`. Appart of avoiding npm-linking-chaos (by making clear what should be npm-linked where) CoLabo will eventually have an automated mechanism for doing dirty npm linking work for you based on these files.

The list of dependencies we are depending on is in the `frontend/colabo.config.js` file under the `dependencies` property.

***NOTE***: we will add the `<fdb>/` in order to distinguish same files from different repositories or ecosystems. For example the `colabo.config.js` file exists both in our `<fdb>` ecosystem and in the `<colabo>` ecosystem.

For example let's find one puzzle from the `<fdb>/frontend/colabo.config.js` that we depend on:

```js
dependencies: {
  "@colabo-puzzles/puzzles_core": {
  },
  // ...
  "@fdb-stats/stats_core": {
  }
},
```

As we see the scope of the first puzzle is `@colabo-puzzles` with the `@colabo-` prefix. This tells us that the puzzle comes from the `CoLabo` ecosystem.

On the other hand the scope of the last puzzle is `@fdb-stats` with the `@fdb-` prefix. This tells us that this puzzle comes from our own `FDB` ecosystem.

Appart of the local depencenies (`FDB`) the current only dependency we depend on is the `CoLabo` ecosystem.

The `CoLabo` ecosystem is follwoing monorepo(sitory) approach. Google, Facebook, ... are practicing it, and there are many values for practicing it, we can discuss it for our projects here as well.

Therefore, you should clone the colabo monorepo at any location of your preference.

```sh
cd <some_dev_folder>
git clone https://github.com/Cha-OS/colabo
cd colabo
git checkout cf-ng5 # this is the current ng5 migrating branch
```

Now when you are in the colabo folder, you should *npm export* all colabo puzzles (npm packages) that are necessary for our hosting app (`FDB` in this case). As we already said the list of all puzzles we depend on are in our `frontend/colabo.config.js` file under the `dependencies` property.

To find path to each dependency you will need to consult the colabo's config file: `<colabo>/src/frontend/colabo.config.js`. There under the `offers` property you have paths for each puzzle you need. There you have their npm names and their local paths. Local puzzle's paths are relative to the `colabo.config.js` file, or in other words, to the `frontend` folder, where the `colabo.config.js` file is located.

If we recall the first puzzle from our `<fdb>/frontend/colabo.config.js` that we depend on, it is the `@colabo-puzzles/puzzles_core` puzzle.

In the `<colabo>/src/frontend/colabo.config.js` we see:

```js
offers: {
  "@colabo-puzzles/puzzles_core": {
    npm: "@colabo-puzzles/puzzles_core",
    path: "dev_puzzles/puzzles/puzzles_core"
  },
  // ...
}
```

Therefore the relative path is `dev_puzzles/puzzles/puzzles_core`, and full path is `<colabo>/src/frontend/dev_puzzles/puzzles/puzzles_core`.

To *npm export* you navigate to that folder and run the following command:

```sh
npm link
```

This command will access the puzzle's `package.json` file (which is a standard npm package config file), and based on it export tha puzzle into a global ( = your (whole) local machine) npm space.

***NOTE***: npm is basically doing a symbolic linking to the global (in the regard to your development machine) npm packages:

```
/usr/local/lib/node_modules/@colabo-puzzles/puzzles_core -> <colabo>/src/frontend/dev_puzzles/puzzles/puzzles_core
```

(NOTE: `<colabo>` stands for the absolute path to the colabo folder)

With this command this puzzle (npm package) is globaly available on your local machine. However, you still need to import it on each of the npm-based apps you want to use it in.

Therefore you need to get in your (hosting) app and import the puzzle there. We advise you to open a separate terminal tab (window) to avoid wondering across puzzle-provider (<colabo>) and puzzle-consumer (<fdb>) folders.

You should navigate to the <fdb> folder, it is any folder covered with the npm `package.json` and the best is to be *next to* the `package.json` folder :) (in the `<fdb>/frontend` fodler in our case).

When you are there you should run the command:

```sh
npm link @colabo-puzzles/puzzles_core
```

This command will basically do one more symbolic linking from npm global packages folder to your hosting local npm folder (`<fdb>/frontend/node_modules`):

```
<fdb>/frontend/node_modules/@colabo-puzzles/puzzles_core -> /usr/local/lib/node_modules/@colabo-puzzles/puzzles_core -> <colabo>/src/frontend/dev_puzzles/puzzles/puzzles_core
```

Now you can check and see that it is linked inside of your local app:

```sh
# shows linkings
ls -al node_modules/@colabo-puzzles/puzzles_core
# shows the linked content
ls -a node_modules/@colabo-puzzles/puzzles_core
```

GREAT, THAT IS IT! You have imported a Colabo puzzle inside your hosting app!

HOWEVER, you need to repeat it for all puzzles our app depends on as we can find in the `<fdb>/frontend/colabo.config.js` under the `dependencies` property.

You should do it also for your ***LOCAL*** puzzles (the `@fdb-stats/stats_core` puzzle). This might be odd, but again very important, it means that you DECOUPLED your own code and you will not have any local references to your own puzzle-d code, which is VERY HEALTHY! :) You also do not need to care about the relative paths of your files inside the puzzle. They are all *stabilized* with the npm path, like:

```js
import {StatsMainComponent} from '@fdb-stats/stats_core/statsMain.component';
```

In addition it might be a strange process from the perspective of npm (`package.json`, etc). In practice, it is not, remember you have a `package.json` file for each puzzle. Therefore you will have it in the "@fdb-stats/stats_core" as well and that package will be responsible for exporing it to the global npm space:

```
cd <fdb>/frontend/src/dev_puzzles/stats/stats_core
npm link
```

will produce sym linking into the global npm space:
```
/usr/local/lib/node_modules/@fdb-stats/stats_core -> <fdb>/frontend/src/dev_puzzles/stats/stats_core
```

and now if we get to our app folder, we can import it in our app:

```
cd <fdb>/frontend/
npm link @fdb-stats/stats_core
```

you will get sym link into your local hosting app's npm space (`node_modules`)

```
<fdb>/frontend/node_modules/@fdb-stats/stats_core -> /usr/local/lib/node_modules/@fdb-stats/stats_core -> <fdb>/frontend/src/dev_puzzles/stats/stats_core
```

Now you can check and see the linkage:

```sh
# shows linkings
cd <fdb>/frontend/
ls -al node_modules/@fdb-stats/stats_core
# shows the linked content
ls -a node_modules/@fdb-stats/stats_core
# show puzzle's `package.json`
cat node_modules/@fdb-stats/stats_core/package.json
```
## Hosting app

You should also prepare your hosting app (fdb) to work properly with externally linked npm packages. BUT, this is already done for this app, so you can skip this
 section unless you want to understand more on issues with npm linking and TypeScript compiling and webpack building process.

+ More details you can see here [stories linked library](https://github.com/angular/angular-cli/wiki/stories-linked-library), but they are also summed up [here](https://github.com/angular/angular-cli/issues/2154#issuecomment-343288877)
  - you need to follow up only the 2nd and 3rd steps (since the 1st is addressing the library)

# Adding JS and CSS files in the project (NG-CLI)

In the case you need to add additional js or css file to your app you need to let ng-cli know about it. After migration to the colabo building environment, this step will be minimalized, or even removed completely for the external puzzles.

+ https://blog.dmbcllc.com/adding-css-and-javascript-to-an-angular-2-cli-project/
+ Open `.angular-cli.json` and extend it with required files:

```json
"styles": [
  "styles.css",
  // CSS goes here
],
"scripts": [
  // JS goes here
],
```
+ **NOTE**:
  - files are relative to the `src` folder, or what ever is specified within the `root` parameter in the `.angular-cli.json`: `"root": "src",`
  - you should restart angular-cli to reload the file

# Building and running

To build and run app you need to do:

```sh
# to run and open browser to go to the app homepage
ng serve -o
# to run without openning browser
ng serve
# to run on the port `8888` and open browser to go to the app homepage
ng serve -o --port 8888
```

After any change in the code ng-cli should detect it, rebuild code and reload the browser content.

***WARNING***: NG-ClI get sometimes confused with sym-links. Therefore you might trigger it sometimes by resaving (not even changed) file from the root app folder, like the `<fdb>/frontend/src/app/app.module.ts` file. If that didn't work (observe in the terminal if rebuildng got triggered), you need to quit and restart the ng-cli command.
