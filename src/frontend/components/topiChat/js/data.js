(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var datatalksServices = angular.module('dataTalksServices', ['ngResource', 'Config']);

function removeJsonProtected(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
}

datatalksServices.factory('DatasService', ['$resource', 'ENV', function($resource, ENV){
	console.log("[datatalksServices] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/datas/:ideaId/:type/:searchParam:extension';
	return $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		get: {method:'GET', params:{ideaId:'1', type: 'one', extension:".json"}, isArray:false, 
		transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[DatasService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasService] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				if(data){
					data.snippet = "author "+data.iAmId+" (ideaId:" + data.ideaId + ", id:" + data.id + ", ver "+data.version+")";
					data.dataContent = (data.dataContentSerialized && data.dataContentSerialized !== "") ? JSON.parse(data.dataContentSerialized): data.dataContentSerialized;
				}
				return data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		query: {method:'GET', params:{ideaId:'1', type:'many-name', searchParam:'', extension:".json"}, isArray:true, 
		transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				console.log("[DatasService::query] Parsing: %s", serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[DatasService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasService] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				for(var dataId in data){
					var datum = data[dataId];
					if(datum){
						datum.snippet = "author "+datum.iAmId+" (ideaId:" + datum.ideaId + ", id:" + datum.id + ", ver "+datum.version+")";
						datum.dataContent = (datum.dataContentSerialized && datum.dataContentSerialized !== "") ? JSON.parse(datum.dataContentSerialized): datum.dataContentSerialized;
					}
				}
				//console.log("[DatasService] data: %s", JSON.stringify(data));
				return data;
			}else{
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		queryByDecorated: {method:'GET', params:{ideaId:'1', type:'by-decorated', searchParam:'', extension:".json"}, isArray:true, 
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[DatasService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasService] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				for(var dataId in data){
					var datum = data[dataId];
					if(datum){
						datum.snippet = "author "+datum.iAmId+" (id:" + datum.id + ", ver "+datum.version+")";
						datum.dataContent = (datum.dataContentSerialized && datum.dataContentSerialized !== "") ? JSON.parse(datum.dataContentSerialized): datum.dataContentSerialized;
					}
				}
				//console.log("[DatasService] data: %s", JSON.stringify(data));
				return data;
			}else{
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		'create': {method:'POST', params:{ideaId:'', type:'', searchParam: '', extension:""}, 
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				data.dataContent = (data.dataContentSerialized && data.dataContentSerialized !== "") ? JSON.parse(data.dataContentSerialized): data.dataContentSerialized;
				//console.log("[DatasService] data: %s", JSON.stringify(data));
				return data;
			}else{
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		update: {method:'PUT', params:{ideaId:'1', type:'one', searchParam:'@searchParam', extension:".json"}, 
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[TagRelationsService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[DatasService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					data.dataContent = (data.dataContentSerialized && data.dataContentSerialized !== "") ?
						JSON.parse(data.dataContentSerialized): data.dataContentSerialized;
					//console.log("[DatasService] data: %s", JSON.stringify(data));
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;
				}
			},
			transformRequest: function(serverRequestNonParsed/*, headersGetter*/){
				serverRequestNonParsed.dataContentSerialized = JSON.stringify(serverRequestNonParsed.dataContent);
				var serverRequesParsed = JSON.stringify(serverRequestNonParsed);
				return serverRequesParsed;
			}
		},
		'destroy': {method:'DELETE', params:{ideaId:'1', type:'one', extension:".json"}}
	});
}]);

}()); // end of 'use strict';