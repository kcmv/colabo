import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {VO} from '@colabo-knalledge/knalledge_core/code/knalledge/VO';
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

  static UPDATE_NODE_NAME_FINAL:string = 'UPDATE_NODE_NAME_FINAL';
  static UPDATE_NODE_NAME:string = 'UPDATE_NODE_NAME';

	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
    //private ENV = undefined
  ){
    super();
    console.log('KnalledgeNodeService:constructor'); //TODO:NG2: this.apiUrl = this.ENV.server.backend + '/' + nodeAP + '/';
    this.apiUrl = CFService.serverAP + '/' + nodeAP + '/';
  }

  /**
   * Get an KN Node from the server by its id
   * @param {string} id id of the node
   * @param {function} callback Function to be called when the node is retrieved
   * @returns {Observable<KNode>} the retreived node
   */
  getById(id:string, callback?:Function): Observable<KNode>
  {
    console.log('getById('+id+')');
    let url: string = this.apiUrl+'one/'+this.defaultAction+'/'+id;
    let result:Observable<KNode> = this.http.get<ServerData>(url)
      .pipe(
        map(node => this.extractVO<KNode>(node,KNode)),
        catchError(this.handleError('KnalledgeNodeService::getById', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(node => callback(node));}
    return result;
  }

  /**
   * Gets from the server all the KN Nodes that are contained in the map
   * @param {string} id id of the map
   * @param {function} callback Function to be called when the nodes are retrieved
   * @returns {Observable<KNode[]>} array of the nodes
     @example http://localhost:8001/knodes/in_map/default/579811d88e12abfa556f6b59.json
   */
  queryInMap(mapId:string, callback?:Function): Observable<KNode[]>
  {
    let result:Observable<KNode[]> = this.http.get<ServerData>(this.apiUrl+'in_map/'+this.defaultAction+'/'+mapId)
      .pipe(
        map(nodesFromServer => CFService.processVOs(nodesFromServer, KNode)),
        catchError(this.handleError('KnalledgeNodeService::queryInMap', null))
      );

    if(callback){result.subscribe(nodes => callback(nodes));}
    return result;
  }

  /**
   * Gets from the server all the KN Nodes that are contained in the map
   * @param {string} mapId id of the map
   * @param {function} callback Function to be called when the nodes are retrieved
   * @returns {Observable<KNode[]>} array of the nodes
     @example http://localhost:8001/knodes/in_map/default/579811d88e12abfa556f6b59.json
   */
  queryInMapofType(mapId:string, type:string, callback?:Function): Observable<KNode[]>
  {
    let result:Observable<KNode[]> = this.http.get<ServerData>(this.apiUrl+'in_map_of_type/'+this.defaultAction+'/'+mapId+'/'+type+'.json')
      .pipe(
        map(nodesFromServer => CFService.processVOs(nodesFromServer, KNode)),
        catchError(this.handleError('KnalledgeNodeService::queryInMap', null))
      );

    if(callback){result.subscribe(nodes => callback(nodes));}
    return result;
  }

  /**
   * Creates the provided node on the server and returns its server-updated appearance
   * @param {KNode} kNode the pre-populated node to be created on the server
   * @param {function} callback Function to be called when the node is created
   * @returns {Observable<KNode>} the created node (now with the id and other specific data allocated to it by server, so the caller should fill the original node with it)
     @example http://localhost:8001/knodes/in_map/default/579811d88e12abfa556f6b59.json
   */
  create(kNode:KNode, callback?:Function): Observable<KNode>
  {
  	console.log("KnalledgeNodeService.create");
    let result: Observable<KNode> = null;

		if(false) // TODO:NG2: if(Plugins.puzzles.knalledgeMap.config.services.QUEUE)
    {
			/*
      kNode.$promise = null;
			kNode.$resolved = false;

			kNode.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
      */
		}
		else{
			let kNodeForServer:any = kNode.toServerCopy();

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

      /* TODO:NG2 : remain of the NG1 Promise code to be integrated:
			let node = this.createPlain({
				//actionType:'default'
				}, kNodeForServer, function(nodeFromServer){
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
      */
		}
		//we return this value to caller as a dirty one, and then set its value to nodeFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
    if(callback){result.subscribe(nodes => callback(nodes));}
  	return result;
  }

  /**
  * Deletes the KNode from the server
  * In server's response, the ServerData.data is equal to the _id of the deleted VO.  ServerData.data will be equal to null, if there is no data we intended to delete. In both cases `ServerData.success` will be eq `true`
  * @param {string} id id of the node to be deleted
  * @param {function} callback Function to be called when the node is deleted
  * @example URL:http://localhost:8001/knodes/one/default/5a156965d0b7970f365e1a4b.json
  */
  destroy(id:string, callback?:Function): Observable<boolean>
	{
    //TODO:NG2 fix usage of this function to expect boolean
    var result:Observable<boolean> = this.http.delete<ServerData>(this.apiUrl+'one/'+this.defaultAction+'/'+id, httpOptions).pipe(
      tap(_ => console.log(`deleted node id=${id}`)),
      map(serverData => serverData.success),
      catchError(this.handleError<boolean>('deleteHero'))
    );

		/* TODO:NG2
      if(this.knAllEdgeRealTimeService){ // realtime distribution
      //
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
		}*/

    if(callback){result.subscribe(success => callback(success));}
		return result;
	}

  destroyByTypeByUser(type:string, iAmid:string, callback?:Function): Observable<boolean>
	{
    //TODO:NG2 fix usage of this function to expect boolean
    var result:Observable<boolean> = this.http.delete<ServerData>(this.apiUrl+'by-type-n-user/'+type+'/'+iAmid +'.json', httpOptions).pipe(
      tap(_ => console.log(`deleted nodes type=${type} and iAmid=${iAmid}`)),
      map(serverData => serverData.success),
      catchError(this.handleError<boolean>('destroyByTypeByUser'))
    );

		/* TODO:NG2
      if(this.knAllEdgeRealTimeService){ // realtime distribution
      //
			// let change = new puzzles.changes.Change();
			// change.value = null;
			// change.valueBeforeChange = null; //TODO
			// change.reference = id;
			// change.type = puzzles.changes.ChangeType.STRUCTURAL;
			// change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeDeletedEventName;
			// // change.action = null;
			// change.domain = puzzles.changes.Domain.NODE;
			// change.visibility = puzzles.changes.ChangeVisibility.ALL;
			// change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;
      //
			// this.knAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeDeletedEventName, change);//{'_id':id});
		}*/

    if(callback){result.subscribe(success => callback(success));}
		return result;
	}

  /**
   * Updates the provided node on the server and returns its server-updated appearance
   * @param {KNode} kNode the pre-populated node to update the content of the existing node on the server
   * @param {string} actionType type of the update action (e.g. UPDATE_NODE_NAME_FINAL, UPDATE_NODE_NAME)
   * @param {any} patch if we provide null here, the `kNode` param is used, but if we provide here an object, it will be patched 'over' the existing node on the server
   * @param {function} callback Function to be called when the node is updated
   * @returns {Observable<KNode>} the updated node (now with some specific data updated by the server, so the caller should fill the original node with it)
    @example URLs: http://localhost:8001/knodes/one/UPDATE_NODE_NAME/5a156935d0b7970f365e1a42.json
    http://localhost:8001/knodes/one/UPDATE_NODE_NAME_FINAL/5a156935d0b7970f365e1a42.json
  */
  update(kNode:KNode, actionType:string, patch:any, callback?:Function): Observable<KNode>
	{
    function updateResponse(nodeFromServer){
      let responseTime = new Date();
      /* TODO:NG2:

      !! IMPORTANT: this method contains a LOT OF COMMENTED OLD CODE that will be migrated to the new version. You can avoid it in your usage for now

      //console.log("UPDATE: responseTime - requestTime:", (responseTime - requestTime));
      ChangeService.logRequestResponseTiming(responseTime - requestTime);
      // realtime distribution
      if(this.nAllEdgeRealTimeService){

        let change = new puzzles.changes.Change();
        change.value = kNodeForServer;
        change.valueBeforeChange = null; //TODO
        change.reference = nodeFromServer._id;
        change.type = puzzles.changes.ChangeType.STRUCTURAL;
        change.event = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName;
        change.action = actionType;
        change.domain = puzzles.changes.Domain.NODE;
        change.visibility = puzzles.changes.ChangeVisibility.ALL;
        change.phase = puzzles.changes.ChangePhase.UNDISPLAYED;

        // let emitObject = {
        // 	id: nodeFromServer._id,
        // 	actionType: actionType,
        // 	data: nodeFromServer,
        // 	actionTime: nodeFromServer.updatedAt
        // }
        KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName, change);
      }
      if(callback){callback(nodeFromServer);}
      */
    }

    let result:Observable<KNode> = null;
    let id = kNode._id;
    let kNodeForServer:any = patch ? patch : kNode.toServerCopy();
    actionType = actionType !== null ? actionType : KnalledgeNodeService.UPDATE_NODE_NAME_FINAL;
		//console.log("KnalledgeNodeService.update");

		if(kNode.state == VO.STATE_LOCAL){//TODO: fix it by going throgh queue
			window.alert(`Please, wait while the entity '${kNode.name}' is being saved, before updating it`);
      //TODO: we should move this UI code out of the service logics
		}
    else{
  		/*TODO:NG2: it was: if(Plugins.puzzles.knalledgeMap.config.services.QUEUE && false)

  			KnalledgeMapQueue.execute({data: kNode, patch: patch, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"}); //TODO: support 'patch' in Queue
  			//updatePlain: {method:'PUT', params:{type:'one', actionType:knalledge.KNode.UPDATE_TYPE_ALL, searchParam:''},
  			return this.updatePlain({searchParam:id, type:'one', actionType:actionType}, kNodeForServer, function(nodeFromServer){
  				// realtime distribution
  				if(this.knAllEdgeRealTimeService){

  					// let change = new change.Change();
  					// change.value = nodeFromServer;
  					// change.valueBeforeChange = nodeFromServer;
  					// change.reference = nodeFromServer._id;
  					// change.type = puzzles.changes.ChangeType.STRUCTURAL;
  					// change.action = actionType;
  					// change.domain = puzzles.changes.Domain.NODE;
  					// //TODO:
  					// // change.mapId = null;
  					// // change.iAmId = null;
  					// change.visibility = ChangeVisibility.ALL;
  					// change.phase = ChangePhase.UNDISPLAYED;

  					let emitObject = {
  						id: nodeFromServer._id,
  						actionType: actionType,
  						data: nodeFromServer,
  						actionTime: nodeFromServer.updatedAt
  					}
  					KnAllEdgeRealTimeService.emit(Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName, emitObject);
  					// let change = new
  					// GlobalEmittersArrayService.get(Plugins.puzzles.knalledgeMap.config.services.structuralChangeEventName).broadcast('KnalledgeMapVOsService', {'change_typ':changes,'event':eventName});
  				}
  				if(callback){callback(nodeFromServer);}
  			});

  		}
  		else{

  		let requestTime:Date = new Date();
      */

      result = this.http.put<ServerData>(this.apiUrl+'one/'+actionType+'/'+id, kNodeForServer, httpOptions).pipe(
        tap(_ => console.log(`updated kNode id=${kNodeForServer._id}`)),
        map(nodeS => this.extractVO<KNode>(nodeS,KNode)), //the sever returns `ServerData` object
        catchError(this.handleError<any>('update'))
      );
				/* TODO:NG2:
        // function(error){
				// 	//console.error('NODE: UPDATE: ',error,' for ',id,actionType,kNodeForServer);
				// 	ChangeService.logActionLost({'type:': 'NODE: UPDATE', 'error': error, 'id':id, 'actionType' : actionType, 'kNodeForServer' : kNodeForServer});
				// }
			  // );
  		}
      */
  	}
    return result;
  }

}

//TODO: NG2: migrate here the remaining methods from the old NG1 JS NodeService
