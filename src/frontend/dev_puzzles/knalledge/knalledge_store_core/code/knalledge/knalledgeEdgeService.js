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
* @class KnalledgeEdgeService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/

knalledgeMapServices.factory('KnalledgeEdgeService', ['$injector', '$resource', '$q', 'Plugins', 'ENV', 'KnalledgeMapQueue', 'ChangeService', function($injector, $resource, $q, Plugins, ENV, KnalledgeMapQueue, ChangeService){
	try{
		var KnAllEdgeRealTimeService = Plugins.puzzles.knalledgeMap.config.knAllEdgeRealTimeService.available ?
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
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
				// console.log("[knalledgeMapServices] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
				var data = serverResponse ? serverResponse.data : null;
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
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
				// console.log("[KnalledgeEdgeService] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
//				var data = serverResponse ? serverResponse.data : null;
//				var VOs = [];
//				for(var datumId in serverResponse.data){
//					var VO = knalledge.KEdge.edgeFactory(data[datumId]);
//					VOs.push(VO);
//				}
//				//console.log("[KnalledgeNodeService] data: %s", JSON.stringify(data));
//				return VOs;

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
				//console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[KnalledgeEdgeService::create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
				var data = serverResponse ? serverResponse.data : null;
				console.log("[KnalledgeEdgeService::create] data: %s", JSON.stringify(data));
				return data;
			}else{
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
					//console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeEdgeService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
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
					//console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeEdgeService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
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

		if(Plugins.puzzles.knalledgeMap.config.services.QUEUE){
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
		if(Plugins.puzzles.knalledgeMap.config.services.QUEUE && false){
			// KnalledgeMapQueue.execute({data: kEdge, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"});
			// return this.updatePlain({searchParam:id, type:'one'}, kEdgeForServer, function(edgeFromServer){
			// 	// realtime distribution
			// 	if(KnAllEdgeRealTimeService){
			// 		var change = new puzzles.changes.Change();
			// 		change.value = kEdgeForServer;
			// 		change.valueBeforeChange = null; //TODO
			// 		change.reference = edgeFromServer._id;
			// 		change.type = puzzles.changes.ChangeType.STRUCTURAL;
			// 		change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName;
			// 		change.action = null; //TODO: to add Edge actionType-s
			// 		change.domain = puzzles.changes.Domain.EDGE;
			// 		change.visibility = puzzles.changes.ChangeVisibility.ALL;
			// 		change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;
			//
			// 		KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName, change); //edgeFromServer);
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
					change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName;
					change.action = null; //TODO: to add Edge actionType-s
					change.domain = puzzles.changes.Domain.EDGE;
					change.visibility = puzzles.changes.ChangeVisibility.ALL;
					change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;

					KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName, change); //edgeFromServer);
				}
				if(callback) callback(true);
			},
			function(error){
				//console.error('EDGE: UPDATE: ',error,' for ',kNodeForServer);
				ChangeService.logActionLost({'type:': 'EDGE: UPDATE', 'error': error, 'kEdgeForServer' : kEdgeForServer});
			}
		);
		}
	};

	resource.destroy = function(id, callback)
	{
		var result = this.destroyPlain({searchParam:id, type:'one'}, function(){
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeDeletedEventName, {'_id':id});
			}
			if(callback){callback()};
		},
		function(error){
			//console.error('EDGE: DELETE: ',error,' for ',kNodeForServer);
			ChangeService.logActionLost({'type:': 'EDGE: DELETE', 'error': error, 'id' : id});
		}
	);
		return result;
	};

	resource.destroyByModificationSource = function(mapId, modificationSource, callback)
	{
		var result = this.destroyPlain({searchParam:mapId, type:'by-modification-source'}, function(){
			// realtime distribution
			if(KnAllEdgeRealTimeService){
				KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgesDeletedEventName, {mapId: mapId});
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
						KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeCreatedEventName, kEdgeReturn.toServerCopy());
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

}()); // end of 'use strict';
