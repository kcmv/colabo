(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var QUEUE = 
false;
//true;

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var knalledgeMapServices = angular.module('knalledgeMapServices', ['ngResource', 'Config']);

knalledgeMapServices.provider('KnalledgeMapQueue', {
	//KnalledgeMapQueue.execute({data: kNodeClone, data_original: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
	// privateData: "privatno",
	$get: ['$q', '$rootScope', '$window', function($q, $rootScope, $window) {
		// var that = this;
		return {
			queue: [],
			//linkToServices: {}, //KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});
			STATE_ADDED:"STATE_ADDED",
			STATE_BLOCKED:"STATE_BLOCKED",
			STATE_SENT:"STATE_SENT",
			STATE_FINISHED:"STATE_FINISHED",
			SERVICE_METHOD_EXECUTE:"EXECUTE",
			SERVICE_METHOD_CHECK:"CHECK",
			SERVICE_METHOD_CREATE:"create",
			SERVICE_METHOD_UPDATE:"update",

			execute: function(request){
				request.state = this.STATE_ADDED;
				this.queue.push(request);
				this.flush();
			},
			
			flush: function(){
				for(var i in this.queue){
					var request = this.queue[i]; 
					if(request.processing[this.SERVICE_METHOD_CHECK](request) && this.check(request,i)){
						request.processing[this.SERVICE_METHOD_EXECUTE](request);
						request.state = this.STATE_SENT;
					}
				}
			},
			
			check: function(request,index){
				/* update cannot be sent if it is updating resource (VO) that is still not created  */
				if(request.processing.method == this.SERVICE_METHOD_UPDATE){
					if(request.data_original.state == knalledge.KEdge.STATE_LOCAL){ //TODO: we check for KEdge.STATE_LOCAL even though it might be KNode. but they have same values so it is fine
						return false;
					}
					else{
						request.data._id = request.data_original._id; // request.data_original._id was set in meantime by created callback, and we set its value to clonedCopy (vanilla copy) of VO
					}
				}
//				for(var i = 0; i<index;i++){ //goes through all previous requests
//					var prev_request = this.quest[i];
//					if(prev_request.id && prev_request.)
//				}
				return true;
			}
			
//			link: function(resource, methods){
//				this.linkToServices[resource] = methods 
//				
//			}

//			updateNode: function(node) {
//				KnalledgeNodeService.update(node); //updating on server service
//			}
		};
	}]
});

knalledgeMapServices.factory('KnalledgeNodeService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', function($resource, $q, ENV, KnalledgeMapQueue){
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
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[knalledgeMapServices] accessId: %s", serverResponse.accessId);
				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
				var data = knalledge.KNode.nodeFactory(serverResponse.data[0]);
				data.state = knalledge.KNode.STATE_SYNCED;
				return data;
				*/
				return serverResponse.data[0];
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
				console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[KnalledgeNodeService] accessId: %s", serverResponse.accessId);
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
				console.log("[KnalledgeNodeService::createPlain] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("[KnalledgeNodeService::createPlain] data: %s", JSON.stringify(data));
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
		var kNodeCopy = knalledge.KNode.nodeFactory(kNode);
		var kNodeClone = kNode.toServerCopy();
		if(QUEUE){
			kNodeClone.$promise = null;
			kNodeClone.$resolved = false;

			kNodeClone.$promise = $q(function(resolve, reject) {
//				var jsonUrl = ENV.server.backend + "/sample-small.json";
//				$.getJSON(jsonUrl, null, function(jsonContent){
//					console.log("Loaded: %s, map (nodes: %d, edges: %d)", jsonUrl,
//					jsonContent.map.nodes.length, jsonContent.map.edges.length);
//					for(var id in jsonContent){
//						data[id] = jsonContent[id];
//					}
//					data.$resolved = true;
//					resolve(jsonContent);
//				});
				KnalledgeMapQueue.execute({data: kNodeClone, data_original:kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
			
			//KnalledgeMapQueue.execute({data: kNodeClone, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", promise: promise});
			
			
			return kNodeClone;
		}
		else{
			var node = this.createPlain({}, kNodeClone, function(nodeFromServer){
				kNodeCopy.$resolved = node.$resolved;
				kNodeCopy.overrideFromServer(nodeFromServer);
				if(callback) callback(nodeFromServer);
			});
			kNodeCopy.$promise = node.$promise;
			kNodeCopy.$resolved = node.$resolved;
			return kNodeCopy;
		}
	};
	
	resource.update = function(kNode, callback)
	{
		console.log("resource.update");
		var id = kNode._id;
		var kNodeClone = kNode.toServerCopy(); //TODO: move it to transformRequest ?
		if(QUEUE){
			KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create"});
			return this.updatePlain({searchParam:id, type:'one'}, kNodeClone, callback); //TODO: does it return node so we should fix it like in create?
		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, kNodeClone, callback); //TODO: does it return node so we should fix it like in create?
		}
	};
	
	resource.destroy = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'one'}, callback);
	};
	
	resource.execute = function(request){ //example:: request = {data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}}
		// var kNode;
		switch(request.method){
		case 'create':
			var kNode = resource.createPlain({}, request.data, request.callback);
			kNode.$promise.then(function(nodeFromServer){
				console.log('create-back');
				request.data.$resolved = true;
				request.processing.RESOLVE(nodeFromServer);
			});
			return kNode;
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

knalledgeMapServices.factory('KnalledgeEdgeService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', function($resource, $q, ENV, KnalledgeMapQueue){
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
				console.log("[knalledgeMapServices] accessId: %s", serverResponse.accessId);
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
				console.log("[KnalledgeEdgeService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[KnalledgeEdgeService] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				var VOs = [];
				for(var datumId in serverResponse.data){
					var VO = knalledge.KEdge.edgeFactory(data[datumId]);
					VOs.push(VO);
				}
				//console.log("[KnalledgeNodeService] data: %s", JSON.stringify(data));
				return VOs;
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
	
	resource.getById = function(id, callback)
	{
		return this.getPlain({ searchParam:id, type:'one' }, callback);
	};
	
	resource.queryInMap = function(id, callback)
	{
		return this.queryPlain({ searchParam:id, type:'in_map' }, function(edgesFromServer){
			for(var id=0; id<edgesFromServer.length; id++){
				var kEdge = knalledge.KEdge.edgeFactory(edgesFromServer[id]);
				edgesFromServer[id] = kEdge;
			}

			if(callback) callback(edgesFromServer);
		});
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
		// return this.createPlain({}, kEdge, callback);

		console.log("resource.create");
		var kEdgeCopy = knalledge.KEdge.edgeFactory(kEdge);
		var kEdgeClone = kEdge.toServerCopy();

		var edge = this.createPlain({}, kEdgeClone, function(edgeFromServer){
			kEdgeCopy.$resolved = edge.$resolved;
			kEdgeCopy.overrideFromServer(edgeFromServer);
			if(callback) callback(edgeFromServer);
		});
		kEdgeCopy.$promise = edge.$promise;
		kEdgeCopy.$resolved = edge.$resolved;
		return kEdgeCopy;
	};
	
	resource.update = function(kEdge, callback)
	{
		//TODO: check the name of param: id or ObjectId or _id?
		return this.updatePlain({searchParam:kEdge._id, type:'one'}, kEdge, callback);
	};
	
	resource.destroy = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'one'}, callback);
	};
	
	return resource;
	
}]);

knalledgeMapServices.provider('KnalledgeMapService', {
	// privateData: "privatno",
	$get: ['$q', '$rootScope', '$window', 'KnalledgeNodeService', 'KnalledgeEdgeService', function($q, $rootScope, $window, KnalledgeNodeService, KnalledgeEdgeService) {
		// var that = this;
		return {
			mapId: "552678e69ad190a642ad461c",
			rootNodeId: "55268521fb9a901e442172f9",
			rootNode: null,
			selectedNode: null,
			nodesById: {},
			edgesById: {},
			properties: {},

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
	
			createNode: function() {
				
				var nodeCreated = function(nodeFromServer) {
					console.log("[KnalledgeMapService] nodeCreated" + JSON.stringify(nodeFromServer));
					var edgeUpdatedNodeRef = function(edgeFromServer){
						console.log("[KnalledgeMapService] edgeUpdatedNodeRef" + JSON.stringify(edgeFromServer));
					};
					
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

				console.log("[KnalledgeMapService] createNode");
				var maxId = -1;
				for(var i in this.nodesById){
					if(maxId < this.nodesById[i]._id){
						maxId = this.nodesById[i]._id;
					}
				}

				var newNode = new knalledge.KNode();
				var localNodeId = newNode._id = maxId+1;
				newNode.mapId = this.mapId;

				newNode = KnalledgeNodeService.create(newNode, nodeCreated.bind(this)); //saving on server service.
				this.nodesById[localNodeId] = newNode;
				return newNode;
			},

			updateNode: function(node, updateType) {
				KnalledgeNodeService.update(node, updateType); //updating on server service
			},
			
			deleteNode: function(node) {
				KnalledgeNodeService.destroy(node._id); //deleteNode on server service
				delete this.nodesById[node._id];
			},

			createEdge: function(sourceNode, targetNode) {
				var edgeCreated = function(edgeFromServer) {
					console.log("[KnalledgeMapService] edgeCreated" + JSON.stringify(edgeFromServer));
					
					// updating all references to edge on fronted with server-created id:
					// var oldId = newEdge._id;
					delete this.edgesById[localEdgeId];//		this.nodesById.splice(oldId, 1);
					this.edgesById[edgeFromServer._id] = newEdge; //TODO: we should set it to 'edgeFromServer'?! But we should synchronize also local changes from 'newEdge' happen in meantime
					// newEdge._id = edgeFromServer._id; //TODO: same as above
					// newEdge.fill(edgeFromServer);
				};
				
				console.log("[KnalledgeMapService] createEdge");
				var maxId = -1;
				for(var i in this.edgesById){
					if(maxId < this.edgesById[i]._id){
						maxId = this.edgesById[i]._id;
					}
				}
				
				var newEdge = new knalledge.KEdge();
				var localEdgeId = newEdge._id = maxId+1;
				newEdge.mapId = this.mapId;
				newEdge.sourceId = sourceNode._id;
				newEdge.targetId = targetNode._id;

				newEdge = KnalledgeEdgeService.create(newEdge, edgeCreated.bind(this));

				this.edgesById[localEdgeId] = newEdge;
				
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
			
			deleteEdgesConnectedTo: function(node) {
				KnalledgeNodeService.update(node); //updating on server service
			},

			loadData: function(mapProperties){
				if(typeof mapProperties !== 'undefined'){
					this.mapId = mapProperties.mapId;
					this.rootNodeId = mapProperties.rootNodeId;
				}else{
					mapProperties = {
						"name": "TNC (Tesla - The Nature of Creativty) (DR Model)",
						"date": "2015.03.22.",
						"authors": "S. Rudan, D. Karabeg",
						"mapId": this.mapId,
						"rootNodeId": this.rootNodeId
					};
				}

				var result = {
					"properties": mapProperties,
					"map": {
						"nodes": [],
						"edges": []
					}
				};

				var handleReject = function(fail){
					$window.alert("Error loading knalledgeMap: %s", fail);
				};
				
				var nodesEdgesReceived = function(){
					console.log("[KnalledgeMapService::loadData] nodesEdgesReceived");
					var i;
					for(i=0; i<nodes.length; i++){
						result.map.nodes.push(nodes[i]);
					}
					for(i=0; i<edges.length; i++){
						result.map.edges.push(edges[i]);
					}

					this.processData(result);

					var eventName = "modelLoadedEvent";
					//console.log("result:" + JSON.stringify(result));
					$rootScope.$broadcast(eventName, result);
				};
				
				var nodes = KnalledgeNodeService.queryInMap(this.mapId);
				var edges = KnalledgeEdgeService.queryInMap(this.mapId);
				
				$q.all([nodes.$promise, edges.$promise])
					.then(nodesEdgesReceived.bind(this))
					.catch(handleReject); //TODO: test this. 2nd function fail or like this 'catch' 
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
			}

		};
	}]
});

}()); // end of 'use strict';