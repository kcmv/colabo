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
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[knalledgeMapServices] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
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

		queryPlain: {method:'GET', params:{type:'', searchParam:''}, isArray:true,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[KnalledgeMapService] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = serverResponse ? serverResponse.data : null;
				var VOs = [];
				for(var datumId in serverResponse.data){
					var VO = knalledge.KMap.nodeFactory(data[datumId]);
					VO.state = knalledge.KMap.STATE_SYNCED;
					VOs.push(VO);
				}
				//console.log("[KnalledgeMapService] data: %s", JSON.stringify(data));
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
				//console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-KnalledgeMapService::createPlain] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
				var data = serverResponse ? serverResponse.data : null;
				console.log("ng-[KnalledgeMapService::createPlain] data: %s", JSON.stringify(data));
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
					//console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeMapService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
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
					//console.log("[KnalledgeMapService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[KnalledgeMapService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
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

	/* Example:
	http://localhost:8001/kmaps/by-participant/556760847125996dc1a4a24f.json
	*/
	resource.queryByParticipant = function(participantId, callback){
		if(participantId === null){
			window.alert("You're not logged in. Until you login, you will only see public maps");
		}else{
			if(typeof participantId !== 'string'){
				console.error("[queryByParticipant] participantId:", participantId);
				window.alert("Error in acessing your profile. Please try again or re-login");
				if(callback) callback(null, 'participantId not a string');
				return;
			}
		}
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

		if(Plugins.puzzles.knalledgeMap.config.services.QUEUE){
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
		if(Plugins.puzzles.knalledgeMap.config.services.QUEUE && false){
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

	resource.export = function(mapId, callback)
	{
		//return this.createPlain({}, {mapId:mapId,newName:newName, type:'export'}, callback);
		return this.updatePlain({type:'export', searchParam:mapId}, {}, callback);
		//return this.createPlain({searchParam:mapId, searchParam2:newName, type:'export'}, callback);
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

}()); // end of 'use strict';
