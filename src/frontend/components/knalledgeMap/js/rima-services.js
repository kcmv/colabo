(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var QUEUE = 
//false;
true;

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var rimaUserServices = angular.module('rimaUserServices', ['ngResource', 'Config']);

rimaUserServices.factory('WhoAmIService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', function($resource, $q, ENV, KnalledgeMapQueue){
	console.log("[WhoAmIService] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/whoAmIs/:type/:searchParam/:searchParam2.json';
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
				// console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[WhoAmIService] accessId: %s", serverResponse.accessId);
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
				console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[WhoAmIService] accessId: %s", serverResponse.accessId);
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
				//console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-WhoAmIService::createPlain] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("ng-[WhoAmIService::createPlain] data: %s", JSON.stringify(data));
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
					//console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[WhoAmIService:create] accessId: %s", serverResponse.accessId);
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
					//console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[WhoAmIService:create] accessId: %s", serverResponse.accessId);
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

	resource.RESOURCE_TYPE = 'WhoAmI';
	
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
		var kNodeForServer = kNode.toServerCopy(); //TODO: move it to transformRequest ?
		if(QUEUE && false){
			KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create"});
			return this.updatePlain({searchParam:id, type:'one'}, kNodeForServer, callback); //TODO: does it return node so we should fix it like in create?
		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, kNodeForServer, callback); //TODO: does it return node so we should fix it like in create?
		}
	};
	
	resource.destroy = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'one'}, callback);
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
			});
			
			//createPlain manages promises for its returning value, in our case 'node', so we need to  set its promise to the value we return
			kNodeReturn.$promise = node.$promise;
			kNodeReturn.$resolved = node.$resolved;
			
			if(node.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously 
				kNodeReturn.overrideFromServer(node);
			}
			break;
		case 'update':
			this.update;
			break;
		}
	}
	
	/* checks if request can be sent to server */
	resource.check = function(request){
		return true;
	}
	
	//KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});

	return resource;
	
}]);

rimaUserServices.provider('RimaUsersService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
		var items = [
			// {
			// 	_id: 0,
			// 	name: "Unknown",
			// 	user: "unknown"
			// },
			{
				_id: 1,
				name: "Anna",
				user: "Anna"
			},
			{
				_id: 2,
				name: "Scott",
				user: "Scott"
			},
			{
				_id: 3,
				name: "Eunseo",
				user: "Eunseo"
			},
			{
				_id: 4,
				name: "Laura",
				user: "Laura"
			},
			{
				_id: 5,
				name: "Chuck",
				user: "Chuck"
			},
			{
				_id: 6,
				name: "Martin",
				user: "Martin"
			},
			{
				_id: 7,
				name: "Ilya",
				user: "Ilya"
			},
			{
				_id: 8,
				name: "Sasha",
				user: "Sasha"
			}
		];

		var selectedItem = (items && items.length) ? items[0] : null;

		// var that = this;
		return {
			getUsers: function(){
				return items;
			},

			getUserById: function(id){
				var item = null
				for(var i in items){
					if(items[i]._id == id){
						item = items[i];
					}
				}
				return item;
			},

			selectActiveUser: function(item){
				selectedItem = item;
			},

			getActiveUser: function(){
				return selectedItem;
			},

			getActiveUserId: function(){
				return selectedItem ? selectedItem._id : undefined;
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
});

}()); // end of 'use strict';