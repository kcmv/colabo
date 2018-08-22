# Installing

***NOTE***: Before installing backend you need to install Colabo.Space tools. Please read how to install them in the [tools/README.md](../tools/README.md) document.

## Install Colabo Frontend Core

```sh
cd colabo/
cd src/frontend
yarn
# probably not necessary
```

## Install Frontend Colabo Puzzles (Packages)

***NOTE***: This is done automatically during the install process (please check the script `prepare` inside the `package.json` for any project) and it is not necessary to be done manually.

These packages come from the Colabo Ecosystem and from its [Colabo github repository](https://github.com/Cha-OS/colabo).

We developed colabo tools for automating the task of managing colabo puzzles.

After installing them (check [../tools/README.md]), you can just run inside the frontend folder:

```sh
# show colabo config file and all puzzles
colabo puzzles-info
# export offered puzzles
colabo puzzles-offer
# install required puzzles
colabo puzzles-install
```

### Explanation

This is just an explanation and not necessary to be done manually, because it is done through the colabo commands.

1. each offered puzzle is exported globally as a npm package (by getting inside the puzzle folder and running `npm link` command)
2. each required puzzles is imported with something like:

```sh
cd src/frontend
npm link @colabo-puzzles/puzzles_core
```

# Install Old (should not be necessary anymore)

## Typings

They should be not necessary any more since of introduction of `@types` pacakges, like `@types/jasmine`, etc

So you should be able to ***SKIP*** this section

```sh
# yarn run typings install
```

Build typings, either:

1\. Using **global** `typings` module:

```sh
typings -v
typings install
```

2\. Instead of using global, do it in a safer mode, by using the **local** version of the module:

```sh
./node_modules/typings/dist/bin.js -v
./node_modules/typings/dist/bin.js install
```

#### Typings issues

- open `src\frontend\typings\globals\angular-protractor\index.d.ts` and
- go to the bottom of the file and comment the line `declare var $: cssSelectorHelper;` => `// declare var $: cssSelectorHelper;`

## Bower modules

We are not depending on Bower any more (everything is migrated to the npm packages).

Install bower modules:

```sh
bower install
```

### Bower install issues

```sh
bower install
```

***Halo*** package is not published so we need to download from [here](http://colabo.space/downloads/halo.zip) it, and place the extracted "halo" folder into the bower folder: `KnAllEdge/src/frontend/bower_components/`.

With installing bower packages on OSX you might need xcode, here are some hints what might be happening and how to resolve it:

if you get the error:

```
"xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun"
```

This is a problem with 'OS X El Capitan', you should run: `xcode-select --install`

More on:

- [invalid-active-developer-path-on-mac-os-x-after-installing-ruby](http://stackoverflow.com/questions/28706428/invalid-active-developer-path-on-mac-os-x-after-installing-ruby)
- [xcrun-error-invalid-active-developer-path-library-developer-commandline-tools-missing-xcrun/](http://tips.tutorialhorizon.com/2015/10/01/xcrun-error-invalid-active-developer-path-library-developer-commandline-tools-missing-xcrun/)

## Installing SASS support

**NOTE**: New code rely much more on `angular-material` and `angular-flex` libraries. Therefore we can ***try*** to avoid SASS components at all.

However, for many things like CSS variables, etc we will need it again. Currently we are doing much less specific design, and we are fine without it, having abovementioned libraries in place.

Eventually we would like to replace ruby version of sass with node/npm version. There are npm packages and it should be possible.

```sh
ruby -v
sudo gem install sass
sudo gem install compass
sudo gem install susy
sudo gem install breakpoint
sudo gem install normalize-scss
```

## Installing FONT-AWESOME support

**NOTE**: New code rely much more on `angular-material` and `google material icons`. Therefore we can ***try to*** avoid FONT-AWESOME fonts.

If we need it in the future, we can swich to [non-ruby version](https://github.com/Cha-OS/development-environment/blob/master/media/fontsawesome.md)

```sh
sudo gem install font-awesome-sass -v 4.7.0
```

(NOTE: we have to have speciffic version for font-awesome-sass because it is reffered in the `app/sass/default.scss`)

if different version is installed you can uninstall it with:

```sh
sudo gem uninstall font-awesome-sass -v 4.6.2
```

On some machines it might be necessary to do:

```sh
sudo chmod -R og+rx /Library/Ruby/Gems/2.0.0/
```

in order to provide reading access.

# Deploying frontend

https://angular.io/guide/deployment

https://github.com/angular/angular-cli/wiki/build

https://github.com/angular/angular-cli

## Simplest deployment possible

```sh
# standard
ng build

# if it is not in the domain root
ng build --base-href=/knalledge-view-node
```

Configure the server to redirect requests for missing files to `index.html` (server-side redirects).

## Optimize for production

```sh
ng build --prod --build-optimizer
```

```sh
ng build --prod --base-href=/knalledge-view-node/
```

or

```sh
ng build --prod --base-href=/knalledge-view-node/ --build-optimizer
```

If you want to debug the erors:
```sh
ng build --prod --base-href=/knalledge-view-node/  --build-optimizer=false
```
## AngularCli: disable minification

https://stackoverflow.com/questions/43557090/angularcli-disable-minification

[Need to disable: Add support for minifying index.html #5753 #7179](https://github.com/angular/angular-cli/issues/7179)

`node_modules/@angular/cli/models/webpack-configs/browser.js`
`node_modules/@angular/cli/models/webpack-configs/production.js`
+ mask: `UglifyJSPlugin` plugin
+ HtmlWebpackPlugin

### Problems

#### Cannot resolve all parameters for (Service)

https://github.com/angular/angular/issues/21526
https://stackoverflow.com/questions/47222685/warning-cant-resolve-all-parameters-for-userspermissionsservice-this-will-beco?rq=1
https://stackoverflow.com/questions/47926180/error-in-cant-resolve-all-parameters-for-service-when-build-with-ng-build-p?rq=1

Solution: each class that is declared as injectible and/or provided as a provider MUST be injectible, so no any parameter that is not injectable in constructor, etc

#### 'router-outlet' is not a known element

```txt
ERROR in : 'router-outlet' is not a known element:
1. If 'router-outlet' is an Angular component, then verify that it is part of this module.
2. If 'router-outlet' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. ("
</nav>

[ERROR ->]<router-outlet></router-outlet>
")
```

the same problem as the (following) error: `NullInjectorError: No provider for t!`
#### NullInjectorError: No provider for t!

+ https://github.com/angular/angular/blob/master/CHANGELOG.md#breaking-changes
+ https://github.com/ngrx/platform/issues/549

```
Error: StaticInjectorError(ju)[t -> t]: 
  StaticInjectorError(Platform: core)[t -> t]: 
    NullInjectorError: No provider for t!
```

```
Error: StaticInjectorError(AppModule)[RouterLink -> Router]: 
  StaticInjectorError(Platform: core)[RouterLink -> Router]: 
    NullInjectorError: No provider for Router!
```

If you want to debug the erors:
```sh
ng build --prod --base-href=/knalledge-view-node/  --build-optimizer=false
```
(NOTE: It doesn't work)

Relevant
+ https://github.com/salemdar/angular2-cookie/issues/37

***"Problem"*** was in the file `KnAllEdge/src/frontend/demos/knalledge/knalledge-view-node/src/app/app.module.ts`

```ts

var moduleImports = [
  // ...
  // Material
  BrowserAnimationsModule,
  MaterialModule
];

moduleImports.push(AppRoutingModule);

// ...

@NgModule({
  declarations: moduleDeclarations,
  imports: moduleImports,
  entryComponents: [],
  providers: [
    // ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The problem is the line: `moduleImports.push(AppRoutingModule);`

Angular AOT (Ahead-Of-Time) compiler compiles code:
1. finds `@NgModule({`
2. finds `imports: moduleImports`
3. looks for the `moduleImports` value, and 
4. "folds" it with initialized value
5. doesn't extends it by parsing the line: `moduleImports.push(AppRoutingModule);`
6. AOT version doesn't find `Router` provider

**"Solution"** is to provide all parameteres during the initialization:

```ts
var moduleImports = [
  // ...
  // Material
  BrowserAnimationsModule,
  MaterialModule,

  AppRoutingModule
];

// moduleImports.push(AppRoutingModule);
```

We should:

1. provide an issue in angular or
2. find alternative way to help AOT to recognize additional injections or
3. find an declarative way to tell AOT about additional injections
4. avoid additional injections, but then we are much more hardcoded and we cannot make it working dynamically, based on the puzzles/components we are using