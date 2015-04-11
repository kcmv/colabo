(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

//TODO: how to create this Object and where to put it?
var kNode = {
	_id: String, //TODO: type? ObjectId or Number?
	name: String,
	mapId: String,
	iAmId: Number,
	activeVersion: Number,
	ideaId: Number,
	version: Number,
	isPublic: Boolean,
	dataContentSerialized: String,
	visual: {
		isOpen: Boolean,
		manualX: Number,
		manualY: Number
	}
};

var knalledgeMapServices = angular.module('knalledgeMapServices', ['ngResource', 'Config']);

knalledgeMapServices.factory('KnalledgeNodeService', ['$resource', '$q', 'ENV', function($resource, $q, ENV){
	console.log("[knalledgeMapServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/knodes/:type/:searchParam.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[DatasetsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasetsService] accessId: %s", serverResponse.accessId);
				var datasets = serverResponse.dataset;
				return datasets[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		queryPlain: {method:'GET', params:{type:'', searchParam:'', extension:".json"}, isArray:true, 
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[DatasetsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasetsService] accessId: %s", serverResponse.accessId);
				var datasets = serverResponse.dataset;
//				for(var datasetId in datasets){
//					var dataset = datasets[datasetId];
//				}
				//console.log("[DatasetsService] data: %s", JSON.stringify(data));
				return datasets;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		createPlain: {method:'POST', params:{extension:".json"}/*{type:'', searchParam: '', extension:""}*/, 
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				//console.log("[DatasService] data: %s", JSON.stringify(data));
				return data;
			}else{
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		updatePlain: {method:'PUT', params:{type:'one', searchParam:'', extension:".json"},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;					
				}
			}
		},
		
		destroyPlain: {method:'DELETE', params:{type:'one', extension:".json"},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
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
				resolve(jsonContent);
			});
		// reject('Greeting ' + name + ' is not allowed.');
		});
		return data;
	};

	//TODO: Add Promises
	resource.getById = function(id, callback)
	{
		this.getPlain({ searchParam:id, type:'one' }, callback);
	}
	
	resource.queryInMap = function(id, callback)
	{
		this.queryPlain({ searchParam:id, type:'in_map' }, callback);
	}
	
	resource.create = function(kNode, callback)
	{
		this.createPlain({}, kNode, callback);
	}
	
	resource.update = function(kNode, callback)
	{
		//TODO: check the name of param: id or ObjectId or _id?
		this.updatePlain({searchParam:kNode.id, type:'one'}, kNode, callback);
	}
	
	resource.destroy = function(id, callback)
	{
		this.destroyPlain({searchParam:id, type:'one'}, callback);
	}

	return resource;
	
}]);

knalledgeServices.factory('KnalledgeEdgeService', ['$resource', '$q', 'ENV', function($resource, $q, ENV){
	console.log("[atGsServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/knodes/:type/:searchParam.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[DatasetsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasetsService] accessId: %s", serverResponse.accessId);
				var datasets = serverResponse.dataset;
				return datasets[0];
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		queryPlain: {method:'GET', params:{type:'', searchParam:'', extension:".json"}, isArray:true, 
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[DatasetsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasetsService] accessId: %s", serverResponse.accessId);
				var datasets = serverResponse.dataset;
//				for(var datasetId in datasets){
//					var dataset = datasets[datasetId];
//				}
				//console.log("[DatasetsService] data: %s", JSON.stringify(data));
				return datasets;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		createPlain: {method:'POST', params:{extension:".json"}/*{type:'', searchParam: '', extension:""}*/, 
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				//console.log("[DatasService] data: %s", JSON.stringify(data));
				return data;
			}else{
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		updatePlain: {method:'PUT', params:{type:'one', searchParam:'', extension:".json"},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;					
				}
			}
		},
		
		destroyPlain: {method:'DELETE', params:{type:'one', extension:".json"},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
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
	
	//TODO: Add Promises
	resource.getById = function(id, callback)
	{
		this.getPlain({ searchParam:id, type:'one' }, callback);
	}
	
	resource.queryInMap = function(id, callback)
	{
		this.queryPlain({ searchParam:id, type:'in_map' }, callback);
	}
	
	resource.create(kEdge, callback)
	{
		this.createPlain({}, kEdge, callback);
	}
	
	resource.update(kEdge, callback)
	{
		//TODO: check the name of param: id or ObjectId or _id?
		this.updatePlain({searchParam:kEdge.id, type:'one'}, kEdge, callback);
	}
	
	resource.destroy(id, callback)
	{
		this.destroyPlain({searchParam:id, type:'one'}, callback);
	}
	
}]);

}()); // end of 'use strict';