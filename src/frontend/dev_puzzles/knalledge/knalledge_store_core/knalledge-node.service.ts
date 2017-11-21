import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {CFService} from './cf.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const nodeAP = "knodes";

@Injectable()
export class KnalledgeNodeService extends CFService{

  //http://api.colabo.space/knodes/
  // "http://127.0.0.1:888/knodes/";

  private apiUrl: string;
  private defaultAction:string = 'default';

	private knalledgeMapQueue:any = null;
	private knAllEdgeRealTimeService:any = null;

	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
    //private ENV = undefined
  ){
    super();
    console.log('KnalledgeNodeService:constructor');
    //this.apiUrl = this.ENV.server.backend + '/' + nodeAP + '/';
    this.apiUrl = CFService.serverAP + '/' + nodeAP + '/';
  }

  //TODO: all the old (expecting Promises) code calling this will have to call .toPromise() on the reuslt
  getById(id, callback?:Function): Observable<KNode>
  {
    //TODO: check 'callback' support
    console.log('getById('+id+')');
    var url: string = this.apiUrl+'one/'+this.defaultAction+'/'+id;
    //url = 'http://localhost:8001/howAmIs/all/.json';
    //url = 'http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json';
    //url = 'http://localhost:8001/kedges/';
    console.log('url: '+url+')');
    //TODO: we cannot still use get<KNode>(url) because server returns the object as ServerData
    var result:Observable<KNode> = this.http.get<ServerData>(url)
      .pipe(
        // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
        map(node => this.extractVO<KNode>(node,KNode)),
        catchError(this.handleError('KnalledgeNodeService::getById', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(node => callback(node));}
    return result; //return returnPromise ? result.toPromise() : result;

    //return this.getPlain({ searchParam:id, type:'one' }, callback);
  }

  /*
  Example: http://localhost:8001/knodes/in_map/default/579811d88e12abfa556f6b59.json
  */
  //TODO: all the old (expecting Promises) code calling this will have to call .toPromise() on the reuslt
  //queryInMap(id, callback?:Function, returnPromise:boolean = false): Observable<KNode[]>
  queryInMap(id, callback?:Function): Observable<KNode[]>
  {
    //TODO: check 'callback' support
    function processNodes(nodesS):Array<KNode>{
      console.log("processNodes");
      var nodes:Array<KNode> = nodesS.data as Array<KNode>;
      for(var id=0; id<nodes.length; id++){
        //TODO: will not be needed when/if we get rid of ServerData wrapping needed now, because the response from server will be typed to KNode unlike in previous versions
        var kNode:KNode = KNode.factory(nodes[id]);
        kNode.state = KNode.STATE_SYNCED;
        console.log(kNode);
        nodes[id] = kNode;
      }
      return nodes;
    }

    var result:Observable<KNode[]> = this.http.get<ServerData>(this.apiUrl+'in_map/'+this.defaultAction+'/'+id)
      .pipe(
        map(nodesFromServer => processNodes(nodesFromServer)),
        catchError(this.handleError('KnalledgeNodeService::queryInMap', null))
      );

    if(callback){result.subscribe(nodes => callback(nodes));}
    return result; //returnPromise ? result.toPromise() : result;
  }

  //KnalledgeNodeService.create((newNode, callback)

  //KnalledgeNodeService.update(node, actionType, patch, callback)

  //KnalledgeNodeService.destroy(id)
}

// /**
// * the namespace for the knalledgeMap part of the KnAllEdge system
// * @namespace knalledge.knalledgeMap
// */
//
// (function () { // This prevents problems when concatenating scripts that aren't strict.
// 'use strict';
// //this function is strict...
//
// var Plugins = window.Config.Plugins;
//
// var knalledgeMapServices = angular.module('knalledgeMapServices');
//
// /**
// * @class KnalledgeNodeService
// * @memberof knalledge.knalledgeMap.knalledgeMapServices
// */
//
// knalledgeMapServices.factory('KnalledgeNodeService', ['$injector', '$resource', '$q', 'Plugins', 'ENV', 'KnalledgeMapQueue', 'ChangeService',
// function($injector, $resource, $q, Plugins, ENV, KnalledgeMapQueue, ChangeService){
// 	try{
// 		var KnAllEdgeRealTimeService = Plugins.puzzles.knalledgeMap.config.knAllEdgeRealTimeService.available ?
// 			$injector.get('KnAllEdgeRealTimeService') : null;
// 	}catch(err){
// 		console.warn("Error while trying to retrieve the KnAllEdgeRealTimeService service:", err);
// 	}
//
// 	console.log("[knalledgeMapServices] server backend: %s", ENV.server.backend);
// 	// creationId is parameter that will be replaced with real value during the service call from controller
// 	var url = ENV.server.backend + '/knodes/:type/:actionType/:searchParam/:searchParam2.json';
// 	var resource = $resource(url, {}, {
// 		// extending the query action
// 		// method has to be defined
// 		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
// 		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
// 		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
// 			// interceptor : {responseError : resourceErrorHandler, requestError : resourceErrorHandler},
// 			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
// 			var serverResponse;
// 			if(ENV.server.parseResponse){
// 				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				// console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 				// console.log("[knalledgeMapServices] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
// 				var data = knalledge.KNode.factory(serverResponse.data[0]);
// 				data.state = knalledge.KNode.STATE_SYNCED;
// 				return data;
// 				*/
// 				return serverResponse ? serverResponse.data : null;
// 			}else{
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				return serverResponse;
// 			}
// 		}},
//
// 		queryPlain: {method:'GET', params:{type:'', searchParam:''}, isArray:true,
// 			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
// 			var serverResponse;
// 			if(ENV.server.parseResponse){
// 				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				// console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 				// console.log("[KnalledgeNodeService] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
// 				var data = serverResponse.data;
// 				var VOs = [];
// 				for(var datumId in serverResponse.data){
// 					var VO = knalledge.KNode.factory(data[datumId]);
// 					VO.state = knalledge.KNode.STATE_SYNCED;
// 					VOs.push(VO);
// 				}
// 				//console.log("[KnalledgeNodeService] data: %s", JSON.stringify(data));
// 				return VOs;
// 				*/
// 				return serverResponse ? serverResponse.data : null;
// 			}else{
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				return serverResponse;
// 			}
// 		}},
//
// 		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/,
// 			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
// 			var serverResponse;
// 			if(ENV.server.parseResponse){
// 				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 				console.log("[ng-KnalledgeNodeService::createPlain] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 				var data = serverResponse ? serverResponse.data : null;
// 				console.log("ng-[KnalledgeNodeService::createPlain] data: %s", JSON.stringify(data));
// 				return data;
// 			}else{
// 				//console.log("ENV.server.parseResponse = false");
// 				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				return serverResponse;
// 			}
// 		}},
//
// 		updatePlain: {method:'PUT', params:{type:'one', actionType:knalledge.KNode.UPDATE_TYPE_ALL, searchParam:''},
// 			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
// 				var serverResponse;
// 				if(ENV.server.parseResponse){
// 					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 					serverResponse = JSON.parse(serverResponseNonParsed);
// 					if(serverResponse != null){
// 						//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 						console.log("[KnalledgeNodeService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 						var data = serverResponse ? serverResponse.data : null;
// 						return data;
// 					} else {
// 						return null;
// 					}
// 				}else{
// 					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 					serverResponse = JSON.parse(serverResponseNonParsed);
// 					return serverResponse;
// 				}
// 			}
// 		},
//
// 		destroyPlain: {method:'DELETE', params:{type:'one'},
// 			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
// 				var serverResponse;
// 				if(ENV.server.parseResponse){
// 					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 					serverResponse = JSON.parse(serverResponseNonParsed);
// 					//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 					console.log("[KnalledgeNodeService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 					var data = serverResponse ? serverResponse.data : null;
// 					return data;
// 				}else{
// 					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 					serverResponse = JSON.parse(serverResponseNonParsed);
// 					return serverResponse;
// 				}
// 			}
// 		}
// 	});
//
// 	resource.RESOURCE_TYPE = 'KNode';
//
// 	resource.query = function(){
// 		var data = {
// 			$promise: null,
// 			$resolved: false
// 		};
//
// 		data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
// 			var jsonUrl = ENV.server.backend + "/sample-small.json";
// 			$.getJSON(jsonUrl, null, function(jsonContent){
// 				console.log("Loaded: %s, map (nodes: %d, edges: %d)", jsonUrl,
// 				jsonContent.map.nodes.length, jsonContent.map.edges.length);
// 				for(var id in jsonContent){
// 					data[id] = jsonContent[id];
// 				}
// 				data.$resolved = true;
// 				resolve(data);
// 			});
// 		// reject('Greeting ' + name + ' is not allowed.');
// 		});
// 		return data;
// 	};
//
// 	resource.getById = function(id, callback)
// 	{
// 		var node = this.getPlain({actionType:'default', searchParam:id, type:'one' }, callback);
// 		return node;
// 	};
//
// 	resource.queryInMap = function(id, callback)
// 	{
// 		var nodes = this.queryPlain({ actionType:'default', searchParam:id, type:'in_map' }, function(nodesFromServer){
// 			for(var id=0; id<nodesFromServer.length; id++){
// 				var kNode = knalledge.KNode.factory(nodesFromServer[id]);
// 				kNode.state = knalledge.KNode.STATE_SYNCED;
// 				nodesFromServer[id] = kNode;
// 			}
//
// 			if(callback) callback(nodesFromServer);
// 		});
// 		// for(var i in nodes){
// 		// 	//TODO fix nodes.state, etc
// 		// }
// 		return nodes;
// 	};
//
// 	resource.getInMapNodesOfType = function(mapId, kNodeType, callback){
// 		var nodes = this.queryPlain({ actionType:'default', searchParam:mapId, type:'in_map', searchParam2:kNodeType  }, function(nodesFromServer){
// 			for(var id=0; id<nodesFromServer.length; id++){
// 				var kNode = knalledge.KNode.factory(nodesFromServer[id]);
// 				kNode.state = knalledge.KNode.STATE_SYNCED;
// 				nodesFromServer[id] = kNode;
// 			}
//
// 			if(callback) callback(nodesFromServer);
// 		});
// 		// for(var i in nodes){
// 		// 	//TODO fix nodes.state, etc
// 		// }
// 		return nodes;
// 	};
//
// 	resource.create = function(kNode, callback)
// 	{
// 		console.log("resource.create");
//
// 		if(Plugins.puzzles.knalledgeMap.config.services.QUEUE){
// 			kNode.$promise = null;
// 			kNode.$resolved = false;
//
// 			kNode.$promise = $q(function(resolve, reject) {
// 				KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
// 			});
// 		}
// 		else{
// 			var kNodeForServer = kNode.toServerCopy();
// 			//we return kNode:kNode, because 'node' is of type 'Resource'
// 			var node = this.createPlain({
// 				//actionType:'default'
// 				}, kNodeForServer, function(nodeFromServer){
// 				kNode.$resolved = node.$resolved;
// 				kNode.overrideFromServer(nodeFromServer);
// 				if(callback) callback(kNode);
// 			});
//
// 			//createPlain manages promises for its returning value, in our case 'node', so we need to  set its promise to the value we return
// 			kNode.$promise = node.$promise;
// 			kNode.$resolved = node.$resolved;
//
// 			if(node.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
// 				kNode.overrideFromServer(node);
// 			}
// 		}
// 		//we return this value to caller as a dirty one, and then set its value to nodeFromServer when upper callback is called
// 		//TODO: a problem may occur if promise is resolved BEFORE callback is called
// 		return kNode;
// 	};
//
// 	resource.update = function(kNode, actionType, patch, callback)
// 	{
//
// 		console.log("resource.update");
// 		if(kNode.state == knalledge.KNode.STATE_LOCAL){//TODO: fix it by going throgh queue
// 			window.alert("Please, wait while entity is being saved, before updating it:\n"+kNode.name);
// 			return null;
// 		}
// 		var id = kNode._id;
// 		var kNodeForServer = patch ? patch : kNode.toServerCopy();
// 		if(Plugins.puzzles.knalledgeMap.config.services.QUEUE && false){
// 			KnalledgeMapQueue.execute({data: kNode, patch: patch, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"}); //TODO: support 'patch' in Queue
// 			//updatePlain: {method:'PUT', params:{type:'one', actionType:knalledge.KNode.UPDATE_TYPE_ALL, searchParam:''},
// 			return this.updatePlain({searchParam:id, type:'one', actionType:actionType}, kNodeForServer, function(nodeFromServer){
// 				// realtime distribution
// 				if(KnAllEdgeRealTimeService){
//
// 					// var change = new change.Change();
// 					// change.value = nodeFromServer;
// 					// change.valueBeforeChange = nodeFromServer;
// 					// change.reference = nodeFromServer._id;
// 					// change.type = puzzles.changes.ChangeType.STRUCTURAL;
// 					// change.action = actionType;
// 					// change.domain = puzzles.changes.Domain.NODE;
// 					// //TODO:
// 					// // change.mapId = null;
// 					// // change.iAmId = null;
// 					// change.visibility = ChangeVisibility.ALL;
// 					// change.phase = ChangePhase.UNDISPLAYED;
//
// 					var emitObject = {
// 						id: nodeFromServer._id,
// 						actionType: actionType,
// 						data: nodeFromServer,
// 						actionTime: nodeFromServer.updatedAt
// 					}
// 					KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName, emitObject);
// 					// var change = new
// 					// GlobalEmitterServicesArray.get(Plugins.puzzles.knalledgeMap.config.services.structuralChangeEventName).broadcast('KnalledgeMapVOsService', {'change_typ':changes,'event':eventName});
// 				}
// 				if(callback){callback(nodeFromServer);}
// 			});
//
// 		}
// 		else{
// 			var requestTime = new Date();
// 			return this.updatePlain({searchParam:id, type:'one', actionType:actionType}, kNodeForServer,
// 				function(nodeFromServer){
// 					var responseTime = new Date();
// 					//console.log("UPDATE: responseTime - requestTime:", (responseTime - requestTime));
// 					ChangeService.logRequestResponseTiming(responseTime - requestTime);
// 					// realtime distribution
// 					if(KnAllEdgeRealTimeService){
// 						var change = new puzzles.changes.Change();
// 						change.value = kNodeForServer;
// 						change.valueBeforeChange = null; //TODO
// 						change.reference = nodeFromServer._id;
// 						change.type = puzzles.changes.ChangeType.STRUCTURAL;
// 						change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName;
// 						change.action = actionType;
// 						change.domain = puzzles.changes.Domain.NODE;
// 						change.visibility = puzzles.changes.ChangeVisibility.ALL;
// 						change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;
//
// 						// var emitObject = {
// 						// 	id: nodeFromServer._id,
// 						// 	actionType: actionType,
// 						// 	data: nodeFromServer,
// 						// 	actionTime: nodeFromServer.updatedAt
// 						// }
// 						KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName, change);
// 					}
// 					if(callback){callback(nodeFromServer);}
// 				},
// 				function(error){
// 					//console.error('NODE: UPDATE: ',error,' for ',id,actionType,kNodeForServer);
// 					ChangeService.logActionLost({'type:': 'NODE: UPDATE', 'error': error, 'id':id, 'actionType' : actionType, 'kNodeForServer' : kNodeForServer});
// 				}
// 			);
// 		}
// 	};
//
// 	resource.destroy = function(id, callback)
// 	{
// 		var result = this.destroyPlain({actionType:'default', searchParam:id, type:'one'},
// 			function(){ //TODO: add error check
// 			// realtime distribution
// 			if(KnAllEdgeRealTimeService){
// 				var change = new puzzles.changes.Change();
// 				change.value = null;
// 				change.valueBeforeChange = null; //TODO
// 				change.reference = id;
// 				change.type = puzzles.changes.ChangeType.STRUCTURAL;
// 				change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName;
// 				// change.action = null;
// 				change.domain = puzzles.changes.Domain.NODE;
// 				change.visibility = puzzles.changes.ChangeVisibility.ALL;
// 				change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;
//
// 				KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName, change);//{'_id':id});
// 			}
// 			if(callback){callback()};
// 		},
// 		function(error){
// 			//console.error('NODE: DELETE: ',error,' for ',id,actionType,kNodeForServer);
// 			ChangeService.logActionLost({'type:': 'NODE: DELETE', 'error': error, 'id':id});
// 		}
// 	);
// 		return result;
// 	};
//
// 	resource.destroyByModificationSource = function(mapId, modificationSource, callback)
// 	{
// 		var result = this.destroyPlain({actionType:'default', searchParam:mapId, type:'by-modification-source'}, function(){
// 			// realtime distribution
// 			if(KnAllEdgeRealTimeService){
// 				KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodesDeletedEventName, {mapId: mapId});
// 			}
// 			if(callback){callback()};
// 		});
// 		return result;
// 	};
//
// 	resource.execute = function(request){ //example:: request = {data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}};
// 		// var kNode;
// 		switch(request.method){
// 		case 'create':
// 			//window.alert('create skipped ;)'); break;
// 			var kNodeForServer = request.data.toServerCopy();
// 			var kNodeReturn = request.data;
// 			var callback = request.callback;
//
// 			var requestTime = new Date();
//
// 			var node = resource.createPlain({
// 				//actionType:'default'
// 				}, kNodeForServer, function(nodeFromServer){
// 				var responseTime = new Date();
// 				//console.log("CREATE: responseTime - requestTime:", (responseTime - requestTime));
// 				ChangeService.logRequestResponseTiming(responseTime - requestTime);
// 				kNodeReturn.$resolved = node.$resolved;
// 				kNodeReturn.overrideFromServer(nodeFromServer);
// 				request.processing.RESOLVE(kNodeReturn);//kNodeReturn.resolve()
// 				if(callback) callback(kNodeReturn);
// 				KnalledgeMapQueue.executed(request);
//
// 				// realtime distribution
// 				if(KnAllEdgeRealTimeService){
// 					var change = new puzzles.changes.Change();
// 					change.value = kNodeReturn.toServerCopy();
// 					change.valueBeforeChange = null; //TODO
// 					change.reference = kNodeReturn._id;
// 					change.type = puzzles.changes.ChangeType.STRUCTURAL;
// 					change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeCreatedEventName;
// 					// change.action = null;
// 					change.domain = puzzles.changes.Domain.NODE;
// 					change.visibility = puzzles.changes.ChangeVisibility.ALL;
// 					change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;
//
// 					KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeCreatedEventName, change); //kNodeReturn.toServerCopy());
// 					// if(KnalledgeMapPolicyService.provider.config.broadcasting.enabled){
// 					// 		KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeSelectedEventName, kNodeReturn._id);
// 					// }
// 				}
// 			},
// 			function(error){
// 				//console.error('NODE: CREATE: ',error,' for ',kNodeForServer);
// 				ChangeService.logActionLost({'type:': 'NODE: CREATE', 'error': error, 'kNodeForServer' : kNodeForServer});
// 			});
//
// 			//createPlain manages promises for its returning value, in our case 'node', so we need to  set its promise to the value we return
// 			kNodeReturn.$promise = node.$promise;
// 			kNodeReturn.$resolved = node.$resolved;
//
// 			if(node.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
// 				kNodeReturn.overrideFromServer(node);
// 			}
// 			break;
// 		case 'update':
// 			//this.update;
// 			break;
// 		}
// 	};
//
// 	/* checks if request can be sent to server */
// 	resource.check = function(request){
// 		return true;
// 	};
//
// 	//KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});
//
// 	return resource;
//
// }]);
//
// }()); // end of 'use strict';
