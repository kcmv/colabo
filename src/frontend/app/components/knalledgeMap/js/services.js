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

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var knalledgeMapServices = angular.module('knalledgeMapServices', ['ngResource', 'Config', 'collaboPluginsServices']);

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

knalledgeMapServices.factory('KnalledgeNodeService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', 'KnAllEdgeRealTimeService', function($resource, $q, ENV, KnalledgeMapQueue, KnAllEdgeRealTimeService){
	console.log("[knalledgeMapServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/knodes/:type/:searchParam/:searchParam2.json';
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

		updatePlain: {method:'PUT', params:{type:'one', searchParam:''},
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
		var node = this.getPlain({ searchParam:id, type:'one' }, callback);
		return node;
	};

	resource.queryInMap = function(id, callback)
	{
		var nodes = this.queryPlain({ searchParam:id, type:'in_map' }, function(nodesFromServer){
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
		var nodes = this.queryPlain({ searchParam:mapId, type:'in_map', searchParam2:kNodeType  }, function(nodesFromServer){
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
			var node = this.createPlain({}, kNodeForServer, function(nodeFromServer){
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

	resource.update = function(kNode, callback)
	{
		console.log("resource.update");
		if(kNode.state == knalledge.KNode.STATE_LOCAL){//TODO: fix it by going throgh queue
			window.alert("Please, wait while entity is being saved, before updating it:\n"+kNode.name);
			return null;
		}
		var id = kNode._id;
		var kNodeForServer = kNode.toServerCopy();
		if(QUEUE && false){
			KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"});
			return this.updatePlain({searchParam:id, type:'one'}, kNodeForServer, function(nodeFromServer){
				// realtime distribution
				if(KnAllEdgeRealTimeService){
					KnAllEdgeRealTimeService.emit(KnRealTimeNodeUpdatedEventName, nodeFromServer);
				}
			});

		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, kNodeForServer, function(nodeFromServer){
				// realtime distribution
				if(KnAllEdgeRealTimeService){
					KnAllEdgeRealTimeService.emit(KnRealTimeNodeUpdatedEventName, nodeFromServer);
				}
			});
		}
	};

	resource.destroy = function(id, callback)
	{
		var result = this.destroyPlain({searchParam:id, type:'one'}, function(){
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				KnAllEdgeRealTimeService.emit(KnRealTimeNodeDeletedEventName, id);
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

			var node = resource.createPlain({}, kNodeForServer, function(nodeFromServer){
				kNodeReturn.$resolved = node.$resolved;
				kNodeReturn.overrideFromServer(nodeFromServer);
				request.processing.RESOLVE(kNodeReturn);//kNodeReturn.resolve()
				if(callback) callback(kNodeReturn);
				KnalledgeMapQueue.executed(request);

				// realtime distribution
				if(KnAllEdgeRealTimeService){
					KnAllEdgeRealTimeService.emit(KnRealTimeNodeCreatedEventName, kNodeReturn.toServerCopy());
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

knalledgeMapServices.factory('KnalledgeEdgeService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', 'KnAllEdgeRealTimeService', function($resource, $q, ENV, KnalledgeMapQueue, KnAllEdgeRealTimeService){
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

	resource.update = function(kEdge, callback)
	{
		if(kEdge.state == knalledge.KEdge.STATE_LOCAL){//TODO: fix it by going throgh queue
			window.alert("Please, wait while entity is being saved, before updating it:\n"+kEdge.name);
			return null;
		}
		//TODO: check the name of param: id or ObjectId or _id?
		return this.updatePlain({searchParam:kEdge._id, type:'one'}, kEdge, callback);
	};

	resource.destroy = function(id, callback)
	{
		var result = this.destroyPlain({searchParam:id, type:'one'}, function(){
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				KnAllEdgeRealTimeService.emit(KnRealTimeEdgeDeletedEventName, id);
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

knalledgeMapServices.provider('KnalledgeMapVOsService', {
	// privateData: "privatno",
	$get: ['$q', '$rootScope', '$window', '$injector', 'KnalledgeNodeService', 'KnalledgeEdgeService',
	'RimaService', 'KnAllEdgeRealTimeService', 'CollaboPluginsService',
	function($q, $rootScope, $window, $injector, KnalledgeNodeService, KnalledgeEdgeService, RimaService,
		KnAllEdgeRealTimeService, CollaboPluginsService) {
		// var that = this;
		var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
		var provider = {
			mapId: "552678e69ad190a642ad461c",
			rootNodeId: "55268521fb9a901e442172f9",
			rootNode: null,
			selectedNode: null,
			nodesById: {},
			edgesById: {},
			properties: {},
			mapStructure: new knalledge.MapStructure(RimaService),
			lastVOUpdateTime: null,

			externalChangesInMap: function(eventName, msg){
				console.log("externalChangesInMap(%s,%s)",eventName, JSON.stringify(msg));
				var changes = {nodes:[], edges:[]};
				var shouldBroadcast = true;
				var ToVisualMsg = "-to-visual";

				switch(eventName){
					case KnRealTimeNodeCreatedEventName:
						kNode = knalledge.KNode.nodeFactory(msg);
						this.nodesById[kNode._id] = kNode;
						kNode.state = knalledge.KNode.STATE_SYNCED;
						var eventName = KnRealTimeNodeCreatedEventName + ToVisualMsg;
						changes.nodes.push(kNode);
					break;
					case KnRealTimeNodeUpdatedEventName:
						var kNode = this.nodesById[msg._id];
						if(typeof kNode === 'undefined'){
							console.error("externalChangesInMap:Node update received for a node that we don't have");
							this.nodesById[msg._id] = knalledge.KNode.nodeFactory(msg);
						}
						kNode.fill(msg);
						kNode.state = knalledge.KNode.STATE_SYNCED;
						var eventName = KnRealTimeNodeUpdatedEventName + ToVisualMsg;
						changes.nodes.push(kNode);
					break;
					case KnRealTimeNodeDeletedEventName:
						if(this.nodesById.hasOwnProperty(msg._id)){
							delete this.nodesById[msg._id];
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
						changes.edges.push(kEdge);
					break;
					case KnRealTimeEdgeUpdatedEventName:
						var kEdge = this.edgesById[msg._id];
						if(typeof kEdge === 'undefined'){
							console.error("externalChangesInMap:Edge update received for a edge that we don't have");
							this.edgesById[msg._id] = knalledge.KEdge.edgeFactory(msg);
						}
						kEdge.fill(msg);
						kEdge.state = knalledge.KEdge.STATE_SYNCED;
						var eventName = KnRealTimeEdgeUpdatedEventName + ToVisualMsg;
						changes.edges.push(kEdge);
					break;
					case KnRealTimeEdgeDeletedEventName:
						if(this.edgesById.hasOwnProperty(msg._id)){
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
					GlobalEmitterServicesArray.get(eventName).broadcast('KnalledgeMapVOsService', changes);
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


			unsetSelectedNode: function(){
				this.selectedNode = null;
			},

			setSelectedNode: function(selectedNode){
				this.selectedNode = selectedNode;
			},

			getSelectedNode: function(){
				return this.selectedNode;
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
				newNode.iAmId = RimaService.getActiveUserId();
				if(typeof kNodeType === 'undefined' || kNodeType === null){
					kNodeType = knalledge.KNode.TYPE_KNOWLEDGE; //TODO: check about this
				}

				newNode.type = kNodeType;

				var localNodeId = newNode._id;// = maxId+1;
				if(!('mapId' in newNode) || !newNode.mapId) newNode.mapId = this.mapId;

				newNode = KnalledgeNodeService.create(newNode, nodeCreated.bind(this)); //saving on server service.
				this.nodesById[localNodeId] = newNode;
				return newNode;
			},

			updateNode: function(node, updateType, callback) {
				return KnalledgeNodeService.update(node, callback); //TODO: ? updateType); //updating on server service
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

			relinkEdgeSource: function (kEdge, kNode, callback) {
				kEdge.sourceId = kNode._id;
				this.updateEdge(kEdge, "UPDATE_RELINK_EDGE", callback);
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

				if(!('mapId' in kEdge) || !kEdge.mapId) kEdge.mapId = this.mapId;
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
				newEdge.iAmId = RimaService.getActiveUserId();

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

			loadAndProcessData: function(map){
				var that = this;
				if(typeof map !== 'undefined'){
					this.mapId = map._id;
					this.rootNodeId = map.rootNodeId;
				}
				var result = this.loadData(map);
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
				});
				return result;
			},
			loadData: function(map, setAsDefaultMap){
				var that = this;

				if(setAsDefaultMap && typeof map !== 'undefined'){
					this.mapId = map._id;
					this.rootNodeId = map.rootNodeId;
				}

				if(typeof map == 'undefined'){
					var mapObj = {
						name: "TNC (Tesla - The Nature of Creativty) (DR Model)",
						createdAt: "2015.03.22.",
						type: "knalledge",
						dataContent: {
                            mcm: {
                                  authors: "S. Rudan, D. Karabeg"
                           }
                       	},
						_id: this.mapId,
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

			processData: function(mapData) {
				this.properties = mapData.map.properties;
				var i=0;
				var node = null;
				var edge = null;
				for(i=0; i<mapData.map.nodes.length; i++){
					node = mapData.map.nodes[i];
					if(!("isOpen" in node)){
						node.isOpen = false;
					}
					this.nodesById[node._id] = node;
				}

				for(i=0; i<mapData.map.edges.length; i++){
					edge = mapData.map.edges[i];
					this.edgesById[edge._id] = edge;
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

		// realtime listener registration
		var KnalledgeMapVOsServicePluginOptions = {
			name: "KnalledgeMapVOsService",
			events: {
			}
		};
		KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeCreatedEventName] = provider.externalChangesInMap.bind(provider);
		KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeUpdatedEventName] = provider.externalChangesInMap.bind(provider);
		KnalledgeMapVOsServicePluginOptions.events[KnRealTimeEdgeCreatedEventName] = provider.externalChangesInMap.bind(provider);
		KnalledgeMapVOsServicePluginOptions.events[KnRealTimeEdgeUpdatedEventName] = provider.externalChangesInMap.bind(provider);
		KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeDeletedEventName] = provider.externalChangesInMap.bind(provider);
		KnalledgeMapVOsServicePluginOptions.events[KnRealTimeEdgeDeletedEventName] = provider.externalChangesInMap.bind(provider);
		KnAllEdgeRealTimeService.registerPlugin(KnalledgeMapVOsServicePluginOptions);

		window.nodesById = provider.nodesById;//TODO:remove
		window.edgesById = provider.edgesById;//TODO:remove
		return provider;
	}]
});

knalledgeMapServices.factory('KnalledgeMapService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue',
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

	resource.getById = function(id, callback)
	{
		var map = this.getPlain({ searchParam:id, type:'one' }, function(mapFromServer){
			mapFromServer = knalledge.KMap.mapFactory(mapFromServer);
			mapFromServer.state = knalledge.KMap.STATE_SYNCED;
			if(callback) callback(mapFromServer);
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

		var updates = this.getPlain({type:'in_map_after', searchParam: KnalledgeMapVOsService.mapId, searchParam2:this.lastChange.getTime()}, function(changesFromServer){
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
knalledgeMapServices.provider('KnalledgeMapViewService', {
	// privateData: "privatno",
	$get: [
	function() {

				// var that = this;
		var provider = {
			config: {
				syncing: {
					poolChanges: false,
				},
				nodes: {
					showImages: true,
					showTypes: true
				},
				edges: {
					showNames: true,
					showTypes: true
				},
				filtering: {
					displayDistance	: 2,
					byAuthor: [] //array of iAmId. An empty means to see for all authors
				}
			}
		};

		return provider;
	}]
});
*/

/*
Migrated into separate TypeScript service class: KnalledgeMapPolicyService
knalledgeMapServices.provider('KnalledgeMapPolicyService', {
	// privateData: "privatno",
	$get: [
	function() {

				// var that = this;
		var provider = {
			config: {
				broadcasting: {
					enabled: false,
				},
				moderating: {
					enabled: false
				}
			}
		};

		return provider;
	}]
});
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

knalledgeMapServices.provider('KnAllEdgeRealTimeService', {
	$get: ['TopiChatService', 'KnalledgeMapPolicyService', /*'$q', 'ENV', '$rootScope', */
	function(TopiChatService, KnalledgeMapPolicyService/*$q , ENV, $rootScope*/) {

		// privateData: "privatno",

		var provider = {
			plugins: {},
			eventsByPlugins: {},

			init: function(){
				// registering chat plugin
				var knalledgeRealTimeServicePluginOptions = {
					name: "knalledgeRealTimeService",
					events: {
						'kn:realtime': this.dispatchEvent.bind(this)
					}
				};
				TopiChatService.registerPlugin(knalledgeRealTimeServicePluginOptions);
			},

			getClientInfo: function(){
				return TopiChatService.clientInfo;
			},

			emit: function(eventName, msg){
				// TODO
				if(!KnalledgeMapPolicyService.provider.config.broadcasting.enabled) return;
				console.log('[KnAllEdgeRealTimeService:emit] eventName: %s, msg:%s', eventName, JSON.stringify(msg));
				var knPackage = {
					eventName: eventName,
					msg: msg
				};

				// socket.emit('tc:chat-message', msg);
				// topiChatSocket.emit('tc:chat-message', msg);
				TopiChatService.emit('kn:realtime', knPackage);
			},

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
			},

			dispatchEvent: function(tcEventName, knPackage) {
				console.log('[KnAllEdgeRealTimeService:dispatchEvent] tcEventName: %s, knPackage:%s', tcEventName, JSON.stringify(knPackage));
				var msg = knPackage.msg;
				var eventName = knPackage.eventName;

				var eventByPlugins = this.eventsByPlugins[eventName];
				for(var id in eventByPlugins){
					var pluginOptions = eventByPlugins[id];
					var pluginName = pluginOptions.name;

					console.log('\t dispatching to plugin: %s', pluginName);
					var pluginCallback = pluginOptions.events[eventName];
					pluginCallback(eventName, msg);
				}
			}
		};

		provider.init();

		return provider;
	}]
})
;


}()); // end of 'use strict';
