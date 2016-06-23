# Finding if a component is ng1 or ng2

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
