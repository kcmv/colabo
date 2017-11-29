/**
* the namespace for the knalledgeMap part of the KnAllEdge system
* @namespace knalledge.knalledgeMap
*/

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var Plugins = window.Config.Plugins;

Plugins.puzzles.knalledgeMap.config.services = {
	QUEUE :
	//false
	true
};

Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeCreatedEventName = "node-created";
Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName = "node-updated";
Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName = "node-deleted";
Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodesDeletedEventName = "nodes-deleted";

Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeCreatedEventName = "edge-created";
Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName = "edge-updated";
Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeDeletedEventName = "edge-deleted";
Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgesDeletedEventName = "edges-deleted";

Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeSelectedEventName = "node-selected";

Plugins.puzzles.knalledgeMap.config.services.structuralChangeEventName = "structuralChangeEvent";

Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected = function(ENV, jsonStr){
	if(jsonStr === null){return null;}
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

/**
* the namespace for core services for the KnAllEdge system
* @namespace knalledge.knalledgeMap.knalledgeMapServices
*/
var knalledgeMapServices = angular.module('knalledgeMapServices', ['ngResource', 'Config', 'collaboPluginsServices', 'changeServices']);

}()); // end of 'use strict';
