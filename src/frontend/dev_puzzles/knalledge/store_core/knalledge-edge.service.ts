import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {ServerData} from '@colabo-knalledge/f-store_core/ServerData';
import {CFService} from './cf.service';
import { UtilsNotificationService, NotificationMsgType, NotificationMsg } from '@colabo-utils/f-notifications';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const edgeAP = "kedges";
const serverAP = "http://127.0.0.1:8001";

@Injectable()
export class KnalledgeEdgeService extends CFService{

  //http://api.colabo.space/kedges/
  // "http://127.0.0.1:888/kedges/";
  private apiUrl: string;
  //private defaultAction:string = 'default'; not used here - only for nodes is used

	private knalledgeMapQueue:any = null;
	private knAllEdgeRealTimeService:any = null;

	constructor(
    private http: HttpClient,
    utilsNotificationService: UtilsNotificationService
    //@Inject('ENV') private ENV
  ){
    super(utilsNotificationService);
    console.log('KnalledgeEdgeService:: constructor NG 4.++');
    this.apiUrl = CFService.serverAP + '/' + edgeAP + '/'; //TODO:NG2: this.apiUrl = this.ENV.server.backend + '/' + edgeAP + '/';
  }

  /**
   * Gets an KN Edge from the server by its id
   * @param {string} id id of the edge
   * @param {function} callback Function to be called when the edge is retrieved
   * @returns {Observable<KEdge>} retreived edge
   */
  getById(id:string, callback?:Function): Observable<KEdge>
  {
    console.log('getById('+id+')');
    var url: string = this.apiUrl+'one/'+id;
    var result:Observable<KEdge> = this.http.get<ServerData>(url)
      .pipe(
        map(edge => this.extractVO<KEdge>(edge,KEdge)),
        catchError(this.handleError('KnalledgeEdgeService::getById', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(edge => callback(edge));}
    return result;
  }

  /**
   * Gets from the server all the KN Edges that are contained in the map
   * @param {string} id id of the map
   * @param {function} callback Function to be called when the edges are retrieved
   * @returns {Observable<KEdge[]>} array of the edges
     @example URL: http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json
   */
  queryInMap(id:string, callback?:Function): Observable<KEdge[]>
  {
    var result:Observable<KEdge[]> = this.http.get<ServerData>(this.apiUrl+'in_map/'+id)
      .pipe(
        map(edgesFromServer => CFService.processVOs(edgesFromServer, KEdge)),
        catchError(this.handleError('KnalledgeEdgeService::queryInMap', null))
      );

    if(callback){result.subscribe(edges => callback(edges));}
    return result;
  }


  /**
   * Gets from the server all the KN Edges that are contained in the map
   * @param {string} id id of the map
   * @param {function} callback Function to be called when the edges are retrieved
   * @returns {Observable<KEdge[]>} array of the edges
     @example URL: http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json
   */
  queryForMapTypeUserWTargetNodes(mapId:string, type:string, iAmid:string=null): Observable<KEdge[]>
  {
    var result:Observable<KEdge[]> = this.http.get<ServerData>(this.apiUrl+'for_map_type_user_w_target_nodes/'+mapId+'/'+type+'/'+iAmid+'.json')
      .pipe(
        map(edgesFromServer => CFService.processVOs(edgesFromServer, KEdge)),
        catchError(this.handleError('KnalledgeEdgeService::queryInMap', null))
      );
    return result;
  }

  /**
   * Creates the provided edge on the server and returns its server-updated appearance
   * @param {KEdge} kEdge the pre-populated edge to be created on the server
   * @param {function} callback Function to be called when the edge is created
   * @returns {Observable<KEdge>} the created edge (now with the id and other specific data allocated to it by server, so the caller should fill the original edge with it)
     @example http://localhost:8001/kedges/in_map/default/579811d88e12abfa556f6b59.json
   */
  create(kEdge:KEdge, callback?:Function): Observable<KEdge>
  {
  	//console.log("KnalledgeEdgeService.create");
    let result: Observable<KEdge> = null;

		if(false) // TODO:NG2: if(Plugins.puzzles.knalledgeMap.config.services.QUEUE)
    {
			/*
      kEdge.$promise = null;
			kEdge.$resolved = false;

			kEdge.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: kEdge, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
      */
		}
		else{
			let kEdgeForServer:any = kEdge.toServerCopy();

      /*
      TODO:NG2: in the line
        `result = this.http.post<KEdge>(this.apiUrl, kEdgeForServer, httpOptions)`
      we had to replace Genric type stting <KEdge> with <ServerData> because it defines the return valuse
      (and probably the posted value), becasuse server returns the `ServerData` object
      */
      result = this.http.post<ServerData>(this.apiUrl, kEdgeForServer, httpOptions)
      .pipe(
        //tap((edgeS: KEdge) => console.log(`CREATED 'edge'${edgeS}`)), // not needed - it's just for logging
        map(edgeS => this.extractVO<KEdge>(edgeS,KEdge)), //the sever returns `ServerData` object
        catchError(this.handleError<KEdge>('KnalledgeEdgeService::create'))
      );

      /* TODO:NG2 : remain of the NG1 Promise code to be integrated:
			let edge = this.createPlain({
				//actionType:'default'
      }, kEdgeForServer, function(edgeFromServer){
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
      */
		}
		//we return this value to caller as a dirty one, and then set its value to edgeFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
    if(callback){result.subscribe(edges => callback(edges));}
  	return result;
  }

  /**
  * Deletes the KEdge from the server
  * In server's response, the ServerData.data is equal to the _id of the deleted VO.  ServerData.data will be equal to null, if there is no data we intended to delete. In both cases `ServerData.success` will be eq `true`
  * @param {string} id id of the edge to be deleted
  * @param {function} callback Function to be called when the edge is deleted
  * @example URL:http://localhost:8001/kedges/one/default/5a156965d0b7970f365e1a4b.json
  */
  destroy(id:string, callback?:Function): Observable<boolean>
	{
    //TODO:NG2 fix usage of this function to expect boolean
    var result:Observable<boolean> = this.http.delete<ServerData>(this.apiUrl+'one/'+id, httpOptions).pipe(
      tap(_ => console.log(`deleted edge id=${id}`)),
      map(serverData => serverData.success),
      catchError(this.handleError<boolean>('destroy'))
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

  destroyByTypeByUser(type:string, iAmid:string, callback?:Function): Observable<boolean>
	{
    //TODO:NG2 fix usage of this function to expect boolean
    var result:Observable<boolean> = this.http.delete<ServerData>(this.apiUrl+'by-type-n-user/'+type+'/'+iAmid, httpOptions).pipe(
      tap(_ => console.log(`deleted edges type=${type} and iAmid=${iAmid}`)),
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
  

  destroyEdgesToChild(targetId:string): Observable<boolean>
	{
    //TODO:NG2 fix usage of this function to expect boolean
    var result:Observable<boolean> = this.http.delete<ServerData>(this.apiUrl+'edges-to-child/'+targetId, httpOptions).pipe(
      // tap(_ => console.log(`deleted edges type=${type} and iAmid=${iAmid}`)),
      map(serverData => serverData.success),
      catchError(this.handleError<boolean>('destroyEdgeToChild'))
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
		return result;
	}


  /*
  TODO:
  When needed, we could develop these functions that are already supported on backend:

  //gets all edges between 2 specific nodes:
  queryBetween(sourceId:string, targetId:string, callback?:Function)
  {
    // return this.queryPlain({ searchParam:id, type:'between' }, callback);
  }

  //gets all edges connected to the specifi node (with the provided id) (both those edges whose it's source node and those whose this is a target node)
  // @example URL: URL:http://localhost:8001/kedges/connected/5a156965d0b7970f365e1a4b.json
  queryConnected(id:string, callback?:Function)
  {
    // return this.queryPlain({ searchParam:id, type:'connected' }, callback);
  }

  //destroys all the edges connected to the specific node
  //destroyConnected(id:string)
  {

  }
  */
}
