# Plugins

KnAllEdge is aiming with to fulfill the following paradigm:

<div style='border: 1px solid gray; padding: 5px; margin: 5%'>

[__<span style='color: #550000'>Kn</span><span style='color: #bb0000'>All</span><span style='color: #8888ff; font-style: italic;'>Edge</span></span>__ system](http://www.knalledge.org) is a general knowledge layer, that can serve as a separate knowledge mapping service, but it also serves as an underlying layer for the  [__<span style='color: gray; font-style: italic;'>Collabo</span><span
 style='color: black'>Science</span>__ ecosystem](http://www.collaboscience.com).

</div>

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
                case "type_ibis_argument":
                    type = "ibis:ARGUMENT";
                    break;
                case "type_ibis_comment":
                    type = "ibis:COMMENT";
                    break;
                case "type_knowledge":
                    type = "kn:KnAllEdge";
                    break;

                case "model_component":
                    type = "csdms:COMPONENT";
                    break;
                case "object":
                    type = "csdms:OBJECT";
                    break;
                case "variable":
                    type = "csdms:VARIABLE";
                    break;
                case "assumption":
                    type = "csdms:ASSUMPTION";
                    break;
                case "grid_desc":
                    type = "csdms:GRID DESC";
                    break;
                case "grid":
                    type = "csdms:GRID";
                    break;
                case "process":
                    type = "csdms:PROCESS";
                    break;
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

## Dynaimc injection in directives

```js
angular.module('knalledgeMapDirectives', ['Config'])
	.directive('knalledgeMap', ['$injector',
    function($injector){

        var RimaService = $injector.get('RimaService');
    }])
```
