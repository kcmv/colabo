# Angular 2+

## Versions incompatibility

### Metadata version mismatch

`ERROR in Error: Metadata version mismatch for module /Users/sasha/Documents/data/development/FDB/fdGraph/node_modules/@angular/animations/browser/browser.d.ts, found version 4, expected 3, resolving symbol ɵf in /Users/sasha/Documents/data/development/FDB/fdGraph/node_modules/@angular/platform-browser/animations/index.d.ts, resolving symbol BrowserAnimationsModule in /Users/sasha/Documents/data/development/FDB/fdGraph/node_modules/@angular/platform-browser/animations/index.d.ts, resolving symbol BrowserAnimationsModule in /Users/sasha/Documents/data/development/FDB/fdGraph/node_modules/@angular/platform-browser/animations/index.d.ts`

+ Scenario
  - App generated and installed with angular-cli ("@angular/cli": "1.4.9")
  - it was working, not sure what has changed, but eventually I got this error
- Solution
  - https://stackoverflow.com/questions/47115649/metadata-version-mismatch-with-angular-4
  - https://stackoverflow.com/questions/43348424/module-not-found-error-cant-resolve-angular-animations
  - we had this mismatch
```json
"dependencies": {
  "@angular/animations": "^5.0.0",
  "@angular/cdk": "^2.0.0-beta.12",
  "@angular/common": "^4.2.4",
  "@angular/compiler": "^4.2.4",
  "//..."
}
```
  - the solution was to fix the `@angular/animations` with: `yarn add @angular/animations@4.2.4`

### TypeError: this.engine.process is not a function

```
ERROR TypeError: this.engine.process is not a function
      at AnimationRenderer.webpackJsonp.../../../platform-browser/@angular/platform-browser/animations.es5.js.AnimationRenderer.setProperty (animations.es5.js:530)
```

This is either incompatibility between ng-material and ng, or instability of ng
+ https://stackoverflow.com/questions/45116240/getting-type-error-using-angular-material
+ https://github.com/angular/material2/issues/5630

```json
"dependencies": {
  "@angular/animations": "^5.0.0",
  "@angular/cdk": "^2.0.0-beta.12",
  "@angular/common": "^4.2.4",
  "@angular/compiler": "^4.2.4",
  "//..."
  "@angular/material": "^2.0.0-beta.12",
}
```
Need to update to newer @angular version: `4.4.6 `
- renname all versions of @angular: i.e. from `4.2.4` into `4.4.6`
- run `yarn install`


# Uncaught Error: Unexpected value 'KnalledgeViewComponent' declared by the module 'AppModule'. Please add a @Pipe/@Directive/@Component annotation.

The full error is:
```
compiler.es5.js:1694 Uncaught Error: Unexpected value 'KnalledgeViewComponent' declared by the module 'AppModule'. Please add a @Pipe/@Directive/@Component annotation.
    at syntaxError (compiler.es5.js:1694)
    at compiler.es5.js:15446
    at Array.forEach (<anonymous>)
    at CompileMetadataResolver.webpackJsonp.../../../compiler/@angular/compiler.es5.js.CompileMetadataResolver.getNgModuleMetadata (compiler.es5.js:15428)
    at JitCompiler.webpackJsonp.../../../compiler/@angular/compiler.es5.js.JitCompiler._loadModules (compiler.es5.js:26826)
    at JitCompiler.webpackJsonp.../../../compiler/@angular/compiler.es5.js.JitCompiler._compileModuleAndComponents (compiler.es5.js:26799)
    at JitCompiler.webpackJsonp.../../../compiler/@angular/compiler.es5.js.JitCompiler.compileModuleAsync (compiler.es5.js:26728)
    at PlatformRef_.webpackJsonp.../../../core/@angular/core.es5.js.PlatformRef_._bootstrapModuleWithZone (core.es5.js:4536)
    at PlatformRef_.webpackJsonp.../../../core/@angular/core.es5.js.PlatformRef_.bootstrapModule (core.es5.js:4522)
    at Object.../../../../../src/main.ts (main.ts:11)
```

Some of references relating to "this" error can be found here
+ https://github.com/angular/angular/issues/16502
+ https://github.com/vimalavinisha/angular2-google-chart/issues/39
+ https://github.com/angular/angular/issues/11438
+ https://github.com/angular/angular/issues/15890
+

However, the problem is with our linking and using

+ [npm link not working](https://github.com/angular/angular-cli/issues/3760)
+ Other solutions:
  - in `@angular/cli/node_modules/@ngtools/webpack/src/plugin.js` comment the line `this._compilerHost.enableCaching();`
  - https://github.com/angular/angular/issues/15763#issuecomment-312296944
+ Solution (If you want to develop and build lib through the hosting app. This method will build the library with the methods and configuration of your app. Production releases can behave differently) [I posted it on github issue here](https://github.com/angular/angular-cli/issues/2154#issuecomment-343288877)
  - references
    - [stories linked library](https://github.com/angular/angular-cli/wiki/stories-linked-library)
    - https://github.com/angular/angular-cli/issues/6195
    - [plone.restapi-angular/docs/development.rst](https://github.com/plone/plone.restapi-angular/blob/master/docs/development.rst)
    - [typescriptlang - module-resolution - path-mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
  - in the lib's package.json
    - in the `peerDependencies` (this is for using the built library) and `devDependencies` (yes twice :), this is for building library separately, not through hosting app ) add all mutual (lib vs. host) dependencies (like all @angular, material, etc)
  - in the host's `tsconfig.json` (some are suggesting `tsconfig.app.json`, but it should work for tests as well ?) direct TS compiler to your local (host) dependencies of the mutual dependencies

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
  }
  ...
}
```
  - configure angular-cli build to follow symlinks:
      - in the `.angular-cli.json` add:

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
  - in this way you should be fine building lib in many scenarios
    - build it separatelly
    - build it throuh (and with) hosting app
    - load it (as prebuilt) to hosting app


# No provider for String

```txt
Error: StaticInjectorError(AppModule)[KnalledgeSearchNodeService -> String]: 
  StaticInjectorError(Platform: core)[KnalledgeSearchNodeService -> String]: 
    NullInjectorError: No provider for String!
```

In the service constructor:

```ts
@Injectable()
export class KnalledgeSearchNodeService extends CFService
{
	constructor(
    private apiUrl:string,
    private http: HttpClient
  ){
}
```

there was a problem of lefting over the non-injectable string parameter `apiUrl:string`

Thi right signature is:

```ts
@Injectable()
export class KnalledgeSearchNodeService extends CFService
{
	constructor(
    private http: HttpClient
  ){
}
```