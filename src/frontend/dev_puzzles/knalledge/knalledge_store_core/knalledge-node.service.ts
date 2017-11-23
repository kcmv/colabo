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
  getById(id:string, callback?:Function): Observable<KNode>
  {
    //TODO: check 'callback' support
    console.log('getById('+id+')');
    let url: string = this.apiUrl+'one/'+this.defaultAction+'/'+id;
    //url = 'http://localhost:8001/howAmIs/all/.json';
    //url = 'http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json';
    //url = 'http://localhost:8001/kedges/';
    console.log('url: '+url+')');
    //TODO: we cannot still use get<KNode>(url) because server returns the object as ServerData
    let result:Observable<KNode> = this.http.get<ServerData>(url)
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
  queryInMap(id:string, callback?:Function): Observable<KNode[]>
  {
    //TODO: check 'callback' support
    function processNodes(nodesS):Array<KNode>{
      console.log("processNodes");
      let nodes:Array<KNode> = nodesS.data as Array<KNode>;
      for(let id=0; id<nodes.length; id++){
        //TODO: will not be needed when/if we get rid of ServerData wrapping needed now, because the response from server will be typed to KNode unlike in previous versions
        let kNode:KNode = KNode.factory(nodes[id]);
        kNode.state = KNode.STATE_SYNCED;
        console.log(kNode);
        nodes[id] = kNode;
      }
      return nodes;
    }

    let result:Observable<KNode[]> = this.http.get<ServerData>(this.apiUrl+'in_map/'+this.defaultAction+'/'+id)
      .pipe(
        map(nodesFromServer => processNodes(nodesFromServer)),
        catchError(this.handleError('KnalledgeNodeService::queryInMap', null))
      );

    if(callback){result.subscribe(nodes => callback(nodes));}
    return result; //returnPromise ? result.toPromise() : result;
  }

  create(kNode:KNode, callback?:Function): Observable<KNode>
  {
    //TODO:NG2 check 'callback' support
    //another callback approach: map(nodeS => {if(callback) {callback(nodeS)}}), //TODO:NG2 Test if this callback call works
  	console.log("KnalledgeNodeService.create");
    let result: Observable<KNode> = null;

		if(false) // TODO:NG2: if(Plugins.puzzles.knalledgeMap.config.services.QUEUE)
    {
			// kNode.$promise = null;
			// kNode.$resolved = false;
      //
			// kNode.$promise = $q(function(resolve, reject) {
			// 	KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			// });
		}
		else{
			let kNodeForServer:any = kNode.toServerCopy();
			//we return kNode:kNode, because 'node' is of type 'Resource

      /*
      TODO:NG2: in the line
        `result = this.http.post<KNode>(this.apiUrl, kNodeForServer, httpOptions)`
      we had to replace Genric type stting <KNode> with <ServerData> because it defines the return valuse
      (and probably the posted value), becasuse server returns the `ServerData` object
      */
      result = this.http.post<ServerData>(this.apiUrl, kNodeForServer, httpOptions)
      .pipe(
        //tap((nodeS: KNode) => console.log(`CREATED 'node'${nodeS}`)), // not needed - it's just for logging
        map(nodeS => this.extractVO<KNode>(nodeS,KNode)), //the sever returns `ServerData` object
        catchError(this.handleError<KNode>('KnalledgeNodeService::create'))
      );

      // addHero (hero: Hero): Observable<Hero> {
      //   return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      //     tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      //     catchError(this.handleError<Hero>('addHero'))
      //   );
      // }
      //
			// let node = this.createPlain({
			// 	//actionType:'default'
			// 	}, kNodeForServer, function(nodeFromServer){
			// 	kNode.$resolved = node.$resolved;
			// 	kNode.overrideFromServer(nodeFromServer);
			// 	if(callback) callback(kNode);
			// });
      //
			// //createPlain manages promises for its returning value, in our case 'node', so we need to  set its promise to the value we return
			// kNode.$promise = node.$promise;
			// kNode.$resolved = node.$resolved;
      //
			// if(node.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
			// 	kNode.overrideFromServer(node);
			// }
		}
		//we return this value to caller as a dirty one, and then set its value to nodeFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
    if(callback){result.subscribe(nodes => callback(nodes));}
  	return result;
  }

  /**
    deletes the KNode from the server
    In server's response, the ServerData.data is equal to the _id of the deleted VO.  ServerData.data will be equal to null, if there is no data we intended to delete. In both cases `ServerData.success` will be eq `true`
    URL:http://localhost:8001/knodes/one/default/5a156965d0b7970f365e1a4b.json
  */
  destroy(id:string, callback?:Function): Observable<boolean>
	{
      //TODO:NG2 fix usage of this function to expect boolean
    var result:Observable<boolean> = this.http.delete<ServerData>(this.apiUrl+'one/'+this.defaultAction+'/'+id, httpOptions).pipe(
      tap(_ => console.log(`deleted hero id=${id}`)),
      map(serverData => serverData.success),
      catchError(this.handleError<boolean>('deleteHero'))
    );

		if(this.knAllEdgeRealTimeService){ // realtime distribution
      // //TODO:NG2
			// let change = new puzzles.changes.Change();
			// change.value = null;
			// change.valueBeforeChange = null; //TODO
			// change.reference = id;
			// change.type = puzzles.changes.ChangeType.STRUCTURAL;
			// change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName;
			// // change.action = null;
			// change.domain = puzzles.changes.Domain.NODE;
			// change.visibility = puzzles.changes.ChangeVisibility.ALL;
			// change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;
      //
			// this.knAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName, change);//{'_id':id});
		}
    if(callback){result.subscribe(success => callback(success));}
		return result;
	}

  //KnalledgeNodeService.update(node, actionType, patch, callback)


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
// let Plugins = window.Config.Plugins;
//
// let knalledgeMapServices = angular.module('knalledgeMapServices');
//
// /**
// * @class KnalledgeNodeService
// * @memberof knalledge.knalledgeMap.knalledgeMapServices
// */
//
// knalledgeMapServices.factory('KnalledgeNodeService', ['$injector', '$resource', '$q', 'Plugins', 'ENV', 'KnalledgeMapQueue', 'ChangeService',
// function($injector, $resource, $q, Plugins, ENV, KnalledgeMapQueue, ChangeService){
// 	try{
// 		let KnAllEdgeRealTimeService = Plugins.puzzles.knalledgeMap.config.knAllEdgeRealTimeService.available ?
// 			$injector.get('KnAllEdgeRealTimeService') : null;
// 	}catch(err){
// 		console.warn("Error while trying to retrieve the KnAllEdgeRealTimeService service:", err);
// 	}
//
// 	console.log("[knalledgeMapServices] server backend: %s", ENV.server.backend);
// 	// creationId is parameter that will be replaced with real value during the service call from controller
// 	let url = ENV.server.backend + '/knodes/:type/:actionType/:searchParam/:searchParam2.json';
// 	let resource = $resource(url, {}, {
// 		// extending the query action
// 		// method has to be defined
// 		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
// 		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
// 		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
// 			// interceptor : {responseError : resourceErrorHandler, requestError : resourceErrorHandler},
// 			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
// 			let serverResponse;
// 			if(ENV.server.parseResponse){
// 				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				// console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 				// console.log("[knalledgeMapServices] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
// 				let data = knalledge.KNode.factory(serverResponse.data[0]);
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
// 			let serverResponse;
// 			if(ENV.server.parseResponse){
// 				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				// console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 				// console.log("[KnalledgeNodeService] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 				/* there is no use of transforming it to VO here, because it is transformed back to Resource by this method, so we do it in wrapper func that calls this one:
// 				let data = serverResponse.data;
// 				let VOs = [];
// 				for(let datumId in serverResponse.data){
// 					let VO = knalledge.KNode.factory(data[datumId]);
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
// 			let serverResponse;
// 			if(ENV.server.parseResponse){
// 				serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 				serverResponse = JSON.parse(serverResponseNonParsed);
// 				//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 				console.log("[ng-KnalledgeNodeService::createPlain] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 				let data = serverResponse ? serverResponse.data : null;
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
// 				let serverResponse;
// 				if(ENV.server.parseResponse){
// 					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 					serverResponse = JSON.parse(serverResponseNonParsed);
// 					if(serverResponse != null){
// 						//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 						console.log("[KnalledgeNodeService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 						let data = serverResponse ? serverResponse.data : null;
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
// 				let serverResponse;
// 				if(ENV.server.parseResponse){
// 					serverResponseNonParsed = Plugins.puzzles.knalledgeMap.config.services.removeJsonProtected(ENV, serverResponseNonParsed);
// 					serverResponse = JSON.parse(serverResponseNonParsed);
// 					//console.log("[KnalledgeNodeService] serverResponse: %s", JSON.stringify(serverResponse));
// 					console.log("[KnalledgeNodeService:create] accessId: %s", (serverResponse ? serverResponse.accessId : 'serverResponse undefined'));
// 					let data = serverResponse ? serverResponse.data : null;
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
// 		let data = {
// 			$promise: null,
// 			$resolved: false
// 		};
//
// 		data.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
// 			let jsonUrl = ENV.server.backend + "/sample-small.json";
// 			$.getJSON(jsonUrl, null, function(jsonContent){
// 				console.log("Loaded: %s, map (nodes: %d, edges: %d)", jsonUrl,
// 				jsonContent.map.nodes.length, jsonContent.map.edges.length);
// 				for(let id in jsonContent){
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
// 		let node = this.getPlain({actionType:'default', searchParam:id, type:'one' }, callback);
// 		return node;
// 	};
//
// 	resource.queryInMap = function(id, callback)
// 	{
// 		let nodes = this.queryPlain({ actionType:'default', searchParam:id, type:'in_map' }, function(nodesFromServer){
// 			for(let id=0; id<nodesFromServer.length; id++){
// 				let kNode = knalledge.KNode.factory(nodesFromServer[id]);
// 				kNode.state = knalledge.KNode.STATE_SYNCED;
// 				nodesFromServer[id] = kNode;
// 			}
//
// 			if(callback) callback(nodesFromServer);
// 		});
// 		// for(let i in nodes){
// 		// 	//TODO fix nodes.state, etc
// 		// }
// 		return nodes;
// 	};
//
// 	resource.getInMapNodesOfType = function(mapId, kNodeType, callback){
// 		let nodes = this.queryPlain({ actionType:'default', searchParam:mapId, type:'in_map', searchParam2:kNodeType  }, function(nodesFromServer){
// 			for(let id=0; id<nodesFromServer.length; id++){
// 				let kNode = knalledge.KNode.factory(nodesFromServer[id]);
// 				kNode.state = knalledge.KNode.STATE_SYNCED;
// 				nodesFromServer[id] = kNode;
// 			}
//
// 			if(callback) callback(nodesFromServer);
// 		});
// 		// for(let i in nodes){
// 		// 	//TODO fix nodes.state, etc
// 		// }
// 		return nodes;
// 	};
//
//
// 	resource.update = function(kNode, actionType, patch, callback)
// 	{
//
// 		console.log("resource.update");
// 		if(kNode.state == knalledge.KNode.STATE_LOCAL){//TODO: fix it by going throgh queue
// 			window.alert("Please, wait while entity is being saved, before updating it:\n"+kNode.name);
// 			return null;
// 		}
// 		let id = kNode._id;
// 		let kNodeForServer = patch ? patch : kNode.toServerCopy();
// 		if(Plugins.puzzles.knalledgeMap.config.services.QUEUE && false){
// 			KnalledgeMapQueue.execute({data: kNode, patch: patch, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"}); //TODO: support 'patch' in Queue
// 			//updatePlain: {method:'PUT', params:{type:'one', actionType:knalledge.KNode.UPDATE_TYPE_ALL, searchParam:''},
// 			return this.updatePlain({searchParam:id, type:'one', actionType:actionType}, kNodeForServer, function(nodeFromServer){
// 				// realtime distribution
// 				if(KnAllEdgeRealTimeService){
//
// 					// let change = new change.Change();
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
// 					let emitObject = {
// 						id: nodeFromServer._id,
// 						actionType: actionType,
// 						data: nodeFromServer,
// 						actionTime: nodeFromServer.updatedAt
// 					}
// 					KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName, emitObject);
// 					// let change = new
// 					// GlobalEmitterServicesArray.get(Plugins.puzzles.knalledgeMap.config.services.structuralChangeEventName).broadcast('KnalledgeMapVOsService', {'change_typ':changes,'event':eventName});
// 				}
// 				if(callback){callback(nodeFromServer);}
// 			});
//
// 		}
// 		else{
// 			let requestTime = new Date();
// 			return this.updatePlain({searchParam:id, type:'one', actionType:actionType}, kNodeForServer,
// 				function(nodeFromServer){
// 					let responseTime = new Date();
// 					//console.log("UPDATE: responseTime - requestTime:", (responseTime - requestTime));
// 					ChangeService.logRequestResponseTiming(responseTime - requestTime);
// 					// realtime distribution
// 					if(KnAllEdgeRealTimeService){
// 						let change = new puzzles.changes.Change();
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
// 						// let emitObject = {
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

//
// 	resource.destroyByModificationSource = function(mapId, modificationSource, callback)
// 	{
// 		let result = this.destroyPlain({actionType:'default', searchParam:mapId, type:'by-modification-source'}, function(){
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
// 		// let kNode;
// 		switch(request.method){
// 		case 'create':
// 			//window.alert('create skipped ;)'); break;
// 			let kNodeForServer = request.data.toServerCopy();
// 			let kNodeReturn = request.data;
// 			let callback = request.callback;
//
// 			let requestTime = new Date();
//
// 			let node = resource.createPlain({
// 				//actionType:'default'
// 				}, kNodeForServer, function(nodeFromServer){
// 				let responseTime = new Date();
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
// 					let change = new puzzles.changes.Change();
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
