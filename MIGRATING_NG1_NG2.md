# Finding if a component is ng1 or ng2

[an official draft (gDoc)](https://docs.google.com/document/d/1xvBZoFuNq9hsgRhPPZOJC-Z48AHEbIBPlOCBTSD8m0Y/edit#!)

Much more on that in our [gDoc - Migration/Integration ng1/ng2](https://docs.google.com/document/d/1HeuwN8za3OH6t1260NjK25paACPzQpDgWX-QPRAizSE/edit#)

## Component

+ create a new NG2 component (code and template)
+ regular JS code 
  + you can simply migrate it to the new TS file
  + some part of code you can make transform to benefit more from TS

### Component dependencies

#### NG1

##### Misc

+ system or user-space services should be added with special decorator `@Inject`:
+ user-space example:  
  + `@Inject('RimaService') private RimaService`
+ system example: 
  + `    @Inject('$injector') private $injector`
  + `@Inject('$compile') private $compile`
+ some of the NG1 "workaround" services are not necessary anymore in the NG2 world, because a lifecycle of updating components is improved and we do not need to run $digest after any change
  + $window -> window
  + $timeout -> setTimeout



##### `$scope`

+ parameters and methods move simply to the directive's class public (or private if it is not used outside the code part) parameters and methods. In that way they will become available in the directive's template
  + for example: `$scope.route` becomes `this.route` and it is declared as `public route:string;`
+ $apply is not necessary anymore (all changes are done in zones anyway in ng2+ su you are safe). Something as complex and annoying as this:

```js
if (commingFromAngular) processNodeUnselected();
else {
  $scope.$apply(processNodeUnselected);
}
```

+ will become as simple as this
```js
processNodeUnselected()
```

+  `$scope.$on('$destroy'` and all other directive's lifecycle hooks are done on the level of the directive's class: `export class KnalledgeViewComponent implements OnDestroy{`
  + more details at https://angular.io/guide/lifecycle-hooks
+  providing $sope
  +  [Angular 2: subscribe to AngularJS $scope.$broadcast / $scope.$emit messages?](https://stackoverflow.com/questions/37823201/angular-2-subscribe-to-angularjs-scope-broadcast-scope-emit-messages)
  +  this should not be done if REALY NOT NECESSARY
+  `$scope.$watch`
  +  [How to watch on complex object in Angular 2 like we did in Angular 1 using $watch](https://stackoverflow.com/questions/37888772/how-to-watch-on-complex-object-in-angular-2-like-we-did-in-angular-1-using-watc)
  +  [What is replacing $watch in Angular 2.0?](https://www.quora.com/What-is-replacing-watch-in-Angular-2-0)
  +  [Observing a change in an object property in Angular 2](https://stackoverflow.com/questions/38280489/observing-a-change-in-an-object-property-in-angular-2)
  +  [Angular2 watch object/array changes (Angular2 final >= 2.1.1)](https://stackoverflow.com/questions/40784195/angular2-watch-object-array-changes-angular2-final-2-1-1)
  +  Observables
     +  https://angular.io/guide/component-interaction
     +  https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html
  +  Object.observe()
     +  [Object.observe ECMAScript Proposal to be Withdrawn](https://www.infoq.com/news/2015/11/object-observe-withdrawn)
     +  [An update on Object.observe](https://esdiscuss.org/topic/an-update-on-object-observe)
     +  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     +  [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
  +  https://angular.io/api/core/DoCheck
+  `angular.element` and `$element.find()`
   +  [How can I select an element in a component template?](https://stackoverflow.com/questions/32693061/how-can-i-select-an-element-in-a-component-template)
   +  [How do you access the element HTML from within an Angular 2 attribute directive?](https://stackoverflow.com/questions/38002640/how-do-you-access-the-element-html-from-within-an-angular-2-attribute-directive)
   +  https://angular.io/api/core/Renderer2

```ts
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';

export class KnalledgeViewComponent implements AfterViewInit{
  @ViewChild('map_container', { read: ElementRef }) mapContainer: ElementRef;

  ngAfterViewInit(){
	console.log(this.mapContainer.nativeElement);
  }
}
```



##### `$injector`

+  [Dependency Injection in Angular 2](https://pascalprecht.github.io/slides/di-in-angular-2/)
   +  https://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html
+  MULTI PROVIDERS IN ANGULAR
   +  https://blog.thoughtram.io/angular2/2015/11/23/multi-providers-in-angular-2.html
+  not relevant to the problem
   +  https://angular.io/api/core/Injector
   +  https://angular.io/guide/ngmodule-faq
   +  https://codecraft.tv/courses/angular/dependency-injection-and-providers/ngmodule-providers-vs-component-providers-vs-component-viewproviders/
+  https://v2.angular.io/docs/ts/latest/api/core/index/ModuleWithProviders-interface.html#!#providers-anchor
+  https://angular.io/api/core/ReflectiveInjector

```ts
import { Injector } from '@angular/core';

export class KnalledgeViewComponent{
  private KnalledgeMapViewService:any;

  constructor(
    private ng2injector:Injector,
  ) {
    this.KnalledgeMapViewService = this.ng2injector.get('KnalledgeMapViewService', null);
  }
}
```

+ Providing a new 

```ts
// app.module.ts
declare var Plugins:any;

@NgModule({
  // ...
  providers: [
    {provide: WindowWrapper, useFactory: Plugins}
  ],
  bootstrap: [AppComponent]
})
```

+ `ERROR in Error: Error encountered resolving symbol values statically. Reference to a local (non-exported) symbol 'Plugins'. Consider exporting the symbol (position 34:13 in the original .ts file), resolving symbol AppModule in /Users/sasha/Documents/data/development/FDB/fdGraph/src/app/app.module.ts`
  + [Angular deprecates ReflectiveInjector and introduces StaticInjector. Should you care?](https://blog.angularindepth.com/angular-introduces-staticinjector-should-you-care-4e059eca030c)

## If component is a main component

in this case:  `http://localhost:5555/#/maps` list of component is a main component.

We go to the list of routes at: 'app.js' and find the `maps` route, and its template: `components/knalledgeMap/partials/knalledgeMaps-index.tpl.html`. There we see that it is a `knalledge_maps_list` component, and we see it is an the `components/knalledgeMap/js/directives.js` file, and it is a ng2 component.

# Migrating whole ng1 project into hybrid one

1. Backup old node_modules
2. copy node_modules of a working hybrid project as a new one
3. copy
    1. bower.json
    2. gulpfile.ts
    3. tools folder
    4. typings folder
    5. bower_components folder
        3. be careful to not lose important files
    6. node_modules folder
        3. be careful to not lose important files
    7. tsconfig.json
    8. tslint.json
    9. typings.json
4. correct
    1. bower.json
    2. tools/config.ts
        3. rename build
        4. organize compass and sass files
          5.
5. package.json
    2. backup the old one
    3. replace it iwth working version
    4. update parts from the backed up one
6. copy app/js/upgrade_adapter.ts
7. app/js/app2.ts
    2. add the file
    3. update the file
8. app/index.html
    2. add the file
    3. update the file

## Into 4.2.4
+ The **template** attribute is deprecated. Use an **ng-template** element instead
  - https://github.com/shlomiassaf/ngx-modialog/pull/312
  - `<div template="ngIf:viewConfig.type.name =='collabo_framework'">` -> `<div ng-template="ngIf:viewConfig.type.name =='collabo_framework'">`

## Upgrading with yarn

+ https://www.npmjs.com/package/yarn-update
  - `yarn global add yarn-update`
  - `yarn-update`
+ https://stackoverflow.com/questions/40736153/how-do-i-upgrade-all-scoped-packages-with-yarn
# Angular Material

## Into 2.0.0-beta.12

+ rename `md-` into `mat-`
+ `md-content` (`mat-content`) doesn't exist anymore. Remove it
+ `md-sidenav-layout` (`mat-sidenav-layout`) is replaced with `mat-sidenav-container`

## sidenav

+ https://material.angular.io/components/sidenav/overview#sidenav-mode
  - Using the side mode on mobile devices can affect the performance and is also not recommended by the [Material Design specification](https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-behavior) recommended by the [Material Design specification](https://material.io/guidelines/patterns/navigation-drawer.html#navigation-drawer-behavior)


## Lack of layout in ng-material 2

+ https://github.com/angular/material2/issues/946
+ I think we were using https://github.com/justindujardin/ng2-material which is not ideal
+ ng-material team decided to not implement their own layout but let users use other libs for layout
  - http://angularjs.blogspot.se/2016/12/angular-material-beta-release-new-flex.html
  - one recommended is [@angular/flex-layout](https://www.npmjs.com/package/@angular/flex-layout)
  - https://github.com/angular/flex-layout
  - https://github.com/angular/flex-layout/wiki
  - `yarn add @angular/flex-layout@latest`
  - You still can try to use old material1
    - https://github.com/angular/material2/issues/946#issuecomment-245938636
    - https://raw.githubusercontent.com/angular/material/master/src/core/services/layout/layout-attributes.scss
    - https://raw.githubusercontent.com/angular/material/master/src/core/style/layout.scss

```

```