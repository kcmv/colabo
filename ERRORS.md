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
