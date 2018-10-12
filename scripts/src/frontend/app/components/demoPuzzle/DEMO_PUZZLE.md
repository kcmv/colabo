How to create a new Collabo Puzzle?

You should copy all this `demoPuzzle` folder and rename it and its content accordingly, but not change original folder content

# File Structure:

```
+ demoPuzzle (a folder for your puzzle in the 'components' folder)
    +css
      here go .scss files, automatically transpiled to .css
    +partials
      contain component templates
    + js
      services.js   (creation of 'demoPuzzlesServices' service as an NG1 module)
    + partials
    + sass
      at this folder is our sass (.csss) file 'demoPuzzle.csss' or independent .scss file for each sub-component file
      ...
    DEMO_PUZZLE.md (you puzzle explain in MarkDown syntax)
    demoPuzzle.ts (here is defined DemoPuzzle, main Value Object, used as basic piece of data, transmitted through the Puzzle and among Collabo World)
    demoPuzzles.js
```

# Puzzle Integration

## Service Integration
whole integration and communication of our puzzle with the outer Collabo-world goes through Puzzle's service (DemoPuzzleService) so only it has to be integrated
(this process is a bit complicated if we have mingled NG! and NG@ worlds as we have temporary in Collabo-World - CollaboFramework)

In folder `src/frontend/app/js/`
+ app.js
  + these is main Ng1 app file
  + here we add a row `requiresList.push('demoPuzzleServices');` to included in requirements of the main app module
+ app2.ts
  + this is main Ng2 app File
  + here we include our NG2 service file with `import {DemoPuzzleService} from '../components/demoPuzzle/demoPuzzle.service';`
  + then we add our NG2 DemoPuzzleService as a provider to NG2 world and also we add it (downgraded to NG1) to our NG1 service (created in demoPuzzle/js/services.js) and thus to NG1 world
  ```
  // upgradeAdapter.addProvider(DemoPuzzleService);
  var demoPuzzleServices = angular.module('demoPuzzleServices');
  demoPuzzleServices
      .service('DemoPuzzleService', upgradeAdapter.downgradeNg2Provider(DemoPuzzleService))
      ;
  ```
+ in `config` sub-folder
  + config.plugins.js
    + adding our demoPuzzle to be visible to Compass that transpile its .scss file to .css files
    ```
    'components/demoPuzzle': {
      destDir: APP_SRC,
      cssDir: 'css'
    }
    ```
  + in 'plugins' we add all the files (.js, .css, ...) that are transpiled from other ones (.ts, .scss, ...) that have to be loaded by app at running time
  ```
  demoPuzzle: {
  	path: [APP_SRC_STR, 'components/demoPuzzle'],
  	injectJs: ['demoPuzzles.js', 'js/services.js'],
  	injectCss: 'css/demoPuzzle.css'
  },
  ```
  + we make it available in 'puzzlesConfig'
  ```
  demoPuzzle: {
		available: true
	}
  ```

  + we add service as active (difference from upper `available`?)
  and define its plugin connection
  **EXPLAIN THIS FURTHER?!**
  ```
  demoPuzzle: {
    active: true,
    services: {
      DemoPuzzleService: {
      }
    },
    plugins: {
      mapVisualizePlugins: ['DemoPuzzleService']
    }
  }
  ```
  + **IMPORTANT**: We have to RESTART the frontend server, since changes in config/congif.plugins.js file are loaded ONLY at the load time.

## Component Integration

in order for DemoPuzzle to be seen we have to add one or more of its components into the Application Components Hierarchy
 + adding component into its parent Component
```
import {DemoPuzzleComponent} from '../demoPuzzle/demoPuzzle.component';
```
adding DemoPuzzleComponent to 'directives' list
+ adding component template (identified by 'selector' defined int its component) into parent's template
```
<demo-puzzle></demo-puzzle>
```

## Integration with collaboPlugins
with the rest of the Collabo-world (with other puzzles) our puzzle should  communicate loosely coupled - through collaboPlugins API
+ adding to `src/frontend/app/js/config.plugins.js`
+ src/frontend/app/js/pluginDependencies.ts ?
... TBD ...
