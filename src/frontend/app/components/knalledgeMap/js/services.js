/**
* the namespace for the knalledgeMap part of the KnAllEdge system
* @namespace knalledge.knalledgeMap
*/

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var QUEUE =
//false;
true;

var KnRealTimeNodeCreatedEventName = "node-created";
var KnRealTimeNodeUpdatedEventName = "node-updated";
var KnRealTimeNodeDeletedEventName = "node-deleted";
var KnRealTimeNodesDeletedEventName = "nodes-deleted";

var KnRealTimeEdgeCreatedEventName = "edge-created";
var KnRealTimeEdgeUpdatedEventName = "edge-updated";
var KnRealTimeEdgeDeletedEventName = "edge-deleted";
var KnRealTimeEdgesDeletedEventName = "edges-deleted";

var KnRealTimeNodeSelectedEventName = "node-selected";

var structuralChangeEventName = "structuralChangeEvent";

var removeJsonProtected = function(ENV, jsonStr){
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
var knalledgeMapServices = angular.module('knalledgeMapServices', ['ngResource', 'Config', 'collaboPluginsServices']);

/**
* @class KnalledgeMapQueue
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnalledgeMapQueue', {
	//KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', '$window',*/ function(/*$q, $rootScope, $window*/) {
		// var that = this;
		var provider = {
			queue: [],
			//OLD: not used any more linkToServices: {}, //KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});
			STATE_ADDED:"STATE_ADDED",
			STATE_BLOCKED:"STATE_BLOCKED",
			STATE_SENT:"STATE_SENT",
			STATE_EXECUTED:"STATE_EXECUTED",
			SERVICE_METHOD_EXECUTE:"EXECUTE",
			SERVICE_METHOD_CHECK:"CHECK",
			SERVICE_METHOD_CREATE:"create",
			SERVICE_METHOD_UPDATE:"update",
			req_no:0,
			//TODO: create timeout calling flush()?

			execute: function(request){
				request.state = this.STATE_ADDED;
				request.no = this.req_no++;
				this.queue.push(request);
				this.flush();
			},

			flush: function(){
				for(var i in this.queue){
					var request = this.queue[i];
					if((request.state != this.STATE_SENT && request.state != this.STATE_EXECUTED) && request.processing[this.SERVICE_METHOD_CHECK](request) && this.check(request,i)){
						request.state = this.STATE_SENT;
						request.processing[this.SERVICE_METHOD_EXECUTE](request);
					}
				}
			},

			check: function(request,index){
				/* update cannot be sent if it is updating resource (VO) that is still not created  */
				if(request.method == this.SERVICE_METHOD_UPDATE){
					if(request.data.state == knalledge.KEdge.STATE_LOCAL){ //TODO: we check for KEdge.STATE_LOCAL even though it might be KNode. but they have same values so it is fine
						return false;
					}
				}
//				for(var i = 0; i<index;i++){ //goes through all previous requests
//					var prev_request = this.quest[i];
//					if(prev_request.id && prev_request.)
//				}
				return true;
			},

			executed:function(request){
				for(var i in this.queue){
					var requestT = this.queue[i];
					if(requestT.no == request.no){ //TODO: should (could) be simplified to if(requestT == request)
						request.state = this.STATE_EXECUTED;
						//TODO: FOR TESTING BLOCKING UPDATES BEFORE CREATES: request.data.state = knalledge.KEdge.STATE_LOCAL;
						//NOT NEEDED: DONE IN CONSTRUCTOR. request.data.state = knalledge.KEdge.STATE_SYNCED; //TODO: we check for KEdge.STATE_LOCAL even though it might be KNode. but they have same values so it is fine;
						this.queue.splice(i, 1);
						break;
					}
				}
				this.flush(); //trying to execute some other request being dependent on executed request
			}


//			link: function(resource, methods){
//				this.linkToServices[resource] = methods
//
//			}

//			updateNode: function(node) {
//				KnalledgeNodeService.update(node); //updating on server service
//			}
		};
		window.queueTest = provider.queue; //TODO:REMOVE
		return provider;
	}]
});

/**
* @class KnalledgeNodeService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/

knalledgeMapServices.factory('KnalledgeNodeService', ['$injector', '$resource', '$q', 'Plugins', 'ENV', 'KnalledgeMapQueue',
function($injector, $resource, $q, Plugins, ENV, KnalledgeMapQueue){
	try{
		var KnAllEdgeRealTimeService = Plugins.knalledgeMap.config.knAllEdgeRealTimeService.available ?
			$injector.get('KnAllEdgeRealTimeService') : null;
	}catch(err){
		console.warn("Error while trying to retrieve the KnAllEdgeRealTimeService service:", err);
	}

	console.log("[knalledgeMapServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/knodes/:type/:actionType/:searchParam/:searchParam2.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
				// console.log("[knalledgeMapServices] accessId: %s", serverResponse.accessId);
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = knalledge.KNode.nodeFactory(serverResponse.data[0]);
				data.state = knalledge.KNode.STATE_SYNCED;
				return data;
				*/
				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		queryPlain: {method:'GET', params:{type:'', searchParam:''}, isArray:true,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
				// console.log("[KnalledgeNodeService] accessId: %s", serverResponse.accessId);
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = serverResponse.data;
				var VOs = [];
				for(var datumId in serverResponse.data){
					var VO = knalledge.KNode.nodeFactory(data[datumId]);
					VO.state = knalledge.KNode.STATE_SYNCED;
					VOs.push(VO);
				}
				//console.log("[KnalledgeNodeService] data: %s", JSON.stringify(data));
				return VOs;
				*/
				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/,
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-KnalledgeNodeService::createPlain] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("ng-[KnalledgeNodeService::createPlain] data: %s", JSON.stringify(data));
				return data;
			}else{
				//console.log("ENV.server.parseResponse = false");
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		updatePlain: {method:'PUT', params:{type:'one', actionType:knalledge.KNode.UPDATE_TYPE_ALL, searchParam:''},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					if(serverResponse != null){
						//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
						console.log("[KnalledgeNodeService:create] accessId: %s", serverResponse.accessId);
						var data = serverResponse.data;
						return data;
					} else {
						return null;
					}
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		},

		destroyPlain: {method:'DELETE', params:{type:'one'},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeNodeService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		}
	});

	resource.RESOURCE_TYPE = 'KNode';

	resource.query = function(){
		var data = {
			$promise: null,
			$resolved: false
		};

		data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
			var jsonUrl = ENV.server.backend + "/sample-small.json";
			$.getJSON(jsonUrl, null, function(jsonContent){
				console.log("Loaded: %s, map (nodes: %d, edges: %d)", jsonUrl,
				jsonContent.map.nodes.length, jsonContent.map.edges.length);
				for(var id in jsonContent){
					data[id] = jsonContent[id];
				}
				data.$resolved = true;
				resolve(data);
			});
		// reject('Greeting ' + name + ' is not allowed.');
		});
		return data;
	};

	resource.getById = function(id, callback)
	{
		var node = this.getPlain({actionType:'default', searchParam:id, type:'one' }, callback);
		return node;
	};

	resource.queryInMap = function(id, callback)
	{
		var nodes = this.queryPlain({ actionType:'default', searchParam:id, type:'in_map' }, function(nodesFromServer){
			for(var id=0; id<nodesFromServer.length; id++){
				var kNode = knalledge.KNode.nodeFactory(nodesFromServer[id]);
				kNode.state = knalledge.KNode.STATE_SYNCED;
				nodesFromServer[id] = kNode;
			}

			if(callback) callback(nodesFromServer);
		});
		// for(var i in nodes){
		// 	//TODO fix nodes.state, etc
		// }
		return nodes;
	};

	resource.getInMapNodesOfType = function(mapId, kNodeType, callback){
		var nodes = this.queryPlain({ actionType:'default', searchParam:mapId, type:'in_map', searchParam2:kNodeType  }, function(nodesFromServer){
			for(var id=0; id<nodesFromServer.length; id++){
				var kNode = knalledge.KNode.nodeFactory(nodesFromServer[id]);
				kNode.state = knalledge.KNode.STATE_SYNCED;
				nodesFromServer[id] = kNode;
			}

			if(callback) callback(nodesFromServer);
		});
		// for(var i in nodes){
		// 	//TODO fix nodes.state, etc
		// }
		return nodes;
	};

	resource.create = function(kNode, callback)
	{
		console.log("resource.create");

		if(QUEUE){
			kNode.$promise = null;
			kNode.$resolved = false;

			kNode.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
		}
		else{
			var kNodeForServer = kNode.toServerCopy();
			//we return kNode:kNode, because 'node' is of type 'Resource'
			var node = this.createPlain({
				//actionType:'default'
				}, kNodeForServer, function(nodeFromServer){
				kNode.$resolved = node.$resolved;
				kNode.overrideFromServer(nodeFromServer);
				if(callback) callback(kNode);
			});

			//createPlain manages promises for its returning value, in our case 'node', so we need to  set its promise to the value we return
			kNode.$promise = node.$promise;
			kNode.$resolved = node.$resolved;

			if(node.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				kNode.overrideFromServer(node);
			}
		}
		//we return this value to caller as a dirty one, and then set its value to nodeFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
		return kNode;
	};

	resource.update = function(kNode, actionType, patch, callback)
	{

		console.log("resource.update");
		if(kNode.state == knalledge.KNode.STATE_LOCAL){//TODO: fix it by going throgh queue
			window.alert("Please, wait while entity is being saved, before updating it:\n"+kNode.name);
			return null;
		}
		var id = kNode._id;
		var kNodeForServer = patch ? patch : kNode.toServerCopy();
		if(QUEUE && false){
			KnalledgeMapQueue.execute({data: kNode, patch: patch, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"}); //TODO: support 'patch' in Queue
			//updatePlain: {method:'PUT', params:{type:'one', actionType:knalledge.KNode.UPDATE_TYPE_ALL, searchParam:''},
			return this.updatePlain({searchParam:id, type:'one', actionType:actionType}, kNodeForServer, function(nodeFromServer){
				// realtime distribution
				if(KnAllEdgeRealTimeService){

					// var change = new change.Change();
					// change.value = nodeFromServer;
					// change.valueBeforeChange = nodeFromServer;
					// change.reference = nodeFromServer._id;
					// change.type = puzzles.changes.ChangeType.STRUCTURAL;
					// change.action = actionType;
					// change.domain = puzzles.changes.Domain.NODE;
					// //TODO:
					// // change.mapId = null;
					// // change.iAmId = null;
					// change.visibility = ChangeVisibility.ALL;
					// change.phase = ChangePhase.UNDISPLAYED;

					var emitObject = {
						id: nodeFromServer._id,
						actionType: actionType,
						data: nodeFromServer,
						actionTime: nodeFromServer.updatedAt
					}
					KnAllEdgeRealTimeService.emit(KnRealTimeNodeUpdatedEventName, emitObject);
					// var change = new
					// GlobalEmitterServicesArray.get(structuralChangeEventName).broadcast('KnalledgeMapVOsService', {'change_typ':changes,'event':eventName});
				}
				if(callback){callback(nodeFromServer);}
			});

		}
		else{
			return this.updatePlain({searchParam:id, type:'one', actionType:actionType}, kNodeForServer,
				function(nodeFromServer){
					// realtime distribution
					if(KnAllEdgeRealTimeService){
						var change = new puzzles.changes.Change();
						change.value = kNodeForServer;
						change.valueBeforeChange = null; //TODO
						change.reference = nodeFromServer._id;
						change.type = puzzles.changes.ChangeType.STRUCTURAL;
						change.event = KnRealTimeNodeUpdatedEventName;
						change.action = actionType;
						change.domain = puzzles.changes.Domain.NODE;
						change.visibility = puzzles.changes.ChangeVisibility.ALL;
						change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;

						// var emitObject = {
						// 	id: nodeFromServer._id,
						// 	actionType: actionType,
						// 	data: nodeFromServer,
						// 	actionTime: nodeFromServer.updatedAt
						// }
						KnAllEdgeRealTimeService.emit(KnRealTimeNodeUpdatedEventName, change);
					}
					if(callback){callback(nodeFromServer);}
				}
			);
		}
	};

	resource.destroy = function(id, callback)
	{
		var result = this.destroyPlain({actionType:'default', searchParam:id, type:'one'},
			function(){ //TODO: add error check
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				var change = new puzzles.changes.Change();
				change.value = null;
				change.valueBeforeChange = null; //TODO
				change.reference = id;
				change.type = puzzles.changes.ChangeType.STRUCTURAL;
				change.event = KnRealTimeNodeDeletedEventName;
				// change.action = null;
				change.domain = puzzles.changes.Domain.NODE;
				change.visibility = puzzles.changes.ChangeVisibility.ALL;
				change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;

				KnAllEdgeRealTimeService.emit(KnRealTimeNodeDeletedEventName, change);//{'_id':id});
			}
			if(callback){callback()};
		});
		return result;
	};

	resource.destroyByModificationSource = function(mapId, modificationSource, callback)
	{
		var result = this.destroyPlain({actionType:'default', searchParam:mapId, type:'by-modification-source'}, function(){
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				KnAllEdgeRealTimeService.emit(KnRealTimeNodesDeletedEventName, {mapId: mapId});
			}
			if(callback){callback()};
		});
		return result;
	};

	resource.execute = function(request){ //example:: request = {data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}};
		// var kNode;
		switch(request.method){
		case 'create':
			//window.alert('create skipped ;)'); break;
			var kNodeForServer = request.data.toServerCopy();
			var kNodeReturn = request.data;
			var callback = request.callback;

			var node = resource.createPlain({
				//actionType:'default'
				}, kNodeForServer, function(nodeFromServer){
				kNodeReturn.$resolved = node.$resolved;
				kNodeReturn.overrideFromServer(nodeFromServer);
				request.processing.RESOLVE(kNodeReturn);//kNodeReturn.resolve()
				if(callback) callback(kNodeReturn);
				KnalledgeMapQueue.executed(request);

				// realtime distribution
				if(KnAllEdgeRealTimeService){
					var change = new puzzles.changes.Change();
					change.value = kNodeReturn.toServerCopy();
					change.valueBeforeChange = null; //TODO
					change.reference = kNodeReturn._id;
					change.type = puzzles.changes.ChangeType.STRUCTURAL;
					change.event = KnRealTimeNodeCreatedEventName;
					// change.action = null;
					change.domain = puzzles.changes.Domain.NODE;
					change.visibility = puzzles.changes.ChangeVisibility.ALL;
					change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;

					KnAllEdgeRealTimeService.emit(KnRealTimeNodeCreatedEventName, change); //kNodeReturn.toServerCopy());
					// if(KnalledgeMapPolicyService.provider.config.broadcasting.enabled){
					// 		KnAllEdgeRealTimeService.emit(KnRealTimeNodeSelectedEventName, kNodeReturn._id);
					// }
				}
			});

			//createPlain manages promises for its returning value, in our case 'node', so we need to  set its promise to the value we return
			kNodeReturn.$promise = node.$promise;
			kNodeReturn.$resolved = node.$resolved;

			if(node.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				kNodeReturn.overrideFromServer(node);
			}
			break;
		case 'update':
			//this.update;
			break;
		}
	};

	/* checks if request can be sent to server */
	resource.check = function(request){
		return true;
	};

	//KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});

	return resource;

}]);

/**
* @class KnalledgeEdgeService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/

knalledgeMapServices.factory('KnalledgeEdgeService', ['$injector', '$resource', '$q', 'Plugins', 'ENV', 'KnalledgeMapQueue', function($injector, $resource, $q, Plugins, ENV, KnalledgeMapQueue){
	try{
		var KnAllEdgeRealTimeService = Plugins.knalledgeMap.config.knAllEdgeRealTimeService.available ?
			$injector.get('KnAllEdgeRealTimeService') : null;
	}catch(err){
		console.warn("Error while trying to retrieve the KnAllEdgeRealTimeService service:", err);
	}
	console.log("[atGsServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/kedges/:type/:searchParam.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
				// console.log("[knalledgeMapServices] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				return data[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		queryPlain: {method:'GET', params:{type:'', searchParam:''}, isArray:true,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
				// console.log("[KnalledgeEdgeService] accessId: %s", serverResponse.accessId);
//				var data = serverResponse.data;
//				var VOs = [];
//				for(var datumId in serverResponse.data){
//					var VO = knalledge.KEdge.edgeFactory(data[datumId]);
//					VOs.push(VO);
//				}
//				//console.log("[KnalledgeNodeService] data: %s", JSON.stringify(data));
//				return VOs;

				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/,
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[KnalledgeEdgeService::create] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("[KnalledgeEdgeService::create] data: %s", JSON.stringify(data));
				return data;
			}else{
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		updatePlain: {method:'PUT', params:{type:'one', searchParam:''},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeEdgeService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		},

		destroyPlain: {method:'DELETE', params:{type:'one'},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeEdgeService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		}
	});

	resource.RESOURCE_TYPE = 'KEdge';

	resource.getById = function(id, callback)
	{
		return this.getPlain({ searchParam:id, type:'one' }, callback);
	};

	resource.queryInMap = function(id, callback)
	{
		var edges = this.queryPlain({ searchParam:id, type:'in_map' }, function(edgesFromServer){
			for(var id=0; id<edgesFromServer.length; id++){
				var kEdge = knalledge.KEdge.edgeFactory(edgesFromServer[id]);
				kEdge.state = knalledge.KEdge.STATE_SYNCED;
				edgesFromServer[id] = kEdge;
			}

			if(callback) callback(edgesFromServer);
		});

		return edges;
	};

	resource.queryBetween = function(id, callback)
	{
		return this.queryPlain({ searchParam:id, type:'between' }, callback);
	};

	resource.queryConnected = function(id, callback)
	{
		return this.queryPlain({ searchParam:id, type:'connected' }, callback);
	};

	resource.create = function(kEdge, callback)
	{
		console.log("Edge-resource.create");

		if(QUEUE){
			kEdge.$promise = null;
			kEdge.$resolved = false;

			kEdge.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: kEdge, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
		}
		else{
			var kEdgeForServer = kEdge.toServerCopy();

			//we return kEdge:KEdge, because 'edge' is of type 'Resource'
			var edge = this.createPlain({}, kEdgeForServer, function(edgeFromServer){
				kEdge.$resolved = edge.$resolved;
				kEdge.overrideFromServer(edgeFromServer);
				if(callback) callback(kEdge);
			});

			//createPlain manages promises for its returning value, in our case 'edge', so we need to  set its promise to the value we return
			kEdge.$promise = edge.$promise;
			kEdge.$resolved = edge.$resolved;

			if(edge.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				kEdge.overrideFromServer(edge);
			}
		}
		//we return this value to caller as a dirty one, and then set its value to nodeFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
		return kEdge;
	};

	resource.update = function(kEdge, updateType, callback)
	{
		//console.log('update edge: ' + this.getNodeById(kEdge.sourceId).name + ' -> ' + this.getNodeById(kEdge.targetId));
		if(kEdge.state == knalledge.KEdge.STATE_LOCAL){//TODO: fix it by going throgh queue
			window.alert("Please, wait while entity is being saved, before updating it:\n"+kEdge.name);
			return null;
		}

		var id = kEdge._id;
		var kEdgeForServer = kEdge.toServerCopy();
		if(QUEUE && false){
			// KnalledgeMapQueue.execute({data: kEdge, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"});
			// return this.updatePlain({searchParam:id, type:'one'}, kEdgeForServer, function(edgeFromServer){
			// 	// realtime distribution
			// 	if(KnAllEdgeRealTimeService){
			// 		var change = new puzzles.changes.Change();
			// 		change.value = kEdgeForServer;
			// 		change.valueBeforeChange = null; //TODO
			// 		change.reference = edgeFromServer._id;
			// 		change.type = puzzles.changes.ChangeType.STRUCTURAL;
			// 		change.event = KnRealTimeEdgeUpdatedEventName;
			// 		change.action = null; //TODO: to add Edge actionType-s
			// 		change.domain = puzzles.changes.Domain.EDGE;
			// 		change.visibility = puzzles.changes.ChangeVisibility.ALL;
			// 		change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;
			//
			// 		KnAllEdgeRealTimeService.emit(KnRealTimeEdgeUpdatedEventName, change); //edgeFromServer);
			// 	}
			// 	callback(true);
			// });

		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, kEdgeForServer, function(edgeFromServer){
				// realtime distribution
				if(KnAllEdgeRealTimeService){
					var change = new puzzles.changes.Change();
					change.value = kEdgeForServer;
					change.valueBeforeChange = null; //TODO
					change.reference = edgeFromServer._id;
					change.type = puzzles.changes.ChangeType.STRUCTURAL;
					change.event = KnRealTimeEdgeUpdatedEventName;
					change.action = null; //TODO: to add Edge actionType-s
					change.domain = puzzles.changes.Domain.EDGE;
					change.visibility = puzzles.changes.ChangeVisibility.ALL;
					change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;

					KnAllEdgeRealTimeService.emit(KnRealTimeEdgeUpdatedEventName, change); //edgeFromServer);
				}
				callback(true);
			});
		}
	};

	resource.destroy = function(id, callback)
	{
		var result = this.destroyPlain({searchParam:id, type:'one'}, function(){
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				KnAllEdgeRealTimeService.emit(KnRealTimeEdgeDeletedEventName, {'_id':id});
			}
			if(callback){callback()};
		});
		return result;
	};

	resource.destroyByModificationSource = function(mapId, modificationSource, callback)
	{
		var result = this.destroyPlain({searchParam:mapId, type:'by-modification-source'}, function(){
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				KnAllEdgeRealTimeService.emit(KnRealTimeEdgesDeletedEventName, {mapId: mapId});
			}
			if(callback){callback()};
		});
		return result;
	};

	resource.deleteConnectedTo = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'connected'}, callback);
	};

	resource.execute = function(request){ //example:: {data: kEdge, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}};
		switch(request.method){
		case 'create':
			var kEdgeForServer = request.data.toServerCopy();
			var kEdgeReturn = request.data;
			var callback = request.callback;

			var edge = resource.createPlain({}, kEdgeForServer, function(edgeFromServer){
				kEdgeReturn.$resolved = edge.$resolved;
				kEdgeReturn.overrideFromServer(edgeFromServer);
				request.processing.RESOLVE(kEdgeReturn);//kEdgeReturn.resolve()
				if(callback) callback(kEdgeReturn);
				KnalledgeMapQueue.executed(request);

				if(KnAllEdgeRealTimeService){
						KnAllEdgeRealTimeService.emit(KnRealTimeEdgeCreatedEventName, kEdgeReturn.toServerCopy());
				}
			});

			//createPlain manages promises for its returning value, in our case 'edge', so we need to  set its promise to the value we return
			kEdgeReturn.$promise = edge.$promise;
			kEdgeReturn.$resolved = edge.$resolved;

			if(edge.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				kEdgeReturn.overrideFromServer(edge);
			}
			break;
		case 'update':
			//this.update;
			break;
		}
	};

	/**
	 * checking dependency for executing some request in Queue
	 */
	resource.check = function(request)
	{//execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
		console.log("[EdgeService::check]");

		var edge = request.data;
		if(typeof edge.sourceId !== 'string'){//TODO: Fix it through Node states
			return false;
		}
		if(typeof edge.targetId !== 'string'){//workaround edge.targetId <5){
			return false;
		}
		return true;
	};

	return resource;

}]);

/**
Contains the content of the map
@memberof knalledge.knalledgeMap.knalledgeMapServices
@typedef {Object} MapData
@property {Object} properties - map properties
@property {string} properties.rootNodeId - id of the root node of the map
@property {Array.<knalledge.KNode>} nodes - an array of nodes
@property {Array.<knalledge.KEdge>} edges - an array of edges
*/

/**
Contains the changes happened in the currently active map
@memberof knalledge.knalledgeMap.knalledgeMapServices
@typedef {Object} MapChanges
@property {Array.<knalledge.KNode>} nodes - array of changed nodes
@property {Array.<knalledge.KEdge>} nodes - array of changed edges
*/

/**
Contains the changes (together with the event name) happened in the currently active map
@memberof knalledge.knalledgeMap.knalledgeMapServices
@typedef {Object} MapChangesWithEvent
@property {knalledge.knalledgeMap.knalledgeMapServices.MapChanges} changes - array of changed nodes
@property {string} event - an event that happened as an source of the changes.
**NOTE**: This parameter is not present from the beginning but injected at the higher layers
*/

/**
* @class KnalledgeMapVOsService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnalledgeMapVOsService', {
// service config data
$configData: {},

// init service
$init: function(configData){
	this.$configData = configData;
},

// get (instantiate) service
$get: ['$q', '$rootScope', '$window', '$injector', 'Plugins', 'KnalledgeNodeService', 'KnalledgeEdgeService', 'KnalledgeMapService',
'CollaboPluginsService', 'KnalledgeMapViewService', 'KnalledgeMapPolicyService',

/**
* @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
* @constructor
* @param  {config} Plugins
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeNodeService} KnalledgeNodeService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeEdgeService} KnalledgeEdgeService
* @param  {knalledge.knalledgeMap.knalledgeMapServices..KnalledgeMapService}  KnalledgeMapService
* @param  {knalledge.collaboPluginsServices.CollaboPluginsService} CollaboPluginsService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapViewService} KnalledgeMapViewService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapPolicyService} KnalledgeMapPolicyService
*/
function($q, $rootScope, $window, $injector, Plugins, KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapService, CollaboPluginsService, KnalledgeMapViewService, KnalledgeMapPolicyService) {

		// var that = this;
		try{
			// * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
			var KnAllEdgeRealTimeService = Plugins.knalledgeMap.config.knAllEdgeRealTimeService.available ?
				$injector.get('KnAllEdgeRealTimeService') : null;
		}catch(err){
			console.warn(err);
		}
		try{
			// * @param  {rima.rimaServices.RimaService}  RimaService
			var RimaService = Plugins.rima.config.rimaService.available ?
				$injector.get('RimaService') : null;
		}catch(err){
			console.warn(err);
		}
		var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
		var provider = {
			/**
			 * The id of the currently loaded map
			 * @type {string}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			//mapId: "552678e69ad190a642ad461c", // map id
			map: null,
			/**
			 * The id of root node of the currently loaded map
			 * @type {string}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			rootNodeId: "55268521fb9a901e442172f9", // root node id in the map
			/**
			 * The root node of the currently loaded map
			 * @type {knalledge.KNode}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			rootNode: null,
			/**
			 * Hash array of nodes in the currently loaded map
			 * The key in the hash array is the id of the node
			 * @type {Array.<string, knalledge.KNode>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			nodesById: {},
			/**
			 * Hash array of edges in the currently loaded map
			 * The key in the hash array is the id of the edge
			 * @type {Array.<string, knalledge.KEdge>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			edgesById: {},
			/**
			 * Map properties
			 * @type {Object}
			 */
			properties: {},
			// TODO: remove RimaService
			mapStructure: new knalledge.MapStructure(RimaService, KnalledgeMapViewService, KnalledgeMapPolicyService, Plugins),
			// TODO: remove, not used any more?!
			lastVOUpdateTime: null,

			//list of all `actionType`-s that are differential instead over all object
			differentialActions: (function(){
				var obj = {};
				obj[knalledge.KNode.UPDATE_TYPE_VOTE] =1;
				obj[knalledge.KNode.UPDATE_NODE_NAME] =1;
				obj[knalledge.MapStructure.UPDATE_NODE_TYPE] =1;
				obj[knalledge.MapStructure.UPDATE_NODE_CREATOR] =1;

				return obj;
			})(),

			configData: this.$configData,

			serviceId: new Date(),

			/**
				called by KnAllEdgeRealTimeService when a broadcasted message regarding changes in the map (nodes, edges) structure is received from another client

			 * Callback function called from KnAllEdgeRealTimeService
			 * when change broadcated events (like `node-created`, etc)
			 * are broadcasted.
			 *
			 * It wraps changes into a unified structure `changes` that is published
			 * (through the GlobalEmitterServicesArray) to upper interested layers translated into events (like `node-created-to-visual`)
			 * @function externalChangesInMap
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {string} eventName - event name that is sent by other client
			 * @param  {Object} msg

			 * OLD COMMENT?: Chnages that are broadcasted from the presented
			 * OLD COMMENT?: @type {knalledge.knalledgeMap.knalledgeMapServices.MapChanges}
			 */
			externalChangesInMap: function(eventName, msg){
				console.log("externalChangesInMap(%s,%s)",eventName, JSON.stringify(msg));
				if(!KnalledgeMapPolicyService.provider.config.broadcasting.receiveStructural) return; //this could be at KnAllEdgeRealTimeService but it should not differentiate (know about) different types of messages on upper layer (e.g. structural vs navigation)
				var changes = {nodes:[], edges:[]};
				var shouldBroadcast = true;
				var ToVisualMsg = "-to-visual";
				var change = msg; //puzzles.changes.Change

				switch(eventName){
					case KnRealTimeNodeCreatedEventName:
						kNode = knalledge.KNode.nodeFactory(change.value);
						this.nodesById[kNode._id] = kNode;
						kNode.state = knalledge.KNode.STATE_SYNCED;
						var eventName = KnRealTimeNodeCreatedEventName + ToVisualMsg;
						changes.nodes.push({node:kNode,	actionType: null});
					break;
					case KnRealTimeNodeUpdatedEventName:
							// var msg = {
							// 	id: nodeFromServer._id,
							// 	actionType: actionType,
							// 	data: nodeFromServer,
							// 	actionTime: nodeFromServer.updatedAt
							// }
						var kNode = this.nodesById[change.reference];
						if(typeof kNode === 'undefined'){
							console.error("externalChangesInMap:Node update received for a node that we don't have");
							this.nodesById[change.reference] = knalledge.KNode.nodeFactory(change.value);
						}

						//`actionType` is a differential, and under `else` we cover thost that work over all object:
						switch (change.action) {
							case knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING:
								var whatId = change.value.dataContent.rima.whats._id;
								//console.log('whatId: ', whatId);
								var whats = kNode.dataContent.rima.whats;
								for(var i=0; i<whats.length; i++){
									if(whats[i]._id === whatId){
										whats.splice(i, 1);
									}
								}
							break;
							default:
								if(this.differentialActions[change.action]){
									//delete change.data.
									deepAssign(kNode, change.value); //patching
									kNode.updatedAt = Date(msg.updatedAt); //tiempo existe en change.value tambien, pero los ambos son de tipo 'string'
								}
								else{
									kNode.fill(change.value);
								}
						}

						if(change.action === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING || change.action === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING){
							var rimaWhatsChangedEvent = "rimaWhatsChangedEvent";
							GlobalEmitterServicesArray.register(rimaWhatsChangedEvent);
							GlobalEmitterServicesArray.get(rimaWhatsChangedEvent).broadcast('mapService', {node:kNode, actionType:change.action, change:change.value});
						}

						kNode.state = knalledge.KNode.STATE_SYNCED;
						var eventName = KnRealTimeNodeUpdatedEventName + ToVisualMsg;
						//changes.nodes.push(kNode);
						changes.nodes.push({node:kNode,	actionType: change.action});
					break;
					case KnRealTimeNodeDeletedEventName:
						if(this.nodesById.hasOwnProperty(change.reference)){
							var kNode = this.nodesById[change.reference];
							changes.nodes.push({node:kNode,	actionType: null});
							delete this.nodesById[change.reference];
							var eventName = KnRealTimeNodeDeletedEventName + ToVisualMsg;
						}
						else{
							console.error("externalChangesInMap: trying to delete a Node that we don't have");
							shouldBroadcast = false; //TODO: check if this is the right approach
						}
					break;

					case KnRealTimeEdgeCreatedEventName:
						kEdge = knalledge.KEdge.edgeFactory(msg);
						this.edgesById[kEdge._id] = kEdge;
						kEdge.state = knalledge.KEdge.STATE_SYNCED;
						var eventName = KnRealTimeEdgeCreatedEventName + ToVisualMsg;
						changes.edges.push({edge:kEdge,	actionType: null});
					break;
					case KnRealTimeEdgeUpdatedEventName:
						var kEdge = this.edgesById[change.reference];
						if(typeof kEdge === 'undefined'){
							console.error("externalChangesInMap:Edge update received for a edge that we don't have");
							this.edgesById[change.reference] = knalledge.KEdge.edgeFactory(change.value);
						}
						kEdge.fill(change.value);
						kEdge.state = knalledge.KEdge.STATE_SYNCED;
						var eventName = KnRealTimeEdgeUpdatedEventName + ToVisualMsg;
						changes.edges.push({edge:kEdge,	actionType: change.action});
					break;
					case KnRealTimeEdgeDeletedEventName:
						if(this.edgesById.hasOwnProperty(msg._id)){
							var kEdge = this.edgesById[msg._id];
							changes.edges.push({edge:kEdge,	actionType: msg.actionType});
							delete this.edgesById[msg._id];
							var eventName = KnRealTimeEdgeDeletedEventName + ToVisualMsg;
						}
						else{
							console.error("externalChangesInMap: trying to delete an Edge that we don't have");
							shouldBroadcast = false; //TODO: check if this is the right approach
						}
					break;
				}
				if(shouldBroadcast){
					GlobalEmitterServicesArray.register(eventName);
					GlobalEmitterServicesArray.get(eventName).broadcast('KnalledgeMapVOsService', {'changes':changes,'event':eventName});
				}

					// for(id=0; id<changesFromServer.nodes.length; id++){
					// 	newChanges = true;

					// 	var changesKNode = changesFromServer.nodes[id];
					// 	var kNode = KnalledgeMapVOsService.getNodeById(changesKNode._id);
					// 	if(!kNode){ //create
					// 		kNode = knalledge.KNode.nodeFactory(changesKNode);
					// 		KnalledgeMapVOsService.nodesById[kNode._id] = kNode;
					// 	}else{ //update
					// 		// TODO: is this ok?
					// 		kNode.fill(changesKNode);
					// 	}
					// 	// we need to replace with our own version of the kNode, so upper levels (like vkNode) stays in the sync
					// 	changesFromServer.nodes[id] = kNode;

					// 	// TODO: why this, and is it for both creating and updating
					// 	kNode.state = knalledge.KNode.STATE_SYNCED;

					// 	if(kNode.updatedAt.getTime() <= this.lastChange.getTime()){
					// 		console.error("received node with same or earlier date '%d' as this.lastChange (%d)", kNode.updatedAt.getTime(), this.lastChange.getTime());
					// 		//console.log("node date '%s' vs this.lastChange (%s)", kNode.updatedAt, this.lastChange);
					// 	}
					// 	// else{
					// 	// 	console.warn("received node date '%s' vs this.lastChange (%s)", kNode.updatedAt.getTime(), this.lastChange.getTime());
					// 	// }
					// }

					// for(id=0; id<changesFromServer.edges.length; id++){
					// 	newChanges = true;

					// 	var changesKEdge = changesFromServer.edges[id];
					// 	var kEdge = KnalledgeMapVOsService.getEdgeById(changesKEdge._id);
					// 	if(!kEdge){
					// 		kEdge = knalledge.KEdge.edgeFactory(changesKEdge);
					// 		KnalledgeMapVOsService.nodesById[kEdge._id] = kEdge;
					// 	}else{
					// 		// TODO: is this ok?
					// 		kEdge.fill(changesKEdge);
					// 	}

					// 	// TODO: why this, and is it for both creating and updating
					// 	kEdge.state = knalledge.KEdge.STATE_SYNCED;
					// 	// we need to replace with our own version of the kEdge, so upper levels (like vkEdge) stays in the sync
					// 	changesFromServer.edges[id] = kEdge;
					// }
			},

			getNodesList: function(){
				var nodesList = [];
				for(var i in this.nodesById){
					nodesList.push(this.nodesById[i]);
				}
				return nodesList;
			},

			hasChildren: function(d){
				for(var i in this.edgesById){
					if(this.edgesById[i].sourceId == d._id){
						return true;
					}
				}
				return false;
			},

			getEdge: function(sourceId, targetId){
				// that.privateData;
				for(var i in this.edgesById){
					if(this.edgesById[i].sourceId == sourceId && this.edgesById[i].targetId == targetId){
						return this.edgesById[i];
					}
				}
				return null;
			},

			// collapses children of the provided node
			collapse: function(d) {
				d.isOpen = false;
			},

			// toggle children of the provided node
			toggle: function(d) {
				d.isOpen = !d.isOpen;
			},

			getNodeById: function(kId) {
				for(var i in this.nodesById){
					var node = this.nodesById[i];
					if(node._id == kId) {
						return node;
					}
				}
			},

			getEdgeById: function(kId) {
				for(var i in this.edgesById){
					var edge = this.edgesById[i];
					if(edge._id == kId) {
						return edge;
					}
				}
			},

			createNode: function(kNode, kNodeType) {
				if (kNode && kNode.type && typeof kNodeType == 'undefined') kNodeType = kNode.type;

				var nodeCreated = function(nodeFromServer) {
					console.log("[KnalledgeMapVOsService] nodeCreated");// + JSON.stringify(nodeFromServer));
					// var edgeUpdatedNodeRef = function(edgeFromServer){
					// 	console.log("[KnalledgeMapVOsService] edgeUpdatedNodeRef" + JSON.stringify(edgeFromServer));
					// };

					// updating all references to node on fronted with server-created id:
					// var oldId = newNode._id;
					delete this.nodesById[localNodeId];//		this.nodesById.splice(oldId, 1);
					this.nodesById[nodeFromServer._id] = newNode; //TODO: we should set it to 'nodeFromServer'?! But we should synchronize also local changes from 'newNode' happen in meantime
					// newNode._id = nodeFromServer._id; //TODO: same as above
					// newNode.fill(nodeFromServer);

					//fixing edges:: sourceId & targetId:
					for(var i in this.edgesById){
						var changed = false;
						var edge = this.edgesById[i];
						if(edge.sourceId == localNodeId){edge.sourceId = nodeFromServer._id; changed = true;}
						if(edge.targetId == localNodeId){edge.targetId = nodeFromServer._id; changed = true;}
						if(changed){window.edgeNTest = edge;}//TODO:remove this
						//TODO: check should we do here something, after KnalledgeMapQueue logic is used etc:
						/* but so far we are commenting this because we won't update edge. Instead createEdge will be blocked (by promise, until this createNode is finished) in:
						 * 		// Add new node:
						 *		KeyboardJS.on("tab", function(){
						 *  so
						if(changed){
							//TODO: should we clone it or call vanilla object creation:
							KnalledgeEdgeService.update(edge, edgeUpdatedNodeRef.bind(this)); //saving changes in edges's node refs to server
						}
						*/
					}
				};

				console.log("[KnalledgeMapVOsService] createNode");

				// var maxId = -1;
				// for(var i in this.nodesById){
				// 	if(maxId < this.nodesById[i]._id){
				// 		maxId = this.nodesById[i]._id;
				// 	}
				// }

				var newNode = kNode;
				if(typeof newNode === 'undefined' || newNode === null){
					newNode = new knalledge.KNode();
				}
				newNode.iAmId = RimaService ? RimaService.getActiveUserId() :
				Plugins.rima.config.rimaService.ANONYMOUS_USER_ID; //TODO: this is already done in caller (mapStructure), so maybe it should go under upper if. and we could add there another steps done in caller (like decoration)
				if(typeof kNodeType === 'undefined' || kNodeType === null){
					kNodeType = knalledge.KNode.TYPE_KNOWLEDGE; //TODO: check about this
				}

				newNode.type = kNodeType;

				var localNodeId = newNode._id;// = maxId+1;
				if(!('mapId' in newNode) || !newNode.mapId) {newNode.mapId = this.map ? this.map._id : null;} //'575ffc2cfe15024a16d456c6';}

				newNode = KnalledgeNodeService.create(newNode, nodeCreated.bind(this)); //saving on server service.
				this.nodesById[localNodeId] = newNode;
				return newNode;
			},

			updateNode: function(node, actionType, patch, callback) {
				if(patch){ //other way is to check if actionType is in the list of differential ones
					deepAssign(node, patch); //patching
				}
				var that = this;
				return KnalledgeNodeService.update(node, actionType, patch,
					function(nodeFromServer){
						var localNode = that.nodesById[nodeFromServer._id];
						if(patch){//if we had a differential update and not whole one
							if(localNode.updatedAt < nodeFromServer.updatedAt){
								//TODO: warn that ealier update has come after the later one
								localNode.updatedAt = nodeFromServer.updatedAt;
							}
						}else{
							that.nodesById[nodeFromServer._id].overrideFromServer(nodeFromServer);
						}
						if(actionType === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING || actionType === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING){
							var rimaWhatsChangedEvent = "rimaWhatsChangedEvent";
							GlobalEmitterServicesArray.register(rimaWhatsChangedEvent);
							GlobalEmitterServicesArray.get(rimaWhatsChangedEvent).broadcast('mapService', {node:node, actionType:actionType, change:patch});
						}
						if(callback){callback(that.nodesById[nodeFromServer._id]);}
					}); //updating on server service
			},

			getMapId: function(){
				return this.map._id;
			},

			addParticipantToMap(userId, callback){
				this.map.participants.push(userId);
				KnalledgeMapService.update(this.map, function(){
					if(typeof callback === 'function') callback();
				});
			},

			deleteNode: function(node) {
				var result = KnalledgeNodeService.destroy(node._id); //deleteNode on server service
				delete this.nodesById[node._id]; //TODO: see if we should do it only upon server deleting success
				return result;
			},

			/**
			expects already created VOs!
			*/
			createNodeWithEdge: function(sourcekNode, kEdge, targetkNode, edgeType, callback) {
				var createEdgeAndNodesCallback = function(kEdgeFromServer){
					console.log("createEdgeAndNodesCallback");
					if(callback){callback(kEdgeFromServer);}
				};
				//sourcekNode = this.createNode(sourcekNode);
				targetkNode = this.createNode(targetkNode);
				kEdge.sourceId = sourcekNode._id;
				kEdge.targetId = targetkNode._id;
				if(typeof edgeType == 'undefined'){
					edgeType = kEdge.type;
				}
	//		newNode.kNode.$promise.then(function(kNodeFromServer){ // TODO: we should remove this promise when we implement KnalledgeMapQueue that will solve these kind of dependencies
	//			console.log("KeyboardJS.on('tab': in promised fn after createNode");
				kEdge = this.createEdgeBetweenNodes(sourcekNode, targetkNode, kEdge, edgeType, callback);
				kEdge.$promise.then(createEdgeAndNodesCallback);
				return kEdge;
			},

			deleteEdgesConnectedTo: function(node) {
				var result = KnalledgeEdgeService.deleteConnectedTo(node._id); //TODO: handle a case when the edge is not deleted sucessfully
				//delete edgesById (kEdge):
				for(var i in this.edgesById){
					var edge = this.edgesById[i];
					if(edge.sourceId == node._id || edge.targetId == node._id){
						delete this.edgesById[i];
					}
				}
				return result;
			},

			relinkNode: function (relinkingNode, newParent, callback) {
				var parents = this.getParentNodes(relinkingNode);
				var parentId = parents[0]._id; //TODO: by this we are always relinking first parent (when we wil have more parents, this wil need to be resSendJsonProtected)
				var relinkingEdge = this.getEdge(parentId, relinkingNode._id);
				if(relinkingEdge){
					if(relinkingEdge.targetId != newParent._id){
						relinkingEdge.sourceId = newParent._id;
						this.updateEdge(relinkingEdge, "UPDATE_RELINK_EDGE", function(success, error){
							callback(success, error);
						});
					}
					else{
							callback(false,'TARGET_EQ_SOURCE');
					}
				}
				else{
					callback(false,'NO_EDGE');
				}

			},

			createEdge: function(kEdge, callback) {
				var edgeCreated = function(edgeFromServer) {
					console.log("[KnalledgeMapVOsService::createEdge] edgeCreated" + JSON.stringify(edgeFromServer));

					// updating all references to edge on fronted with server-created id:
					// var oldId = newEdge._id;
					delete this.edgesById[localEdgeId];//		this.nodesById.splice(oldId, 1);
					this.edgesById[edgeFromServer._id] = kEdge; //TODO: we should set it to 'edgeFromServer'?! But we should synchronize also local changes from 'newEdge' happen in meantime
					// newEdge._id = edgeFromServer._id; //TODO: same as above
					// newEdge.fill(edgeFromServer);
					if(callback) callback(edgeFromServer);
				};

				if(!('mapId' in kEdge) || !kEdge.mapId) kEdge.mapId = this.map._id;
				window.edgeETest = kEdge;//TODO:remove this
				var localEdgeId = kEdge._id;
				kEdge = KnalledgeEdgeService.create(kEdge, edgeCreated.bind(this));

				this.edgesById[localEdgeId] = kEdge;
				return kEdge;
			},

			createEdgeBetweenNodes: function(sourceNode, targetNode, kEdge, kEdgeType, callback) {
				console.log("[KnalledgeMapVOsService] createEdge");
				// var maxId = -1;
				// for(var i in this.edgesById){
				// 	if(maxId < this.edgesById[i]._id){
				// 		maxId = this.edgesById[i]._id;
				// 	}
				// }


				var newEdge = kEdge;
				if(typeof newEdge === 'undefined' || newEdge === null){
					newEdge = new knalledge.KEdge();
				}
				newEdge.iAmId = RimaService ? RimaService.getActiveUserId() :
				Plugins.rima.config.rimaService.ANONYMOUS_USER_ID;
				if(typeof kEdgeType === 'undefined' || kEdgeType === null){
					kEdgeType = knalledge.KEdge.TYPE_KNOWLEDGE; //TODO: check about this
				}

				newEdge.type = kEdgeType;

				newEdge.sourceId = sourceNode._id;
				newEdge.targetId = targetNode._id;

				newEdge = this.createEdge(newEdge, callback);

				//preparing and saving on server service:
				// var edgeCloned = newEdge.toServerCopy();

				//TODO: check should we do here something, after KnalledgeMapQueue logic is used etc:
				/* this was used when createEdge request is sent to server without waiting for target node to be created.
				 * now must remove it, because by this nodeCreated will find edges connected to it and update their links over localID to new server-created-Id
				 *
				if(sourceNode.state == knalledge.KNode.STATE_LOCAL) //TODO: not working till state is not set for resources retreived from server
				{
					delete edgeCloned.sourceId; // this is still not set to server Id
				}
				if(targetNode.state == knalledge.KNode.STATE_LOCAL)
				{
					delete edgeCloned.targetId; // this is still not set to server Id
				}
				*/

				return newEdge;
			},

			updateEdge: function(kEdge, updateType, callback){
				return KnalledgeEdgeService.update(kEdge, updateType, callback); //updating on server service
			},

			/**
			 * Loads and processes map based on the KMap object
			 * It publishes the `modelLoadedEvent` event after the process is finished
			 * @function loadAndProcessData
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {knalledge.KMap} map - map object
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.MapData}
			 */
			loadAndProcessData: function(kMap, callback){
				var that = this;
				if(typeof kMap !== 'undefined'){
					this.map = kMap;
					this.rootNodeId = kMap.rootNodeId;
					if(KnAllEdgeRealTimeService){
						KnAllEdgeRealTimeService.setSessionId('mapId', this.map._id);
						KnAllEdgeRealTimeService.setMapId(this.map._id);
					}
				}
				/**
				 * Map data
				 * @type  {knalledge.knalledgeMap.knalledgeMapServices.MapData}
				 */
				var result = this.loadData(kMap);
				result.$promise.then(function(results){
					console.log("[KnalledgeMapVOsService::loadData] nodesEdgesReceived");

					//TODO: remove this - used for syncing with changes, done by other users - but now we have migated to  KnAllEdgeRealTimeService
					that.lastVOUpdateTime = new Date(0); //"Beginning of time :) 'Thu Jan 01 1970 01:00:00 GMT+0100 (CET)' "

					var i;
					var nodes = results[0];
					var edges = results[1];
					for(i=0; i<nodes.length; i++){
						result.map.nodes.push(nodes[i]);
						if(nodes[i].updatedAt > that.lastVOUpdateTime){
							that.lastVOUpdateTime = nodes[i].updatedAt;
						}
					}
					for(i=0; i<edges.length; i++){
						result.map.edges.push(edges[i]);
						if(edges[i].updatedAt > that.lastVOUpdateTime){
							that.lastVOUpdateTime = edges[i].updatedAt;
						}
					}

					that.processData(result);

					that.mapStructure.init(that);
					that.mapStructure.processData(result);

					var modelLoadedEventName = "modelLoadedEvent";
					//console.log("result:" + JSON.stringify(result));
					GlobalEmitterServicesArray.register(modelLoadedEventName);
					GlobalEmitterServicesArray.get(modelLoadedEventName).broadcast('KnalledgeMapVOsService', result);

					// Add active user to the map
					// ToDo: this is
					if(RimaService){
						var activeUserId = RimaService.getActiveUserId();
						if(activeUserId &&
							kMap.participants.indexOf(activeUserId) === -1
						){ // add it if not found among participants
							that.addParticipantToMap(activeUserId,callback);
						}else{
							if(typeof callback === 'function') callback();
						}
					}else{
						if(typeof callback === 'function') callback();
					}

					if(that.configData.broadcastMapUsers){
						var whoIamIdsUpdatedEventName = "whoIamIdsUpdatedEvent";
						GlobalEmitterServicesArray.register(whoIamIdsUpdatedEventName);
						GlobalEmitterServicesArray.get(whoIamIdsUpdatedEventName).broadcast('KnalledgeMapVOsService', kMap.participants);
					}
				});
				return result;
			},

			/**
			 * Loads data associated with the map (represented with the KMap object)
			 * @function loadData
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {knalledge.KMap} map - Map data object
			 * @param  {boolean} [setAsDefaultMap] - should it set to internal params (true),
			 * or just load the map (false/undefined)
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.MapData} map - map data
			 */
			loadData: function(map, setAsDefaultMap){
				var that = this;

				if(setAsDefaultMap && typeof map !== 'undefined'){
					this.map = map;
					this.rootNodeId = map.rootNodeId;
				}

				if(typeof map == 'undefined'){
					// create default map
					// TODO: should we remove that, doesn't make too much sense anymore
					var mapObj = {
						name: "TNC (Tesla - The Nature of Creativty) (DR Model)",
						createdAt: "2015.03.22.",
						type: "knalledge",
						dataContent: {
                            mcm: {
                                  authors: "S. Rudan, D. Karabeg"
                           }
                       	},
						_id: this.map._id,
						rootNodeId: this.rootNodeId
					};
					map = new knalledge.KMap();
					map.fill(mapObj);
				}
				console.log('loadData:map'+ JSON.stringify(map));

				var result = {
					"properties": map,
					"map": {
						"nodes": [],
						"edges": []
					}
				};

				// var handleReject = function(fail){
				// 	$window.alert("Error loading knalledgeMap: %s", fail);
				// };

				var nodes = KnalledgeNodeService.queryInMap(map._id);
				var edges = KnalledgeEdgeService.queryInMap(map._id);
				//var rimas = KnalledgeEdgeService.queryInMap(that.mapId);

				var promiseAll = $q.all([nodes.$promise, edges.$promise]);
				promiseAll.then(function(results){
					result.$resolved = true;
				});

				result.$promise = promiseAll;
				result.$resolved = false;
				return result;
			},

			getLastVOUpdateTime: function() {
				return this.lastVOUpdateTime;
			},

			/**
			 * Processes map data and populates internal structure in the service
			 * @function processData
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData} mapData - map data
			 */
			processData: function(mapData) {
				this.properties = mapData.map.properties;
				var i=0;
				var kNode = null;
				var kEdge = null;
				for(i=0; i<mapData.map.nodes.length; i++){
					kNode = mapData.map.nodes[i];
					if(!("isOpen" in kNode)){
						kNode.isOpen = false;
					}
					this.nodesById[kNode._id] = kNode;
				}

				for(i=0; i<mapData.map.edges.length; i++){
					kEdge = mapData.map.edges[i];
					this.edgesById[kEdge._id] = kEdge;
				}

				this.rootNode = this.nodesById[mapData.properties.rootNodeId];
			},

			getChildrenEdgeTypes: function(kNode){
				var children = {};
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.sourceId == kNode._id){
						if(kEdge.type in children){
							children[kEdge.type] += 1;
						}else{
							children[kEdge.type] = 1;
						}
					}
				}
				return children;
			},

			getNodesOfType: function(kNodeType){
				var nodes = [];
				for(var j in this.nodesById){
					var kNode = this.nodesById[j];
					if(kNode.type == kNodeType){
						nodes.push(kNode);
					}
				}
				return nodes;
			},

			getChildrenEdges: function(kNode, edgeType){
				var children = [];
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.sourceId == kNode._id && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
						children.push(kEdge);
					}
				}
				return children;
			},

			getChildrenNodes: function(kNode, edgeType){
				var children = [];
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.sourceId == kNode._id && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
						for(var j in this.nodesById){
							var kNodeChild = this.nodesById[j];
							if(kNodeChild._id == kEdge.targetId){
								children.push(kNodeChild);
							}
						}
					}
				}
				return children;
			},

			getParentNodes: function(kNode, edgeType){
				var parents = [];
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.targetId == kNode._id && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
						for(var j in this.nodesById){
							var kNodeParent = this.nodesById[j];
							if(kNodeParent._id == kEdge.sourceId){
								parents.push(kNodeParent);
							}
						}
					}
				}
				return parents;
			},

			mapDelete: function(mapId, callback){
				var mapDeleted = function(result,result2){
					console.log('[mapDeleted]; result: ', result,', result2: ', result2);
					if(callback){callback(result);}
				}
				KnalledgeMapService.deleteMapAndContent(mapId, mapDeleted)
			},

			mapDuplicate: function(map, mapNewName, callback){
				console.log('duplicateMap');
				var mapDuplicated = function(map,result2){
					map.createdAt = new Date(map.createdAt);
					map.updatedAt = new Date(map.updatedAt);
					console.log('[mapDuplicated]; map: ', map,', result2: ', result2);
					if(callback){callback(map);}
				}
				KnalledgeMapService.duplicate(map._id, mapNewName, mapDuplicated);
			}
		};

		// registering plugin support
		CollaboPluginsService.provideReferences("mapVOsService", {
			name: "mapVOsService",
			items: {
				// nodesById: function(){
				// 	return provider.nodesById;
				// },
				// edgesById: function(){
				// 	return provider.edgesById;
				// }
				nodesById: provider.nodesById,
				edgesById: provider.edgesById
			}
		});
		// this.collaboPluginsService.provideApi("map", {
		// 	name: "map",
		// 	items: {
		// 		/* update(source, callback) */
		// 		update: this.mapVisualization.update.bind(this.mapVisualization)
		// 	}
		// });

		if(KnAllEdgeRealTimeService){
			// realtime listener registration
			var KnalledgeMapVOsServicePluginOptions = {
				name: "KnalledgeMapVOsService",
				events: {
				}
			};
			KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeCreatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeUpdatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeDeletedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[KnRealTimeEdgeCreatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[KnRealTimeEdgeUpdatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[KnRealTimeEdgeDeletedEventName] = provider.externalChangesInMap.bind(provider);
			KnAllEdgeRealTimeService.registerPlugin(KnalledgeMapVOsServicePluginOptions);

			// TODO: just for debugging
			window.nodesById = provider.nodesById;//TODO:remove
			window.edgesById = provider.edgesById;//TODO:remove
			return provider;

			// mapLayoutPluginOptions.events[knalledge.MapLayout.KnRealTimeNodeSelectedEventName] = this.realTimeNodeSelected.bind(this);
			// this.knAllEdgeRealTimeService.registerPlugin(mapLayoutPluginOptions)
		}
		return provider;
	}]
});

/**
* The knalledge service for dealing with KMap entities and saving them to the server
* @class KnalledgeMapService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.factory('KnalledgeMapService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue',
/**
* @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapService
* @constructor
* @param  {Ng1Service} KnalledgeMapQueue - service responsible for queuing requests to the server
* @param  {Ng1Constant} ENV              - system environment config
*/
function($resource, $q, ENV, KnalledgeMapQueue){
	console.log("[knalledgeMapServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/kmaps/:type/:searchParam.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[knalledgeMapServices] accessId: %s", serverResponse.accessId);
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = knalledge.KMap.MapFactory(serverResponse.data[0]);
				data.state = knalledge.KMap.STATE_SYNCED;
				return data;
				*/
				return serverResponse.data;//TODO: data[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		queryPlain: {method:'GET', params:{type:'', searchParam:''}, isArray:true,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[KnalledgeMapService] accessId: %s", serverResponse.accessId);
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = serverResponse.data;
				var VOs = [];
				for(var datumId in serverResponse.data){
					var VO = knalledge.KMap.nodeFactory(data[datumId]);
					VO.state = knalledge.KMap.STATE_SYNCED;
					VOs.push(VO);
				}
				//console.log("[KnalledgeMapService] data: %s", JSON.stringify(data));
				return VOs;
				*/
				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/,
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-KnalledgeMapService::createPlain] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("ng-[KnalledgeMapService::createPlain] data: %s", JSON.stringify(data));
				return data;
			}else{
				//console.log("ENV.server.parseResponse = false");
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		updatePlain: {method:'PUT', params:{type:'one', searchParam:''},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeMapService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		},

		destroyPlain: {method:'DELETE', params:{type:'one'},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeMapService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		}
	});

	resource.RESOURCE_TYPE = 'KMap';
	resource.map = null;

	/**
	 * Loads map object (KMap) by id
	 * @param  {string}   id       - map id
	 * @param  {Function} callback - called after map object is loaded
	 * @return {knalledge.KMap}
	 */
	resource.getById = function(id, callback)
	{
		// TODO: we need to fix promise so returned map object will be of the
		// knalledge.KMap type rather than the angular Resource type
		var that = this;
		var map = this.getPlain({ searchParam:id, type:'one' }, function(mapFromServer){
			mapFromServer = knalledge.KMap.mapFactory(mapFromServer);
			mapFromServer.state = knalledge.KMap.STATE_SYNCED;
			//that.map = mapFromServer;
			if(callback) callback(mapFromServer);

			return mapFromServer;
		});

		return map;
	};

	resource.query = function(callback)
	{
		console.log('query');
		var maps = this.queryPlain({type:'all' }, function(mapsFromServer){
			for(var id=0; id<mapsFromServer.length; id++){
				var kMap = knalledge.KMap.mapFactory(mapsFromServer[id]);
				kMap.state = knalledge.KMap.STATE_SYNCED;
				mapsFromServer[id] = kMap;
			}

			if(callback) callback(mapsFromServer);
		});
		// for(var i in maps){
		// 	//TODO fix maps.state, etc
		// }
		return maps;
	};

	resource.queryByType = function(mapType, callback)
	{
		console.log('query');
		var maps = this.queryPlain({type:'by-type', searchParam: mapType}, function(mapsFromServer){
			for(var id=0; id<mapsFromServer.length; id++){
				var kMap = knalledge.KMap.mapFactory(mapsFromServer[id]);
				kMap.state = knalledge.KMap.STATE_SYNCED;
				mapsFromServer[id] = kMap;
			}

			if(callback) callback(mapsFromServer);
		});
		// for(var i in maps){
		// 	//TODO fix maps.state, etc
		// }
		return maps;
	};

	resource.queryByParticipant = function(participantId, callback){
		console.log("[queryByParticipant] participantId:", participantId);
		var maps = this.queryPlain({type:'by-participant', searchParam: participantId}, function(mapsFromServer){
			for(var id=0; id<mapsFromServer.length; id++){
				var kMap = knalledge.KMap.mapFactory(mapsFromServer[id]);
				kMap.state = knalledge.KMap.STATE_SYNCED;
				mapsFromServer[id] = kMap;
			}

			if(callback) callback(mapsFromServer);
		});
		// for(var i in maps){
		// 	//TODO fix maps.state, etc
		// }
		return maps;
	};

	resource.create = function(kMap, callback)
	{
		console.log("resource.create");

		if(QUEUE){
			kMap.$promise = null;
			kMap.$resolved = false;

			kMap.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: kMap, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
		}
		else{
			var kMapForServer = kMap.toServerCopy();
			//we return kMap:kMap, because 'map' is of type 'Resource'
			var map = this.createPlain({}, kMapForServer, function(mapFromServer){
				kMap.$resolved = map.$resolved;
				kMap.overrideFromServer(mapFromServer);
				if(callback) callback(kMap);
			});

			//createPlain manages promises for its returning value, in our case 'map', so we need to  set its promise to the value we return
			kMap.$promise = map.$promise;
			kMap.$resolved = map.$resolved;

			if(map.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				kMap.overrideFromServer(map);
			}
		}
		//we return this value to caller as a dirty one, and then set its value to mapFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
		return kMap;
	};

	resource.update = function(kMap, callback)
	{
		console.log("resource.update");
		if(kMap.state == knalledge.KMap.STATE_LOCAL){//TODO: fix it by going throgh queue
			window.alert("Please, wait while entity is being saved, before updating it:\n"+kMap.name);
			return null;
		}
		var id = kMap._id;
		var kMapForServer = kMap.toServerCopy(); //TODO: move it to transformRequest ?
		if(QUEUE && false){
			KnalledgeMapQueue.execute({data: kMap, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"});
			return this.updatePlain({searchParam:id, type:'one'}, kMapForServer, callback); //TODO: does it return map so we should fix it like in create?
		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, kMapForServer, callback); //TODO: does it return map so we should fix it like in create?
		}
	};

	resource.destroy = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'one'}, callback);
	};

	resource.deleteMapAndContent = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'map-and-content'}, callback);
	};

	resource.duplicate = function(mapId, newName, callback)
	{
		//return this.createPlain({}, {mapId:mapId,newName:newName, type:'duplicate'}, callback);
		return this.updatePlain({type:'duplicate',searchParam:mapId}, {newMapName:newName}, callback);
		//return this.createPlain({searchParam:mapId, searchParam2:newName, type:'duplicate'}, callback);
	};

	resource.execute = function(request){ //example:: request = {data: kMap, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}};
		// var kMap;
		switch(request.method){
		case 'create':
			//window.alert('create skipped ;)'); break;
			var kMapForServer = request.data.toServerCopy();
			var kMapReturn = request.data;
			var callback = request.callback;

			var map = resource.createPlain({}, kMapForServer, function(mapFromServer){
				kMapReturn.$resolved = map.$resolved;
				kMapReturn.overrideFromServer(mapFromServer);
				request.processing.RESOLVE(kMapReturn);//kMapReturn.resolve()
				if(callback) callback(kMapReturn);
				KnalledgeMapQueue.executed(request);
			});

			//createPlain manages promises for its returning value, in our case 'map', so we need to  set its promise to the value we return
			kMapReturn.$promise = map.$promise;
			kMapReturn.$resolved = map.$resolved;

			if(map.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				kMapReturn.overrideFromServer(map);
			}
			break;
		case 'update':
			//this.update;
			break;
		}
	};

	/* checks if request can be sent to server */
	resource.check = function(request){
		return true;
	};

	//KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});

	return resource;
}]);

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
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[SyncingServices] accessId: %s", serverResponse.accessId);
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = knalledge.KMap.MapFactory(serverResponse.data[0]);
				data.state = knalledge.KMap.STATE_SYNCED;
				return data;
				*/
				return serverResponse.data;//TODO: data[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		queryPlain: {method:'GET', params:{type:'', searchParam:'', searchParam2:''}, isArray:true,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[SyncingService] accessId: %s", serverResponse.accessId);
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
				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/,
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-SyncingService::createPlain] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("ng-[SyncingService::createPlain] data: %s", JSON.stringify(data));
				return data;
			}else{
				//console.log("ENV.server.parseResponse = false");
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		updatePlain: {method:'PUT', params:{type:'one', searchParam:''},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[SyncingService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		},

		destroyPlain: {method:'DELETE', params:{type:'one'},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[SyncingService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[SyncingService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		}
	});

	resource.RESOURCE_TYPE = 'Syncing';
	resource.lastChange = new Date(0);

	// resource.getById = function(id, callback)
	// {
	// 	var map = this.getPlain({ searchParam:id, type:'one' }, function(mapFromServer){
	// 		mapFromServer = knalledge.KMap.mapFactory(mapFromServer);
	// 		mapFromServer.state = knalledge.KMap.STATE_SYNCED;
	// 		if(callback) callback(mapFromServer);
	// 	});
	// 	return map;
	// };

	// resource.query = function(callback)
	// {
	// 	console.log('query');
	// 	var maps = this.queryPlain({type:'all' }, function(mapsFromServer){
	// 		for(var id=0; id<mapsFromServer.length; id++){
	// 			var kMap = knalledge.KMap.mapFactory(mapsFromServer[id]);
	// 			kMap.state = knalledge.KMap.STATE_SYNCED;
	// 			mapsFromServer[id] = kMap;
	// 		}

	// 		if(callback) callback(mapsFromServer);
	// 	});
	// 	// for(var i in maps){
	// 	// 	//TODO fix maps.state, etc
	// 	// }
	// 	return maps;
	// };

	// resource.queryByType = function(mapType, callback)
	// {
	// 	console.log('query');
	// 	var maps = this.queryPlain({type:'by-type', searchParam: mapType}, function(mapsFromServer){
	// 		for(var id=0; id<mapsFromServer.length; id++){
	// 			var kMap = knalledge.KMap.mapFactory(mapsFromServer[id]);
	// 			kMap.state = knalledge.KMap.STATE_SYNCED;
	// 			mapsFromServer[id] = kMap;
	// 		}

	// 		if(callback) callback(mapsFromServer);
	// 	});
	// 	// for(var i in maps){
	// 	// 	//TODO fix maps.state, etc
	// 	// }
	// 	return maps;
	// };

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

	// /* checks if request can be sent to server */
	// resource.check = function(request){
	// 	return true;
	// };

	//KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});

	// resource.init = function(){
	// 	console.log("Syncing::init");

	// };

	//init();

	return resource;
}]);

/*
Migrated into separate TypeScript service class: KnalledgeMapViewService
*/

/*
Migrated into separate TypeScript service class: KnalledgeMapPolicyService
 */

 /**
 * @class IbisTypesService
 * @memberof knalledge.knalledgeMap.knalledgeMapServices
 */

knalledgeMapServices.provider('IbisTypesService', {
	// privateData: "privatno",
	$get: [/*'$q', 'ENV', '$rootScope', */
	function(/*$q , ENV, $rootScope*/) {
		var items = [
			// {
			// 	_id: 0,
			// 	name: "Unknown",
			// 	user: "unknown"
			// },
			{
				_id: 1,
				name: "knowledge",
				type: "type_knowledge"
			},
			{
				_id: 2,
				name: "question",
				type: "type_ibis_question"
			},
			{
				_id: 3,
				name: "idea",
				type: "type_ibis_idea"
			},
			{
				_id: 4,
				name: "argument",
				type: "type_ibis_argument"
			},
			{
				_id: 5,
				name: "comment",
				type: "type_ibis_comment"
			}
		];

		var selectedItem = (items && items.length) ? items[0] : null;

		// var that = this;
		return {
			getTypes: function(){
				return items;
			},

			getTypeById: function(id){
				var item = null;
				for(var i in items){
					if(items[i]._id == id){
						item = items[i];
					}
				}
				return item;
			},

			selectActiveType: function(item){
				selectedItem = item;
			},

			getActiveType: function(){
				return selectedItem;
			},

			getActiveTypeId: function(){
				return selectedItem ? selectedItem._id : undefined;
			},

			getActiveTypeName: function(){
				return selectedItem ? selectedItem.name : undefined;
			},

			getMaxUserNum: function(){
				var gridMaxNum = 0;
				var items = this.items();
				for(var i in items){
					var grid = items[i];
					var gridId = parseInt(grid.name.substring(2));
					if(gridId > gridMaxNum){
						gridMaxNum = gridId;
					}
				}
				return gridMaxNum;
			},

			getUsersByName: function(nameSubStr){
				var returnedGrids = [];
				var items = this.items();
				for(var i in items){
					var grid = items[i];
					if(grid.name.indexOf(nameSubStr) > -1){
						returnedGrids.push(grid);
					}
				}
				return returnedGrids;
			}
		};
	}]
})

/**
* @class KnAllEdgeSelectItemService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnAllEdgeSelectItemService', {
	$get: ['$compile', /*'$q', 'ENV', '$rootScope', */
	function($compile /*$q , ENV, $rootScope*/) {

		// privateData: "privatno",

		var map, $scope, $element;
		var provider = {
			itemsDescs: [],
			itemType: null,

			_init: function(){
			},

			init: function(_map, _$scope, _$element){
				map = _map;
				$scope = _$scope;
				$element = _$element;
			},

			setItemsDescs: function(itemsDescs){
				this.itemsDescs = itemsDescs;
			},

			getItemsDescs: function(){
				return this.itemsDescs;
			},

			getItemsDescsByName: function(nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedItems = [];
				switch(this.itemType){
					case "kNode":
						for(var i in this.itemsDescs){
							var item = this.itemsDescs[i];
							if(item.name.toLowerCase().indexOf(nameSubStr) > -1){
								returnedItems.push(item);
							}
						}
						break;
					case "vkNode":
						for(var i in this.itemsDescs){
							var item = this.itemsDescs[i];
							if(item.kNode.name.toLowerCase().indexOf(nameSubStr) > -1){
								returnedItems.push(item);
							}
						}
						break;
				}
				return returnedItems;
			},

			openSelectItem: function(items, labels, callback, itemType){
				console.log("[KnAllEdgeSelectItemService] selecting Item out of %d items", items.length);
				this.itemsDescs = items;
				this.itemType = (typeof itemType == 'undefined') ? 'kNodes' : itemType;

				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive
				var directiveLink = $compile("<div knalledge_map_select_item labels='labels' class='knalledge_map_select_item'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				// directiveScope.mapEntity = mapEntity;
				directiveScope.labels = labels;
				directiveScope.shouldSubmitOnSelection = true;

				directiveScope.selectingCanceled = function(){
					console.log("[KnAllEdgeSelectItemService:openSelectItem] selectingCanceled");
				}.bind(this);

				directiveScope.selectingSubmited = function(item){
					try {
						console.log("[KnAllEdgeSelectItemService:openSelectItem] Added entity to addingInEntity: %s", JSON.stringify(item));
					}
					catch(err) {
						console.log("[KnAllEdgeSelectItemService:openSelectItem] Added entity to addingInEntity with name: %s", JSON.stringify(item.name));
					}

					if(typeof callback === 'function') callback(item);
				}.bind(this);
			}
		};

		provider._init();

		return provider;
	}]
})


/**
* @class KnAllEdgeRealTimeService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnAllEdgeRealTimeService', {
	$get: ['$injector', 'KnalledgeMapPolicyService', 'DbAuditService', /*'$q', 'ENV', '$rootScope', */

	/**
	* @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
	* @constructor
	 * @param  {topiChat.TopiChatService} TopiChatService - lower level topiChat real-time communication service
	 * @param  {knalledge.knalledgeMap.KnalledgeMapPolicyService} KnalledgeMapPolicyService - Service that configures policy aspects of the KnAllEdge system
	 */

	function($injector, KnalledgeMapPolicyService, DbAuditService /*$q , ENV, $rootScope*/) {

		try{
			var TopiChatService = $injector.get('TopiChatService');
		}catch(err){
			console.warn(err);
		}

		var provider = {
			EVENT_NAME_REQUEST : 'EVENT_NAME_REQUEST',
			EVENT_NAME_PARTICIPANT_REPLICA : 'PARTICIPANT_REPLICA_REQUEST',
			GlobalEmitterServicesArray: null,
			sessionId: null,
			/**
			 * hash array of plugins, where key is the plugin name
			 * @type {Array.<string, Object>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 */
			plugins: {},
			/**
			 * hash array of plugins organized by events, where key is the event name and value is an array of plugins (options) that have registered for the event
			 * @type {Array.<string, Array.<Object>>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 */
			eventsByPlugins: {},

			whoAmI: null,
			mapId: null,
			activeUser: null,

			setSessionId: function(part, value){
				switch(part){
						case 'mapId':
							this.sessionId = 'mapId:'+value;
							break;
				}
			},

			setMapId: function(id){
				this.mapId = id;
			},

			/**
			 * Initializes the service.
			 * It registeres itself with bottom topiChat layer to communicate on
			 * 'kn:realtime' stream/event
			 * @function init
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			init: function(){
				// registering chat plugin

				//this.GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');

				if(TopiChatService){
					var knalledgeRealTimeServicePluginOptions = {
						name: "knalledgeRealTimeService",
						events: {
							'kn:realtime': this._dispatchEvent.bind(this)
						}
					};

					TopiChatService.registerPlugin(knalledgeRealTimeServicePluginOptions);
				}
				return this;
			},

			getClientInfo: function(){
				if(TopiChatService) return TopiChatService.clientInfo;
				else return null;
			},

			/**
				returns true if broadcasting should be allowed for specific event on this client
			*/
			filterBroadcasting: function(direction, eventName){
				var emitStructuralChangesByNonBroadcasters = true;
				var structuralChanges = {'node-created':1,'node-updated':1,'node-deleted':1,'nodes-deleted':1,'edge-created':1,'edge-updated':1,'edge-deleted':1,'edges-deleted':1,};
				if(direction == 'in'){
					switch(eventName){
						//navigationalChanges:
						case "node-selected":
						case "node-unselected":
						case "node-clicked":
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveNavigation;
							break;

						case "view-config-change":
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveVisualization;
							break;

						//structuralChanges:
						case "node-created":
						case "node-updated":
						case "node-deleted":
						case "nodes-deleted":
						case "edge-created":
						case "edge-updated":
						case "edge-deleted":
						case "edges-deleted":
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveStructural;
							break;

						case "map-behaviour-change":
							return KnalledgeMapPolicyService.provider.config.broadcasting.receiveBehaviours;
					}
					return true;
				}
				else{ //direction = 'out'
					switch(eventName){
						case this.EVENT_NAME_REQUEST:
							return KnalledgeMapPolicyService.provider.config.mediation.sendRequest;
						break;
					}
					if(!KnalledgeMapPolicyService.provider.config.broadcasting.enabled){//if broadcasting is disabled
						if(emitStructuralChangesByNonBroadcasters && structuralChanges[eventName] != undefined){ //we want to send structural changes by all participant, not only by broadcasting moderators
							return true;
						}
						else{
							return false;
						}
					}
					return true;
				}
			},

			/**
			 * Emits message from higher layer (plugin) to lower layer (topiChat)
			 * to be sent to other knalledge clients
			 * @function emit
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @param  {string} eventName
			 * @param  {Object} msg - message to be sent
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			emit: function(eventName, msg){
				console.log('[KnAllEdgeRealTimeService:emit] eventName: %s, msg:%s', eventName, JSON.stringify(msg));

				if(msg instanceof puzzles.changes.Change){
					msg.iAmId = this.activeUser ? this.activeUser._id : null;
					msg.sender = this.whoAmI ? this.whoAmI._id : null;
					msg.mapId = this.mapId;
					msg.sessionId = this.sessionId;

					// id->reference
					// actionType -> action
					// data -> value
					// actionTime -> updatedAt

					var knPackage = msg;

					DbAuditService.sendChange(msg);
				}
				else{
					var knPackage = {
						eventName: eventName,
						msg: msg,
						sessionId: this.sessionId,
						sender: this.whoAmI ? this.whoAmI._id : null
					};
				}

				if(this.filterBroadcasting('out',eventName)){
					// socket.emit('tc:chat-message', msg);
					// topiChatSocket.emit('tc:chat-message', msg);
					if(TopiChatService) TopiChatService.emit('kn:realtime', knPackage);
					return this;
				}
			},

			/**
			 * It registers a new plugin
			 * @function registerPlugin
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @param  {Object} pluginOptions - plugin options
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			registerPlugin: function(pluginOptions) {
				var pluginName = pluginOptions.name;
				console.log('[KnAllEdgeRealTimeService:registerPlugin] Registering plugin: %s', pluginName);
				this.plugins[pluginName] = pluginOptions;
				for(var eventName in pluginOptions.events){
					if(!(eventName in this.eventsByPlugins)){
						this.eventsByPlugins[eventName] = [];
					}
					var eventByPlugins = this.eventsByPlugins[eventName];
					eventByPlugins.push(pluginOptions);
				}
				return this;
			},

			setWhoAmI: function(whoAmI){
				this.whoAmI = whoAmI;
				if(TopiChatService && TopiChatService.setWhoAmI){
					TopiChatService.setWhoAmI(whoAmI);
				}
			},

			setActiveUser: function(user){
				this.activeUser = user;
			},

			/**
			 *called by TopiChatService when a broadcasted message is received from another client

			 * This method dispatches to the higher layers (plugins)
			 * a message that was received from the bottom layer (topiChat)
			 * @function _dispatchEvent
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService#
			 * @param  {string} tcEventName - event name that message received at
			 * @param  {Object} knPackage - knalledge realtime package
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService}
			 */
			_dispatchEvent: function(tcEventName, knPackage) {
				console.log('[KnAllEdgeRealTimeService:_dispatchEvent] tcEventName: %s, knPackage:%s', tcEventName, JSON.stringify(knPackage));

				if(knPackage.sessionId === this.sessionId){ //if both are equal null, the message will pass, but those we probably want, because they are then general ones
					var eventName;
					var msg;
					if(knPackage.hasOwnProperty('valueBeforeChange')){ //this means that this is puzzles.changes.Change
						 msg = knPackage;
						 eventName = knPackage.event;
					}else{
						msg = knPackage.msg;
						eventName = knPackage.eventName;
					}


					if(this.filterBroadcasting('in',eventName)){
						var eventByPlugins = this.eventsByPlugins[eventName];
						for(var id in eventByPlugins){
							var pluginOptions = eventByPlugins[id];
							var pluginName = pluginOptions.name;

							console.log('\t dispatching to plugin: %s', pluginName);
							var pluginCallback = pluginOptions.events[eventName];
							pluginCallback(eventName, msg);
						}
					}
				}
				else{
					console.log('received KnAllEdgeRealTimeService message from a different session `' + sessionId + '`, while our session is `' + this.sessionId + '`');
				}
			}
		};

		provider.init();

		return provider;
	}]
})
;


/**
* @class DbAuditService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
/**
* The knalledge service for dealing with KMap entities and saving them to the server
* @class KnalledgeMapService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.factory('DbAuditService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue',
/**
* @memberof knalledge.knalledgeMap.knalledgeMapServices.DbAuditService
* @constructor
* @param  {Ng1Service} KnalledgeMapQueue - service responsible for queuing requests to the server
* @param  {Ng1Constant} ENV              - system environment config
*/
function($resource, $q, ENV, KnalledgeMapQueue){
	console.log("[DbAuditService] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/dbAudits/:type/:searchParam.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[DbAuditService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DbAuditService] accessId: %s", serverResponse.accessId);
				return serverResponse.data;//TODO: data[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		queryPlain: {method:'GET', params:{type:'', searchParam:''}, isArray:true,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[DbAuditService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DbAuditService] accessId: %s", serverResponse.accessId);
				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/,
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[DbAuditService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-DbAuditService::createPlain] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("ng-[DbAuditService::createPlain] data: %s", JSON.stringify(data));
				return data;
			}else{
				//console.log("ENV.server.parseResponse = false");
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},

		updatePlain: {method:'PUT', params:{type:'one', searchParam:''},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[DbAuditService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[DbAuditService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		},

		destroyPlain: {method:'DELETE', params:{type:'one'},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[DbAuditService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[DbAuditService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			}
		}
	});

	resource.RESOURCE_TYPE = 'Change';
	// resource.map = null;

	/**
	 * Loads change object (Change) by id
	 * @param  {string}   id       - change id
	 * @param  {Function} callback - called after change object is loaded
	 * @return {Change}
	 */
	resource.getById = function(id, callback)
	{
		// TODO: we need to fix promise so returned change object will be of the
		// Change type rather than the angular Resource type
		var that = this;
		var change = this.getPlain({ searchParam:id, type:'one' }, function(changeFromServer){
			changeFromServer = change.Change.changeFactory(changeFromServer);
			changeFromServer.state = change.Change.STATE_SYNCED;
			//that.change = changeFromServer;
			if(callback) callback(changeFromServer);

			return changeFromServer;
		});

		return change;
	};

	resource.query = function(callback)
	{
		console.log('query');
		var changes = this.queryPlain({type:'all' }, function(changesFromServer){
			for(var id=0; id<changesFromServer.length; id++){
				var change = change.Change.changeFactory(changesFromServer[id]);
				change.state = change.Change.STATE_SYNCED;
				changesFromServer[id] = change;
			}

			if(callback) callback(changesFromServer);
		});
		// for(var i in changes){
		// 	//TODO fix changes.state, etc
		// }
		return changes;
	};

	resource.queryByType = function(changeType, callback)
	{
		console.log('query');
		var changes = this.queryPlain({type:'by-type', searchParam: changeType}, function(changesFromServer){
			for(var id=0; id<changesFromServer.length; id++){
				var change = change.Change.changeFactory(changesFromServer[id]);
				change.state = change.Change.STATE_SYNCED;
				changesFromServer[id] = change;
			}

			if(callback) callback(changesFromServer);
		});
		// for(var i in changes){
		// 	//TODO fix changes.state, etc
		// }
		return changes;
	};

	resource.queryByParticipant = function(participantId, callback){
		console.log("[queryByParticipant] participantId:", participantId);
		var changes = this.queryPlain({type:'by-participant', searchParam: participantId}, function(changesFromServer){
			for(var id=0; id<changesFromServer.length; id++){
				var change = change.Change.changeFactory(changesFromServer[id]);
				change.state = change.Change.STATE_SYNCED;
				changesFromServer[id] = change;
			}

			if(callback) callback(changesFromServer);
		});
		// for(var i in changes){
		// 	//TODO fix changes.state, etc
		// }
		return changes;
	};

	resource.create = function(change, callback)
	{
		console.log("resource.create");

		if(QUEUE){
			change.$promise = null;
			change.$resolved = false;

			change.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: change, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
		}
		else{
			var changeForServer = change.toServerCopy();
			//we return change:change, because 'change' is of type 'Resource'
			var change = this.createPlain({}, changeForServer, function(changeFromServer){
				change.$resolved = change.$resolved;
				change.overrideFromServer(changeFromServer);
				if(callback) callback(change);
			});

			//createPlain manages promises for its returning value, in our case 'change', so we need to  set its promise to the value we return
			change.$promise = change.$promise;
			change.$resolved = change.$resolved;

			if(change.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				change.overrideFromServer(change);
			}
		}
		//we return this value to caller as a dirty one, and then set its value to changeFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
		return change;
	};

	resource.update = function(change, callback)
	{
		console.log("resource.update");
		if(change.state == change.Change.STATE_LOCAL){//TODO: fix it by going throgh queue
			window.alert("Please, wait while entity is being saved, before updating it:\n"+change.name);
			return null;
		}
		var id = change._id;
		var changeForServer = change.toServerCopy(); //TODO: move it to transformRequest ?
		if(QUEUE && false){
			KnalledgeMapQueue.execute({data: change, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"});
			return this.updatePlain({searchParam:id, type:'one'}, changeForServer, callback); //TODO: does it return change so we should fix it like in create?
		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, changeForServer, callback); //TODO: does it return change so we should fix it like in create?
		}
	};

	resource.destroy = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'one'}, callback);
	};

	resource.execute = function(request){ //example:: request = {data: change, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}};
		// var change;
		switch(request.method){
		case 'create':
			//window.alert('create skipped ;)'); break;
			var changeForServer = request.data.toServerCopy();
			var changeReturn = request.data;
			var callback = request.callback;

			var change = resource.createPlain({}, changeForServer, function(changeFromServer){
				changeReturn.$resolved = change.$resolved;
				changeReturn.overrideFromServer(changeFromServer);
				request.processing.RESOLVE(changeReturn);//changeReturn.resolve()
				if(callback) callback(changeReturn);
				KnalledgeMapQueue.executed(request);
			});

			//createPlain manages promises for its returning value, in our case 'change', so we need to  set its promise to the value we return
			changeReturn.$promise = change.$promise;
			changeReturn.$resolved = change.$resolved;

			if(change.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
				changeReturn.overrideFromServer(change);
			}
			break;
		case 'update':
			//this.update;
			break;
		}
	};

	/* checks if request can be sent to server */
	resource.check = function(request){
		return true;
	};

	resource.sendChange = function(change){
		resource.create(change).$promise.then(function(changeFromServer){
			console.log('changeFromServer: ',changeFromServer);}
		);
	}

	//KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});

	return resource;
}]);


// /** RIGHT NEO INTEGRATED IN `KnAllEdgeRealTimeService`. To see if we want an independent service
// * @class RequestsService
// * @memberof knalledge.knalledgeMap.knalledgeMapServices
// */
// knalledgeMapServices.provider('RequestsService', {
// 	$get: ['KnalledgeMapPolicyService', /*'$q', 'ENV', '$rootScope', */
//
// 	/**
// 	* @memberof knalledge.knalledgeMap.knalledgeMapServices.RequestsService#
// 	* @constructor
// 	 * @param  {topiChat.TopiChatService} TopiChatService - lower level topiChat real-time communication service
// 	 * @param  {knalledge.knalledgeMap.KnalledgeMapPolicyService} KnalledgeMapPolicyService - Service that configures policy aspects of the KnAllEdge system
// 	 */
// 	function(KnalledgeMapPolicyService/*$q , ENV, $rootScope*/) {
//
// 		var provider = {
// 			/**
// 			 * Initializes the service.
// 			 * It registeres itself with bottom topiChat layer to communicate on
// 			 * 'kn:realtime' stream/event
// 			 * @function init
// 			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.RequestsService#
// 			 * @return {knalledge.knalledgeMap.knalledgeMapServices.RequestsService}
// 			 */
// 			init: function(){
// 				// registering chat plugin
// 				return this;
// 			},
//
// 			/**
// 			 * sends requests
// 			 * @function sendRequest
// 			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.RequestsService#
// 			 * @param  {Object} request
// 			 * @return {knalledge.knalledgeMap.knalledgeMapServices.RequestsService}
// 			 */
// 			sendRequest: function(request){
// 				console.log('[RequestsService:emit] eventName: %s, msg:%s', eventName, JSON.stringify(msg));
// 				var knPackage = {
// 					eventName: eventName,
// 					msg: msg
// 				};
// 			},
//
// 			/**
// 			 *called by TopiChatService when a broadcasted message is received from another client
//
// 			 * This method dispatches to the higher layers (plugins)
// 			 * a message that was received from the bottom layer (topiChat)
// 			 * @function _dispatchEvent
// 			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.RequestsService#
// 			 * @param  {string} tcEventName - event name that message received at
// 			 * @param  {Object} knPackage - knalledge realtime package
// 			 * @return {knalledge.knalledgeMap.knalledgeMapServices.RequestsService}
// 			 */
// 			receivedRequest: function(request) {
// 				console.log('[RequestsService:receivedRequest] request', JSON.stringify(request));
//
// 				var msg = knPackage.msg;
// 				var eventName = knPackage.eventName;
// 				if(this.filterBroadcasting('in',eventName)){
// 					var eventByPlugins = this.eventsByPlugins[eventName];
// 					for(var id in eventByPlugins){
// 						var pluginOptions = eventByPlugins[id];
// 						var pluginName = pluginOptions.name;
//
// 						console.log('\t dispatching to plugin: %s', pluginName);
// 						var pluginCallback = pluginOptions.events[eventName];
// 						pluginCallback(eventName, msg);
// 					}
// 				}
// 			}
// 		};
//
// 		provider.init();
//
// 		return provider;
// 	}]
// })
// ;



}()); // end of 'use strict';
