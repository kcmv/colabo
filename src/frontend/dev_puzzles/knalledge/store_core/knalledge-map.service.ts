/* CRUD Service for mapVO paired with kmap backend
 old NG2 pair: src/frontend/app/components/knalledgeMap/js/services/knalledgeMapService.js
 */

import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { KMap } from "@colabo-knalledge/f-core/code/knalledge/kMap";
import { ServerData } from "@colabo-knalledge/f-store_core/ServerData";
import { CFService } from "./cf.service";
import { ServerError } from "./server-errors";

import {
  UtilsNotificationService,
  NotificationMsgType,
  NotificationMsg
} from "@colabo-utils/f-notifications";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

const mapAP = "kmaps";

@Injectable()
export class KnalledgeMapService extends CFService {
  //http://api.colabo.space/kmaps/
  // "http://127.0.0.1:888/kmaps/";
  private apiUrl: string;

  private knalledgeMapQueue: any = null;
  private knAllEdgeRealTimeService: any = null;

  constructor(
    private http: HttpClient,
    private rimaAAAService: RimaAAAService,
    utilsNotificationService: UtilsNotificationService
    //@Inject('ENV') private ENV
  ) {
    super(utilsNotificationService);
    console.log("KnalledgeMapService:constructor");
    //this.apiUrl = this.ENV.server.backend + '/' + mapAP + '/';
    this.apiUrl = CFService.serverAP + "/" + mapAP + "/";
  }

  /**
   * Gets an KN Map from the server by its id
   * @param {string} id id of the map
   * @param {function} callback Function to be called when the map is retrieved
   * @returns {Observable<KMap>} retreived map
   * @example: http://localhost:8001/kmaps/one/56e8b66b913d88af03e9d17f.json
   */
  getById(id: string, callback?: Function): Observable<KMap> {
    console.log("KnalledgeMapService::getById(" + id + ")");
    let url: string = this.apiUrl + "one/" + id;
    let result: Observable<KMap> = this.http.get<ServerData>(url).pipe(
      map(map => this.extractVO<KMap>(map, KMap)),
      catchError(this.handleError("KnalledgeMapService::getById", null))
    );
    console.log("result:");
    console.log(result);
    if (callback) {
      result.subscribe(map => callback(map));
    }
    return result;
  }

  /**
   * Gets all KN Maps from the server that have a specific name
   * @param {string} name name of the map
   * @param {function} callback Function to be called when the map is retrieved
   * @returns {Observable<KMap[]>} array of maps retreived (there could be multiple maps with the same name)
   * @example: http://localhost:8001/kmaps/by-name/Demo%20Map.json
   */
  getByName(name: string, callback?: Function): Observable<KMap[]> {
    console.log("KnalledgeMapService::getByName(" + name + ")");
    let url: string = this.apiUrl + "by-name/" + name;

    let result: Observable<KMap[]> = this.http.get<ServerData>(url).pipe(
      map(mapsFromServer => CFService.processVOs(mapsFromServer, KMap)),
      catchError(this.handleError("KnalledgeMapService::getByName", null))
    );
    console.log("result:");
    console.log(result);
    if (callback) {
      result.subscribe(maps => callback(maps));
    }
    return result;
  }

  getMaps(): Observable<KMap[]> {
    console.log("KnalledgeMapService::getMaps");

    let url: string =
      this.apiUrl + (this.rimaAAAService.isAdmin() ? "all/" : "by-participant"); //this.apiUrl+'in_map/'+this.defaultAction+'/'+mapId

    let result: Observable<KMap[]> = this.http.get<ServerData>(url).pipe(
      map(mapsFromServer => CFService.processVOs(mapsFromServer, KMap)),
      catchError(this.handleError("KnalledgeMapService::getMaps", null))
    );
    console.log("result", result);

    return result;
  }

  /**
   * Gets all KN Map from the server that are accessible to the participant (both public ones and his private ones)
   * @param {string} participantId participant's id
   * @param {function} callback Function to be called when the map is retrieved
   * @returns {Observable<KMap[]>} array of maps retreived
   * @example: http://localhost:8001/kmaps/by-participant/556760847125996dc1a4a24f.json
   */
  queryByParticipant(
    participantId: string,
    callback?: Function
  ): Observable<KMap[]> {
    //TODO:
    var result: Observable<KMap[]> = null;
    // 	if(participantId === null){
    // 		window.alert("You're not logged in. Until you login, you will only see public maps");
    // 	}else{
    // 		if(typeof participantId !== 'string'){
    // 			console.error("[queryByParticipant] participantId:", participantId);
    // 			window.alert("Error in acessing your profile. Please try again or re-login");
    // 			if(callback) callback(null, 'participantId not a string');
    // 			return;
    // 		}
    // 	}
    // 	var maps = this.queryPlain({type:'by-participant', searchParam: participantId}, function(mapsFromServer){
    // 		for(var id=0; id<mapsFromServer.length; id++){
    // 			var kMap = knalledge.KMap.factory(mapsFromServer[id]);
    // 			kMap.state = knalledge.KMap.STATE_SYNCED;
    // 			mapsFromServer[id] = kMap;
    // 		}
    // 		if(callback) callback(mapsFromServer);
    // 	});
    // 	// for(var i in maps){
    // 	// 	//TODO fix maps.state, etc
    // 	// }
    return result;
  }

  /**
   * Creates the provided map on the server and returns its server-updated appearance
   * @param {KMap} kMap the pre-populated map to be created on the server
   * @param {function} callback Function to be called when the map is created
   * @returns {Observable<KMap>} the created map (now with the id and other specific data allocated to it by server, so the caller should fill the original map with it)
     @example http://localhost:8001/kmaps/in_map/default/579811d88e12abfa556f6b59.json
   */
  create(kMap: KMap): Observable<KMap> {
    let result: Observable<KMap> = null;

    if (false) {
      // TODO:NG2: if(Plugins.puzzles.knalledgeMap.config.services.QUEUE)
      // kMap.$promise = null;
      // kMap.$resolved = false;
      //
      // kMap.$promise = $q(function(resolve, reject) {
      // 	KnalledgeMapQueue.execute({data: kMap, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
      // });
    } else {
      let kMapForServer: any = kMap.toServerCopy();

      /*
      //TODO: params sending:
      const httpParams = new HttpParams();
      const result = httpParams.set("type", "new");
      console.log("result", result);
      console.log("[create] httpParams", httpParams);
      httpOptions["params"] = httpParams;
      console.log("[create] httpOptions", httpOptions);
*/

      //we return kMap:kMap, because 'map' is of type 'Resource

      /*
      TODO:NG2: in the line
        `result = this.http.post<KMap>(this.apiUrl, kMapForServer, httpOptions)`
      we had to replace Genric type stting <KMap> with <ServerData> because it defines the return valuse
      (and probably the posted value), becasuse server returns the `ServerData` object
      */
      result = this.http
        .post<ServerData>(this.apiUrl, kMapForServer, httpOptions)
        .pipe(
          //tap((mapS: KMap) => console.log(`CREATED 'map'${mapS}`)), // not needed - it's just for logging
          map(
            (mapS: ServerData): KMap => {
              if (mapS.success) {
                return this.extractVO<KMap>(mapS, KMap);
              } else {
                console.error("KnalledgeMapService::create", mapS);
                throw new ServerError(mapS.errcode, mapS.message);
              }
            }
          )
          // , catchError(this.handleError<KMap>("KnalledgeMapService::create"))
        );

      /* TODO:NG2 : remain of the NG1 Promise code to be integrated:
			let map = this.createPlain({
				//actionType:'default'
				}, kMapForServer, function(mapFromServer){
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
      */
    }
    //we return this value to caller as a dirty one, and then set its value to mapFromServer when upper callback is called
    //TODO: a problem may occur if promise is resolved BEFORE callback is called
    return result;
  }

  //KnalledgeMapService.update(map, actionType, patch, callback)

  /**
   * Deletes the KMap from the server
   * In server's response, the ServerData.data is equal to the _id of the deleted VO.  ServerData.data will be equal to null, if there is no data we intended to delete. In both cases `ServerData.success` will be eq `true`
   * @param {string} id id of the node to be deleted
   * @param {function} callback Function to be called when the node is deleted
   * @example URL:http://localhost:8001/kmaps/one/default/5a156965d0b7970f365e1a4b.json
   */
  destroy(id: string): Observable<boolean> {
    //TODO:NG2 fix usage of this function to expect boolean

    var result: Observable<boolean> = this.http
      .delete<ServerData>(this.apiUrl + "one/" + id, httpOptions)
      .pipe(
        tap(_ => console.log(`deleted map id=${id}`)),
        map(serverData => serverData.success),
        catchError(this.handleError<boolean>("deleteMap"))
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
    return result;
  }
}
