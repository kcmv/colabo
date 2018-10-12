/**
* the namespace for the knalledgeMap part of the KnAllEdge system
* @namespace knalledge.knalledgeMap
*/

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var Plugins = window.Config.Plugins;

var knalledgeMapServices = angular.module('knalledgeMapServices');


/**
* @class SyncingService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/

knalledgeMapServices.factory('SyncingService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', 'KnalledgeMapVOsService',
	function($resource, $q, ENV, KnalledgeMapQueue, KnalledgeMapVOsService){
	console.log("[knalledgeMapServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/syncing/:type/:searchParam/:searchParam2.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[SyncingServices] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = knalledge.KMap.MapFactory(serverResponse.data[0]);
				data.state = knalledge.KMap.STATE_SYNCED;
				return data;
				*/
				return serverResponse ? serverResponse.data : null;//TODO: data[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		queryPlain: {method:'GET', params:{type:'', searchParam:'', searchParam2:''}, isArray:true,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[SyncingService] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = serverResponse.data;
				var VOs = [];
				for(var datumId in serverResponse.data){
					var VO = knalledge.KMap.nodeFactory(data[datumId]);
					VO.state = knalledge.KMap.STATE_SYNCED;
					VOs.push(VO);
				}
				//console.log("[SyncingService] data: %s", JSON.stringify(data));
				return VOs;
				*/
				return serverResponse ? serverResponse.data : null;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/,
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-SyncingService::createPlain] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
				var data = serverResponse ? serverResponse.data : null;
				console.log("ng-[SyncingService::createPlain] data: %s", JSON.stringify(data));
				return data;
			}else{
				//console.log("ENV.server.parseResponse = false");
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		updatePlain: {method:'PUT', params:{type:'one', searchParam:''},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[SyncingService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
					var data = serverResponse ? serverResponse.data : null;
					return data;
				}else{
					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		},

		destroyPlain: {method:'DELETE', params:{type:'one'},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[SyncingService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
					var data = serverResponse ? serverResponse.data : null;
					return data;
				}else{
					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		}
	});

	resource.RESOURCE_TYPE = 'Syncing';
	resource.lastChange = new Date(0);

	resource.getChangesFromServer = function(callback){
		console.log("getChangesFromServer");

		if(KnalledgeMapVOsService.getLastVOUpdateTime() > this.lastChange){
			this.lastChange = KnalledgeMapVOsService.getLastVOUpdateTime();
		}

		var updates = this.getPlain({type:'in_map_after', searchParam: KnalledgeMapVOsService.map._id, searchParam2:this.lastChange.getTime()}, function(changesFromServer){
			this.lastChange = changesFromServer.last_change = new Date(changesFromServer.last_change);
			var id=0;
			var newChanges = false;
			for(id=0; id<changesFromServer.nodes.length; id++){
				newChanges = true;

				var changesKNode = changesFromServer.nodes[id];
				var kNode = KnalledgeMapVOsService.getNodeById(changesKNode._id);
				if(!kNode){ //create
					kNode = knalledge.KNode.nodeFactory(changesKNode);
					KnalledgeMapVOsService.nodesById[kNode._id] = kNode;
				}else{ //update
					// TODO: is this ok?
					kNode.fill(changesKNode);
				}
				// we need to replace with our own version of the kNode, so upper levels (like vkNode) stays in the sync
				changesFromServer.nodes[id] = kNode;

				// TODO: why this, and is it for both creating and updating
				kNode.state = knalledge.KNode.STATE_SYNCED;

				if(kNode.updatedAt.getTime() <= this.lastChange.getTime()){
					console.error("received node with same or earlier date '%d' as this.lastChange (%d)", kNode.updatedAt.getTime(), this.lastChange.getTime());
					//console.log("node date '%s' vs this.lastChange (%s)", kNode.updatedAt, this.lastChange);
				}
				// else{
				// 	console.warn("received node date '%s' vs this.lastChange (%s)", kNode.updatedAt.getTime(), this.lastChange.getTime());
				// }
			}

			for(id=0; id<changesFromServer.edges.length; id++){
				newChanges = true;

				var changesKEdge = changesFromServer.edges[id];
				var kEdge = KnalledgeMapVOsService.getEdgeById(changesKEdge._id);
				if(!kEdge){
					kEdge = knalledge.KEdge.edgeFactory(changesKEdge);
					KnalledgeMapVOsService.nodesById[kEdge._id] = kEdge;
				}else{
					// TODO: is this ok?
					kEdge.fill(changesKEdge);
				}

				// TODO: why this, and is it for both creating and updating
				kEdge.state = knalledge.KEdge.STATE_SYNCED;
				// we need to replace with our own version of the kEdge, so upper levels (like vkEdge) stays in the sync
				changesFromServer.edges[id] = kEdge;
			}

			if(callback && newChanges){
				callback(changesFromServer);
			}
		}.bind(this));
		return updates;
	};

	return resource;
}]);

}()); // end of 'use strict';
