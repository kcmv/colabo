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

var rimaServices = angular.module('rimaServices', ['ngResource', 'Config']);

rimaServices.factory('WhoAmIService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', function($resource, $q, ENV, KnalledgeMapQueue){
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

	resource.getById = function(id, callback)
	{
		var whoAmI = this.getPlain({ searchParam:id, type:'one' }, callback);
		return whoAmI;
	};
	
	resource.getByIds = function(whoAmIsIds, callback){ //TODO: fix not to return all, but only those in the whoAmIsIds list
		var whoAmIs = this.queryPlain({ searchParam:whoAmIsIds, type:'in_list'},
			function(whoAmIsFromServer){
				for(var id=0; id<whoAmIsFromServer.length; id++){
					var whoAmI = knalledge.WhoAmI.whoAmIFactory(whoAmIsFromServer[id]);
					whoAmI.state = knalledge.WhoAmI.STATE_SYNCED;
					whoAmIsFromServer[id] = whoAmI;
				}
				if(callback) callback(whoAmIsFromServer);
		});
		return whoAmIs;
	};
	
	resource.create = function(whoAmI, callback)
	{
		console.log("resource.create");
		
		if(QUEUE){
			whoAmI.$promise = null;
			whoAmI.$resolved = false;

			whoAmI.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: whoAmI, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
		}
		else{
			var whoAmIForServer = whoAmI.toServerCopy();
			//we return whoAmI:whoAmI, because 'whoAmI' is of type 'Resource'  
			var whoAmI = this.createPlain({}, whoAmIForServer, function(whoAmIFromServer){
				whoAmI.$resolved = whoAmI.$resolved;
				whoAmI.overrideFromServer(whoAmIFromServer);
				if(callback) callback(whoAmI);
			});
			
			//createPlain manages promises for its returning value, in our case 'whoAmI', so we need to  set its promise to the value we return
			whoAmI.$promise = whoAmI.$promise;
			whoAmI.$resolved = whoAmI.$resolved;
			
			if(whoAmI.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously 
				whoAmI.overrideFromServer(whoAmI);
			}
		}
		//we return this value to caller as a dirty one, and then set its value to whoAmIFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called 
		return whoAmI;
	};
	
	resource.update = function(whoAmI, callback)
	{
		console.log("resource.update");
		if(whoAmI.state == knalledge.WhoAmI.STATE_LOCAL){//TODO: fix it by going throgh queue 
			window.alert("Please, wait while entity is being saved, before updating it:\n"+whoAmI.name);
			return null;
		}
		var id = whoAmI._id;
		var whoAmIForServer = whoAmI.toServerCopy(); //TODO: move it to transformRequest ?
		if(QUEUE && false){
			KnalledgeMapQueue.execute({data: whoAmI, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create"});
			return this.updatePlain({searchParam:id, type:'one'}, whoAmIForServer, callback); //TODO: does it return whoAmI so we should fix it like in create?
		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, whoAmIForServer, callback); //TODO: does it return whoAmI so we should fix it like in create?
		}
	};
	
	resource.destroy = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'one'}, callback);
	};
	
	resource.execute = function(request){ //example:: request = {data: whoAmI, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}};
		// var whoAmI;
		switch(request.method){
		case 'create':
			//window.alert('create skipped ;)'); break;
			var whoAmIForServer = request.data.toServerCopy();
			var whoAmIReturn = request.data;
			var callback = request.callback;
			
			var whoAmI = resource.createPlain({}, whoAmIForServer, function(whoAmIFromServer){
				whoAmIReturn.$resolved = whoAmI.$resolved;
				whoAmIReturn.overrideFromServer(whoAmIFromServer);
				request.processing.RESOLVE(whoAmIReturn);//whoAmIReturn.resolve()
				if(callback) callback(whoAmIReturn);
				KnalledgeMapQueue.executed(request);
			});
			
			//createPlain manages promises for its returning value, in our case 'whoAmI', so we need to  set its promise to the value we return
			whoAmIReturn.$promise = whoAmI.$promise;
			whoAmIReturn.$resolved = whoAmI.$resolved;
			
			if(whoAmI.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously 
				whoAmIReturn.overrideFromServer(whoAmI);
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

rimaServices.provider('RimaService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', 'WhoAmIService', /*'$rootScope', */
	function($q, ENV, WhoAmIService /*, $rootScope*/) {
		var provider = {
			ANONYMOUS_USER_ID: "55268521fb9a901e442172f9",
			whoAmIs: [],
			loggedInWhoAmI: new knalledge.WhoAmI(),
			selectedWhoAmI: null,

			init: function(){
				this.loggedInWhoAmI._id = this.ANONYMOUS_USER_ID;
				this.loggedInWhoAmI.displayName = "anonymous";
				this.selectedWhoAmI = this.loggedInWhoAmI;
			},
				
			loadUsersFromList: function(usersIds, callback){
				var that = this;
				var whoAmIs = WhoAmIService.getByIds(usersIds,
					function(whoAmIsFromServer){
						that.whoAmIs = whoAmIsFromServer;
						//that.selectedWhoAmI = (that.whoAmIs && that.whoAmIs.length) ? that.whoAmIs[0] : null; //TODO: set it to logged-in user
						if(callback){callback();}
					});
				return whoAmIs;
			},

			getUsers: function(){
				return this.whoAmIs;
			},

			getUserById: function(id){
				for(var i in this.whoAmIs){
					if(this.whoAmIs[i]._id == id){
						return this.whoAmIs[i];
					}
				}
				return null;
			},

			selectActiveUser: function(whoAmI){
				this.selectedWhoAmI = whoAmI;
			},

			getActiveUser: function(){
				return this.selectedWhoAmI;
			},

			getActiveUserId: function(){
				return this.selectedWhoAmI ? this.selectedWhoAmI._id : undefined;
			},

			getMaxUserNum: function(){
				var gridMaxNum = 0;
				var whoAmIs = this.whoAmIs();
				for(var i in whoAmIs){
					var grid = whoAmIs[i];
					var gridId = parseInt(grid.name.substring(2));
					if(gridId > gridMaxNum){
						gridMaxNum = gridId;
					}
				}
				return gridMaxNum;
			},

			/*
			finds all users whos name contains *nameSubSt
			*/
			getUsersByName: function(nameSubStr){
				var returnedGrids = [];
				var whoAmIs = this.whoAmIs();
				for(var i in whoAmIs){
					var grid = whoAmIs[i];
					if(grid.name.indexOf(nameSubStr) > -1){
						returnedGrids.push(grid);
					}
				}
				return returnedGrids;
			}
		};
		provider.init();
		return provider;
	}]
});

}()); // end of 'use strict';