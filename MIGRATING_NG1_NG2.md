# Finding if a component is ng1 or ng2

##

## If component is a main component

in this case:  `http://localhost:5555/#/maps` list of component is a main component.

We go to the list of routes at: 'app.js' and find the `maps` route, and its template: `components/knalledgeMap/partials/knalledgeMaps-index.tpl.html`. There we see that it is a `knalledge_maps_list` component, and we see it is an the `components/knalledgeMap/js/directives.js` file, and it is a ng2 component.

# Migrating whole ng1 project into hybrid one

1. Backup old node_modules
2. copy node_modules of a working hybrid project as a new one
3. copy
    1. bower.json
    2. gulpfile.ts
    2. tools folder
    2. typings folder
    2. bower_components folder
        3. be careful to not lose important files
    2. node_modules folder
        3. be careful to not lose important files
    2. tsconfig.json
    3. tslint.json
    4. typings.json
1. correct
    1. bower.json
    2. tools/config.ts
        3. rename build
        4. organize compass and sass files
        5.
1. package.json
    2. backup the old one
    3. replace it iwth working version
    4. update parts from the backed up one
5. copy app/js/upgrade_adapter.ts
1. app/js/app2.ts
    2. add the file
    3. update the file
1. app/index.html
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
