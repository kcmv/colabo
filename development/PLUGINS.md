# Intro

Colabo supports two type of extension. One is run-time and other is a puzzle - a new component addition.

A ***run-time extension*** means that inside the code that is already part of our Colabo ecosystem we want to offer either a new feature available for the rest of the system or to hook to some other component and extend it. Please read more under the ***Registering runtime plugins*** chapter.

A ***puzzle extension*** is a way of adding new component as a new code, through additional npm package and integration within the Colabo ecosystem. Please read more under the ***Colabo Puzzles*** chapter.

# Registering runtime plugins

## Examples

+ Ontov (app/components/ontov)

## Plugins API

Plugin API is provided within the ```collaboPluginsServices module``` that currently has only one service: ```CollaboPluginsService``` that does the whole hard job.

### Registering plugins



It registers plugin with structure

```js
{
    name: "PluginHero",
    components: {

    },
    references: {
        referenceName1: {
            items: {
                itemName1: null,
                itemName2: null,
                ...
            }
        }
    }
}
```

## Plugins page

At the plugins page we can see the list of currently loaded plugins

Path: ```/#/plugins```

Plugins reporter is a component that is existing in: ```components/collaboPlugins```.

in the angular router we have:

```js
.when('/plugins', {
    templateUrl: 'components/collaboPlugins/partials/plugins-index.tpl.html'
})
```

# Colabo Puzzles

This chapter refers to components/puzzles that are not about just run-time enabling a plugin, but rather providing it as an additional component, mostly as a separate npm package that you should install and register the component inside the Colabo ecosystem.

## Introduction to the config.plugins.js file

The file `config.plugins.js` sits in the `src/frontend/app/js/config/` folder. It is responsible for the most of Colabo ecosystem configuration. It's structure looks like:

```js
var project = {
  // decscribes project and sub projects
}

// set of variables and path shortcuts/aliases

// for each sub-project you should have a similar configuration
project.subProjects.KNALLEDGE.COMPILATION = {
  // configuring paths (src. )
  COMPASS: {
    PATHS: {
      'components/collaboPlugins': {
        destDir: APP_SRC,
        cssDir: 'css',
        isPathFull: false
      },
      // the rest of components
    }
  }
};

/* Configuration */
var plugins = {
  // a set of modules and view components that should be added for each of components
  "ViewComponents": {
    // ...
  },
  
  puzzlesBuild: {
    // ...
  },
  
  puzzles: {
    // ...
  }
};



```

### ViewComponents configuration

```js
"ViewComponents": {
  "knalledgeMap.Main": {
    modules: {
      TopPanel: {
        active: true,
          path: "/components/topPanel/topPanel"
      },
        // ...
    },
      components: {
        TopPanel: {
          active: true,
            path: "/components/topPanel/topPanel"
        },
        // ...
        'cf.puzzles.ibis.actionsForm': {
          active: true,
          path: "cf.puzzles.ibis.actionsForm"
        },
      }
  },
    // ...
},
```



This part of the configuration tells which (angular 2+) **modules** and (angular 2+) **components** should injected for each enlisted **hosting component**. This helps us to extend hosting components dynamically and without need for changing them. The code responsible for loading extensions is located in `src/frontend/app/components/collaboPlugins/pluginsPreloader.ts`

One of the enlisted hosting components is `"knalledgeMap.Main"` and inside of it is injected one module `TopPanel` and few components where `TopPanel` where is one of them.

For **modules** there is an `active` parameter that can disable the injection, and a `path` parameter, that tells where the module is located.

For **components** there is an `active` parameter that can disable the injection, and a `path` parameter, that tells where the component is located.

As we can see with the injecting component `cf.puzzles.ibis.actionsForm`, the path is a preset string, rather than a real path. All paths are defined in the `src/frontend/app/js/pluginDependencies.ts` file. Due to the angular (System.js ?) importing problems, making impossible to import a file with a path programmatically set, we need to have this file with **explicit imports**.

The hosting angular component "knalledgeMap.Main" (placed in the `src/frontend/app/components/knalledgeMap/main.ts` file) has to be extension friendly and to ask `pluginsPreloader` to load extensions for them:

```js
var componentDirectives = [
  // ...
];

PluginsPreloader.addDirectivesDependenciesForComponent('knalledgeMap.Main', componentDirectives);

var moduleImports = [];

PluginsPreloader.addModulesDependenciesForComponent('knalledgeMap.Main', moduleImports);

// @NgModule for tools
@NgModule({
    imports: moduleImports,
    providers: moduleProviders,
    exports: componentExportDirectives,
    declarations: componentDirectives,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

The crucial are two calls to `PluginsPreloader.addDirectivesDependenciesForComponent()` and `PluginsPreloader.addModulesDependenciesForComponent()` and proper treatment of lists of modules and components.

### Compass configuration

For the Compass configuration, the hash key (for example `'components/collaboPlugins'`) is used to form the source path as

<cf_frontend_folder_>/\${path}/sass

in the case `isPathFull == true` or otherwise as

<cf_frontend_folder_>/\${APP_SRC}/\${path}/sass

where the `APP_SRC` var is usually set to `app`.

The `destDir` and `cssDir` parameters determines destination of the sass/compass compilation:

`<cf_frontend_folder_>/${destDir}/${path}/${cssDir}`

**NOTE**: by default, `isPathFull` is set to `true` for each external puzzle (described with a separate `config.js` file) since they themselves are referred to the `<cf_frontend_folder_>` inside the  `config.plugins.js` anyway, and the same **key** used to form the compass source path. This means that one external puzzles CANNOT have multiple source paths at the moment. The extension should be simple as adding suffixes for the each sub-compass folder inside the puzzle. Check for more details: `tools/config.ts:injectExternalPuzzle`.

**NOTE**: External puzzles do not have their registries in this main COMPASS configuration, but they have separate COMPASS configuration inside their own `config.js` file.

### puzzlesBuild configuration



```js
puzzlesBuild: {
  knalledgeMap: {
    directive: {
      path: [APP_SRC_STR, 'components/knalledgeMap'],
      injectJs: [
        'js/directives/index.js',
        // ...
      ],
      injectCss: ['css/default.css', 'css/graph.css']
    },
    interaction: {
      path: [APP_SRC_STR, 'js/interaction'],
      injectJs: ['interaction.js', 'moveAndDrag.js', 'keyboard.js']
    },
    knalledge: {
      path: [APP_SRC_STR, 'js/knalledge'],
      injectJs: ['mapLayout.js', /* ... */]
    }
  },
  collaboPlugins: {
    path: [APP_SRC_STR, 'components/collaboPlugins'],
    injectJs: ['js/directives.js', 'js/services.js'],
    injectCss: 'css/default.css'
  },
  // ...
}
```

puzzlesBuild configuration provides configuration necessary to build each of the components.

At the example above we see two scenarios, the `knalledgeMap` puzzle with 3 subcomponents: directive, interaction, and knalledge, and the collaboPlugins single puzzle.

In both cases there are 3 parameters:

+ `path`: path to the component, relatively to the `<cf_frontend_folder>`. `APP_SRC_STR` is in the run-time replaced with the `APP_SRC` variable, that is usually rendered into the `app` folder.
+ `injectJs` (string | array of strings): a list of JS files (relative to the `path`) that should be injected
+ `injectCss` (string | array of strings): a list of CSS files (relative to the `path`) that should be injected

**NOTE**: External puzzles do not have their registries in this main puzzlesBuild configuration, but they have separate puzzlesBuild configuration inside their own `config.js` file.

?! what is the boolean **css** parameter ?!

### puzzles configuration

```js
puzzles: {
  mapsList: {
    active: true,
    config: {
      title: 'www.Colabo.space',
      openMap: {
        routes: [{
          route: 'map',
          name: 'map',
          icon: ''
        }]
      }
    }
  },
  request: {
    active: true,
    services: {
      requestService: {
        name: 'RequestService',
        path: 'request.RequestService'
        // icons: {
        // 	showRequests: {
        // 		position: "nw",
        // 		iconClass: "fa-bell",
        // 		action: "showRequests"
        // 	}
        // }
      }
    },
    plugins: {
      mapVisualizeHaloPlugins: ['requestService'],
      // mapInteractionPlugins: ['requestService'],
      keboardPlugins: ['requestService']
    }
  },
  notify: {
    active: true,
    services: {
      NotifyNodeService: {}
    },
    plugins: {
      mapVisualizePlugins: ['NotifyNodeService']
    }
  },

  // ...

  ibis: {
    active: true, // is active puzzle
    path: 'dev_puzzles/ibis' // path to the puzzle folder, relative to the project (frontend) root
  },
  // ...
}
```

Puzzles configuration describes each puzzle, its configuration, activity state, etc. Here is the more detailed list of paremeters:

+ `active` (Boolean): tells if the puzzle is active or not. **NOTE**: even if there are sub-puzzles, like in the knalledgeMap case, we still have only one parameter, that enables/disables the main puzzle and all sub-puzzles.
+ `config` (any): this is an object that is available and provided to puzzles. [TODO: write more how they are available, except direct access to the global config object]
+ `services` (hash of objects): it enlists services that are provided within the puzzle.
  + Each hash entry represents one service. It is possible to have
    + parameters inside the entry (like in the case of the `RequestService` service)
      + `name`: a reference name to the service
      + `path`: a reference path of the service (under which it will be stored and reffered as)
    + an empty service entry (like in the case of the `NotifyNodeService` service). In this case hash entry key is used as the service name, and `${componentName}.{${serviceConfig.name} || serviceId}` as path
  + The code responsible for loading services is locate in the file: `src/frontend/app/components/collaboPlugins/pluginsPreloader.ts` under functions `_retrieveServicesForPluginsFromConfig()`
+ `plugins`
  + The code responsible for loading plugins is locate in the file: `src/frontend/app/components/collaboPlugins/pluginsPreloader.ts:_retrieveServicesForPluginsFromConfig()`
+ `path` (string): this parameter is only available in the case of external puzzles and it tells where the external puzzle resides (relatively to the  `<cf_frontend_folder>` folder)
  + **NOTE**: Most likely we will introduce special prefixes paths (like `npm:knalledge_core` meaning that the puzzle is in the `knalledge_core` folder inside the npm floder `node_modules`)

## Creating a new external PUZZLE

We will create an IBIS (Issue Based Information System) in a separate folder `src/frontend/dev_puzzles/ibis`.

**NOTE**: `dev_puzzles` is a folder that contains separately developed puzzles.

It is always a good practice to create a `README.md` file for each puzzle.

### Registering

First we need to tell the Colabo ecosystem that our puzzle exists and is active. 

Inside the main Colabo config file `src/frontend/js/config/config.plugins.js` add the following registration entrance inside the `puzzles` property:

```js
  ibis: {
    active: true,
    // relative to the project root
    path: 'dev_puzzles/ibis'  
```

This tells about our new puzzle, that it is active and where it is located.



### Config

The config file `config.js` contains all info about the puzzle, how it is integrated inside the system, which resources it needs, etc.

```js
var puzzles = {
  name: 'ibis',
  COMPASS: {
    PATHS: {
      '.': {
        destDir: '.',
        cssDir: 'css'
      }
    }
  },

  puzzlesBuild: {
    ibis: {
      path: '.',
      css: true,
      injectJs: 'js/services.js',
      injectCss: 'css/default.css'
    }
  },

  puzzles: {
    ibis: {
      active: true,
      services: { // list of services that are available in this puzzle
        CfPuzzlesIbisService: { // service name
          isTS: true, // is written in TS
          isNG2: true, // is written as NG2
          isAvailableInNG1: true, // should it be available in NG1 world?
          isGlobal: true, // should we add it at the top level as addProvider in app2
          module: 'ibisServices', // NG1 module the service is inserted in
          path: 'cf.puzzles.ibis.service' // unique id/path that is addressing the service
        }
      },
      plugins: { // list of plugins that are available in this puzzle
        mapVisualizePlugins: ['CfPuzzlesIbisService']
      }
    }
  }
}
```

+ `COMPASS` section tells where are the sass files that should be compiled into css. The structure is similar to internal components configuration section and can be found under the [***Compass configuration***](#Compass configuration)  section above.

+ `puzzlesBuild` section is equal to the internal components configuration section and can be found under the [***puzzlesBuild configuration***](#puzzlesBuild configuration)  section above.

+ `puzzles` section is **similar** to the internal components configuration section and can be found under the [***puzzles configuration***](#puzzles configuration)  section above. The main **difference** is in the `services` subsection which has more elaborative parameters for each service:

  + `isTS` (Boolean): is the service written in TS
  + `isNG2` (Boolean): is the service written as NG2+ (and not as NG1 service)
  + `isAvailableInNG1` (Boolean): should it be available in NG1 world? If `true` and it is NG2+ service it will be **downgraded** and injected in the NG1 space
  + `isGlobal` (Boolean): should we add it as top level providers, adding them at the top level component (in our case the `app/components/knalledgeMap/main.ts` component) as providers (`moduleProviders` is the external list where they will be added) :

  ```js
  @NgModule({
      imports: moduleImports,
      providers: moduleProviders,
      exports: componentExportDirectives,
      declarations: componentDirectives,
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  ```

  + `module` (String): a NG1 module name where the service will be inserted in

  **NOTE**: If we recall the only reason why there are not so many elaborative parameters for the internal puzzles is because they were introduced earlier  during the NG1-only era and after the NG2 era started, all development is developed through external puzzles anyway. We will reconsider the reason for having internal puzzles and should we extend their capabilities as well

### Service

Now we need to provide a service that will support business logic.


# Visualization plugins as services/providers

Map Visualization plugins

Passive plugins (filters) that get knalledge data and transform it adds new

## procedure with example of request
We want to create a Halo plugin (which is placed in knalledge.mapVisualization) for Request. In this way we will be able to add a specific request icon in halo arround a selected node.

### Create request service

```js
import {Injectable
} from 'angular2/core';

/**
* the namespace for the Request service
* @namespace request.RequestService
*/

@Injectable()
export class RequestService {

    /**
     * Service constructor
     * @constructor
     */
    constructor() {
    }

    init() {
    }
}
```

In app2.ts add code for registering the service:

```js
// ...
import {RequestService} from '../components/request/request.interaction.service';
// ...

// injecting NG1 TS service into NG1 space
var requestServices = angular.module('requestServices');
requestServices
    .service('RequestService', RequestService)
    ;

// ...
// upgrading ng1 services into ng2 space
upgradeAdapter.upgradeNg1Provider('RequestService');
```


### Adding plugin in config.plugins.js

```js
"request": {
    active: true,
    services: {
        requestService: {
            name: 'RequestService',
            path: 'request.RequestService'
        }
    },
    plugins: {
        mapVisualizeHaloPlugins: ['requestService'],
        keboardPlugins: ['requestService']
    }
},
```

Here we declared module request that is active and has `requestService` service. It implements two plugins `mapVisualizeHaloPlugins` and `keboardPlugins` both with the `requestService` service.

__NOTE__: If service name is omitted the service id (`requestService` in this case will be used). If service path is omitted it will be constructed from module name concatenated with service name (or service id), in our case it would be `request.requestService`.

### Injecting services

KnalledgeMap directive will load all services that are needed for the relevant plugins:

```js
// references to loaded services
var componentServiceRefs = {};
// plugins that we care for inside the directive
var pluginsOfInterest = {
    mapVisualizePlugins: true,
    mapVisualizeHaloPlugins: true,
    mapInteractionPlugins: true,
    keboardPlugins: true
};

loadPluginsServices(Config.Plugins, componentServiceRefs, pluginsOfInterest, $injector, injector);
```

Finally, it will load and inject plugins into `mapPlugins` :

```js
/**
 * Plugins that are provided to the knalledge.Map
 * @type {Object}
 */
var mapPlugins = {
};

// injecting plugins
for(var pluginName in pluginsOfInterest){
    injectPlugins(pluginName);
}
```

And provide it to all relevant subcomponents, like knalledge.Map:

```js
knalledgeMap = new knalledge.Map(
    // ...
    mapPlugins,
    // ...
);
```

### Using Halo plugin

### Implementing halo interaction

Inside the `knalledge.MapVisualization` the halo is twice interacted with. First time, we initialize the halo in `MapVisualization.prototype._initHalo`. Here we provide a set of available actions and how halo should behave.

Second time in `MapVisualization.prototype.nodeFocus` we create halo with specific icons; which icons are available, where they are placed, and what action should be called when the icon is clicked.


## example

### Notofy
+ app/components/notify
+ NotifyNodeService (app/components/notify/js/services.js)

# TopiChat plugins

Real time communication plugins

# Example with IBIS

+ Currently in the components/knalledgeMap
+ directive:
    + app/components/knalledgeMap/directives.js:ibisTypesList
+ service:
    + app/components/knalledgeMap/services.js:IbisTypesService
+ templates
    + app/components/knalledgeMap/partials/ibisTypes-list.tpl.html
+ integrated in
    + app/components/knalledgeMap/partials/knalledgeMap-tools.tpl.html
+ style:
    + app/components/knalledgeMap/sass/default.scss
    + app/components/knalledgeMap/sass/graph.scss
+ references
    + app/js/knalledge/kEdge.js
        + KEdge.TYPE_KNOWLEDGE = "type_knowledge";
    + app/js/knalledge/kNode.js
        + KNode.TYPE_IBIS_QUESTION = "type_ibis_question";
+ visualization
    + MapVisualizationFlat.prototype.updateHtmlTransitions

```js
nodeHtmlUpdate.select(".node_type")
    .style("display", function(d){
        return (d.kNode && d.kNode.type) ? "block" : "none";
    })
    .html(function(d){
        var label = "";
        if(d.kNode && d.kNode.type){
            var type = d.kNode.type;
            switch(type){
                case "type_ibis_question":
                    type = "ibis:QUESTION";
                    break;
                case "type_ibis_idea":
                    type = "ibis:IDEA";
                    break;
                // ...
            }
            label = "%" + type;
        }
        return label;
    });
```

# Example with Voting (part of IBIS)

+ Currently in the components/knalledgeMap
+ directive:
    + app/components/knalledgeMap/directives.js:ibisTypesList
+ service:
    + app/components/knalledgeMap/services.js:IbisTypesService
+ templates
    + no
+ style:
    + app/components/knalledgeMap/sass/default.scss
    + app/components/knalledgeMap/sass/graph.scss

Added to each node inside the: `app/js/knalledge/mapVisualizationTree.js:updateHtml`

```js
nodeHtmlEnter
    .append("div")
        .attr("class", "vote_up");

nodeHtmlEnter
    .append("div")
        .attr("class", "vote_down");
```
Decorated with (same file):

```js
nodeHtmlUpdate.select(".vote_up")
    .style("opacity", function(d){
        return (d.kNode.dataContent && d.kNode.dataContent.ibis && d.kNode.dataContent.ibis.voteUp) ?
            1.0 : 0.1;
    })
    .html(function(d){
        // if(!('dataContent' in d.kNode) || !d.kNode.dataContent) d.kNode.dataContent = {};
        // if(!('ibis' in d.kNode.dataContent) || !d.kNode.dataContent.ibis) d.kNode.dataContent.ibis = {};
        // if(!('voteUp' in d.kNode.dataContent.ibis)) d.kNode.dataContent.ibis.voteUp = 1;
        return (d.kNode.dataContent && d.kNode.dataContent.ibis && d.kNode.dataContent.ibis.voteUp) ?
            d.kNode.dataContent.ibis.voteUp : "&nbsp";
    });

nodeHtmlUpdate.select(".vote_down")
    .style("opacity", function(d){
        return (d.kNode.dataContent && d.kNode.dataContent.ibis && d.kNode.dataContent.ibis.voteDown) ?
            1.0 : 0.1;
    })
    .html(function(d){
        return (d.kNode.dataContent && d.kNode.dataContent.ibis && d.kNode.dataContent.ibis.voteDown) ?
            d.kNode.dataContent.ibis.voteDown : "&nbsp";
    });
```

Keyboard interaction (app/js/interaction/keyboard.js:updateHtmlTransitions):

```js
// IBIS
// Vote up
KeyboardJS.on("ctrl + command + up", function(){
    if(this.editingNodeHtml) return;
    if(this.getStatus() !== Keyboard.STATUS_MAP) return;
    var node = this.clientApi.getSelectedNode();
    if(!('dataContent' in node.kNode) || !node.kNode.dataContent) node.kNode.dataContent = {};
    if(!('ibis' in node.kNode.dataContent) || !node.kNode.dataContent.ibis) node.kNode.dataContent.ibis = {};
    if(!('voteUp' in node.kNode.dataContent.ibis)) node.kNode.dataContent.ibis.voteUp = 1;
    else node.kNode.dataContent.ibis.voteUp += 1;
    this.clientApi.updateNode(node, knalledge.MapStructure.UPDATE_NODE_IBIS_VOTING);
    this.clientApi.update(this.clientApi.getSelectedNode());
}.bind(this), function(){}.bind(this));

// Vote up
KeyboardJS.on("ctrl + command + down", function(){
    if(this.editingNodeHtml) return;
    if(this.getStatus() !== Keyboard.STATUS_MAP) return;
    var node = this.clientApi.getSelectedNode();
    if(!('dataContent' in node.kNode) || !node.kNode.dataContent) node.kNode.dataContent = {};
    if(!('ibis' in node.kNode.dataContent) || !node.kNode.dataContent.ibis) node.kNode.dataContent.ibis = {};
    if(!('voteDown' in node.kNode.dataContent.ibis)) node.kNode.dataContent.ibis.voteDown = 1;
    else node.kNode.dataContent.ibis.voteDown += 1;
    this.clientApi.updateNode(node, knalledge.MapStructure.UPDATE_NODE_IBIS_VOTING);
    this.clientApi.update(this.clientApi.getSelectedNode());
}.bind(this), function(){}.bind(this));
```

# Example with RIMA

+ in the components/rima
+ directive:
    +
+ service:
    +
+ templates
    +
+ integrated in
    + app/components/knalledgeMap/partials/knalledgeMap-tools.tpl.html
    + app/components/knalledgeMap/partials/index.tpl.html
    + src/frontend/app/components/knalledgeMap/partials/knalledgeMap-list.tpl.html
    + ...
+ style:
    + components
    + app/components/knalledgeMap/sass/default.scss
+ references
    + app/js/knalledge/kEdge.js
        + 	this.iAmId = 0;	//id of object creator (whoAmi/RIMA user)
    + app/js/knalledge/kNode.js
        + 	this.iAmId = 0;	//id of object creator (whoAmi/RIMA user)
    + app/components/knalledgeMap/js/directives.js
    + app/components/knalledgeMap/js/services.js
    + src/frontend/app/components/login/js/directives.js
    + src/frontend/app/components/notify/js/services.js
    + src/frontend/app/js/app.js
    + src/frontend/app/js/knalledge/mapVisualizationTree.js
    + src/frontend/app/js/knalledge/mapVisualizationGraph.js
    + src/frontend/app/js/lib/wizard/ngWizard.js
    + src/frontend/app/js/knalledge/map.js
    + src/frontend/app/js/knalledge/mapManager.js
    + src/frontend/app/js/knalledge/mapStructure.js
    + src/frontend/app/js/knalledge/mapVisualization.js
    + src/frontend/app/js/knalledge/mapVisualizationFlat.js
+ visualization
    + MapVisualizationFlat.prototype.updateHtmlTransitions

```js
nodeHtmlEnter
    .append("div")
        .attr("class", "rima_user");
```

```js
nodeHtmlUpdate.select(".rima_user")
    .style("display", function(d){
        return that.rimaService.getUserById(d.kNode.iAmId) ? "block" : "none"; //TODO: unefective!! double finding users
    })
    .html(function(d){
        var user = that.rimaService.getUserById(d.kNode.iAmId);
        var label = "";
        if(user){
            label = "@" + user.displayName;
        }
        return label;
    });

```

# Support for puzzlebility of view components

+ added collaboPlugins/pluginsPreloader.ts that loads all necessary components BEFORE the main app is bootstrapped
+ main app is bootstrapped AFTER all components are loaded with pluginsPreloader
+ each view component that has plugged-in view components do not load them explicitlely but gets them from pluginsPreloader and adds them to the list of children directives (@Component(directives))
+ however currently we didn't manage to tell SystemJS to load view component files and inject them in build, so we are explicltelly enlisting all of them in src/frontend/app/js/pluginDependencies.ts that is loaded by app2.ts and it is unique for each project

## IMPORTANT

**IMPORTANT**: If you adding new plugins, you need to add them to the `tools/config.ts` in order to build them in the app_bundle.js file, otherwise, development environment will work but production will NOT! (Ask @mprinc more about that.) To achieve that we need to do:

**TODO**: At the moment we need to add plugin dependencies in the `src/frontend/app/js/pluginDependencies.ts` file. For example:

```js
import {TopPanel} from '../components/topPanel/topPanel';
```

## Adding a new puzzle-hosting view component that can hold pluggable sub components

Let puzzle-hosting view component be the `src/frontend/app/components/bottomPanel/bottomPanel.ts` component.

We need to create a place holder for it in `src/frontend/app/js/config/config.plugins.js`

```js
var plugins = {
	"ViewComponents": {
		"bottomPanel.BottomPanel": {
			components: {
			}
		},
        // ...
    },
    // ...
};
```

Inside the components filed we will later add all componets that can exist inside of the puzzle-hosting view component.

## Adding a new pluggable sub components inside the puzzle-hosting view component

Let's have a `src/frontend/app/components/bottomPanel/bottomPanel.ts` component as a pluggable sub components inside the `src/frontend/app/components/bottomPanel/bottomPanel.ts` puzzle-hosting view component.

### Let the puzzle-hosting view component know about new pluggable sub components

We need to add to description of pluggable sub components in `ViewComponents[bottomPanel.BottomPanel].components` container:

```sh
// ...
"bottomPanel.BottomPanel": {
    components: {
        'brainstorming.BrainstormingPanelComponent': {
            active: true,
            path: "/components/brainstorming/brainstorming-panel.component"
        }
    }
},
// ...
```

### Let the system know (and preload) the puzzle-hosting view component

Inside the `src/frontend/app/components/collaboPlugins/pluginsPreloader.ts` add the puzzle-hosting view component:

```js
import {BrainstormingPanelComponent} from '../components/brainstorming/brainstorming-panel.component';

// ...

components['/components/brainstorming/brainstorming-panel.component'] = BrainstormingPanelComponent;
```

This will help CF system to (pre)load the component and make it available for the puzzle-hosting view component.

The component is accessible through `import {PluginsPreloader} from 'src/frontend/app/components/collaboPlugins/pluginsPreloader.ts';

### Implementing the puzzle-hosting view component

Following our example, create the file `src/frontend/app/components/bottomPanel/bottomPanel.ts`

It should look something like:

```sh

```

`: PluginsPreloader.components.GardeningControls


### CSS

Add sass folder with scss file(s), in our case we add `bottomPanel.scss`.

Add config for compiling with compass to `src/frontend/app/js/config/config.plugins.js`:

```js
COMPASS: {
// ...
  PATHS: {
  // ...
    'components/bottomPanel': { destDir: APP_SRC, cssDir: 'css' },
  }
}
```

Add config for injecting necessary JS and CSS files to the CF system into`src/frontend/app/js/config/config.plugins.js`:

```js
puzzlesBuild: {
  // ...
  bottomPanel: {
    path: [APP_SRC_STR, 'components/bottomPanel'],
    injectJs: [],
    injectCss: 'css/bottomPanel.css'
  },
  // ...
}
```

So far we do not have any JS file to inject, since all business logic is writen in TypeScript and it will be automatically included/loaded within the  run-time/building process.

### Adding a new pluggable sub components

We are creating pluggable sub components in a regular way, there is no need to do it in any special way.

In our example, pluggable sub components will be: `src/frontend/app/components/brainstorming/partials/brainstorming-panel.component.tpl.html`.

***NOTE:*** Surely, if we want to interact with other parts of the CF system, since we are puzzle, we have to be **careful**! For example if we are injecting some **service**, we have to load it contidionally if the service is not guaranteed to exist. Similarly, if we need to access some **parts of the system**, like KnAllEdge map, etc, we need to register our reqirements through `CollaboPluginService` and access them in that way, after access is provided and granted.

## Adding a new pluggable sub components inside the puzzle-hosting view component

Our puzzle-hosting view component is `src/frontend/app/components/bottomPanel/bottomPanel.ts`

Here we present the minimal component that dynamically loads pluggable sub components that might or might not exist:


```js
import {Component, ViewEncapsulation} from '@angular/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material';

/**
 * Directive that ...
 * Selector: `bottom-panel`
 * @class bottomPanel
 * @memberof CF
 * @constructor
*/

var componentDirectives = [
  MATERIAL_DIRECTIVES
];

declare var Config: any; // src/frontend/app/js/config/config.plugins.js
import {PluginsPreloader} from '../collaboPlugins/pluginsPreloader';

// get the config for ourselves
var puzzleHostingConfig = Config.Plugins.ViewComponents['bottomPanel.BottomPanel'];
var pluggableSubComponentsConfig = puzzleHostingConfig.components;
var pluggableSubComponentName = 'brainstorming.BrainstormingPanelComponent';

if (pluggableSubComponentsConfig[pluggableSubComponentName].active) {
    console.warn("[KnalledgeMapTools] Loading pluggableSubComponent: ", pluggableSubComponentName);
    // get reference to the pluggable sub component class
    var pluggableSubComponent = PluginsPreloader.components[pluggableSubComponentName];
    if(pluggableSubComponent){
      // add to other directives that puzzle-hosting view component will contain
      componentDirectives.push(pluggableSubComponent);
    }else{
      console.error("[BottomPanel] Error loading pluggableSubComponent: ", pluggableSubComponentName);
    }
} else {
    console.warn("[KnalledgeMapTools] Not loading pluggableSubComponent: ", pluggableSubComponentName);
}

@Component({
    selector: 'bottom-panel',
    encapsulation: ViewEncapsulation.None,
    providers: [
    ],
    // directives are not explicitly provided but dynamically built and provided
    directives: componentDirectives,
    moduleId: module.id, // necessary for having relative paths for templateUrl
    templateUrl: 'partials/bottom_panel.tpl.html'
})
export class BottomPanel {
    constructor(
    ) {
    };
}
```

The most important thing here is that we are avoiding explicit importing of pluggable sub component! In other words we avoided:

```js
import {BrainstormingPanelComponent} from '../components/brainstorming/brainstorming-panel.component';
```

If we have this, and if the brainstorming puzzle is not added to our CF system instance, building process would crash.

**NOTE**: Sure, this construct we DO have in `src/frontend/app/js/pluginDependencies.ts`, but first of all, that is localized and easier and cleaner to remove, and that is only because our problem of finding descriptive to tell SystemJS to preload non explicitly required TypeScript files.

Even more generic way of loading all pluggable sub components is implemented in final version of our puzzle-hosting view component:

```js
// go through all pluggable sub components
for(var pluggableSubComponentName in pluggableSubComponentsConfig){
  if (pluggableSubComponentsConfig[pluggableSubComponentName].active) {
      console.warn("[BottomPanel] Loading pluggableSubComponent: ", pluggableSubComponentName);
      // get reference to the pluggable sub component class
      var pluggableSubComponent = PluginsPreloader.components[pluggableSubComponentName];
      if(pluggableSubComponent){
        // add to other directives that puzzle-hosting view component will contain
        componentDirectives.push(pluggableSubComponent);
      }else{
        console.error("[BottomPanel] Error loading pluggableSubComponent: ", pluggableSubComponentName);
      }
  } else {
      console.warn("[BottomPanel] Not loading pluggableSubComponent: ", pluggableSubComponentName);
  }
}
```

# Example with RIMA

+ in the components/ontov
+ directive:
    + ontovSearch
+ service:
    + ontovServices
+ templates
    + src/frontend/app/components/ontov/partials/ontov-search.tpl.html
+ integrated in
    + src/frontend/app/components/knalledgeMap/partials/index.tpl.html
+ style:
    + components/ontov
+ references
    + src/frontend/app/js/app.js
+ visualization
    +

# Findings

## Dynamic injection in modules

source: `src/frontend/app/js/app.js`

```js
var requiresList = [
	  'ngRoute'
      , 'ngSanitize' // necessary for outputing HTML in angular directive
      // ...
];

requiresList.push('rimaServices');
// requiresList.push(...);
// ...

angular.module('KnAllEdgeApp', requiresList)

```

## Dynamic injection in directives

```js
angular.module('knalledgeMapDirectives', ['Config'])
	.directive('knalledgeMap', ['$injector',
    function($injector){

        var RimaService = $injector.get('RimaService');
    }])
```

# Example of Gardening > Approval

1. Create new component `gardening`
2. create services module in `gardening/js/services.js`
3. create ApprovalNodeService TS service
4. add it to app2.ts

```js
import {ApprovalNodeService} from '../components/gardening/approval.node.service';

// ...

var gardeningServices = angular.module('gardeningServices');
gardeningServices
    .service('ApprovalNodeService', ApprovalNodeService)
    ;

    // ...

upgradeAdapter.upgradeNg1Provider('ApprovalNodeService');
```

3. add gardeningServices to app.js - this is temoprarly necessary, later will be retrieved from config.plugins
```js
requiresList.push('gardeningServices');
```
2. add it to config.plugins.js and register mapVisualizePlugins plugin as implemented through ApprovalNodeService service
  + **NOTE**: Doing this properly, requires our service to be known in the NG1 world
    + make js/services.js file
    + app.js
      + requiresList.push('gardeningServices');
```js
gardening: {
  // ...
  injectJs: 'js/services.js',
}

```
4. add

```js
{ src: join(APP_DEST, 'components/gardening/js/services.js'), inject: true, noNorm: true},
```

```js
{ src: join(APP_SRC, 'components/gardening/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
```

```js
'components/gardening': {destDir: APP_SRC, cssDir: 'css'},
```

to config.ts

## TODO
