/* CRUD Service for mapVO paired with kmap backend
 old NG2 pair: src/frontend/app/components/knalledgeMap/js/services/knalledgeMapService.js
 */

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

import {KMap} from '@colabo-knalledge/knalledge_core/code/knalledge/kMap';
import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {CFService} from './cf.service';

const mapAP = "kmaps";

@Injectable()
export class KnalledgeMapService extends CFService{

  //http://api.colabo.space/kmaps/
  // "http://127.0.0.1:888/kmaps/";

  private apiUrl: string;

	private knalledgeMapQueue:any = null;
	private knAllEdgeRealTimeService:any = null;

	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
    //private ENV = undefined
  ){
    super();
    console.log('KnalledgeMapService:constructor');
    //this.apiUrl = this.ENV.server.backend + '/' + mapAP + '/';
    this.apiUrl = CFService.serverAP + '/' + mapAP + '/';
  }

  /*
  example: http://localhost:8001/kmaps/one/56e8b66b913d88af03e9d17f.json
  */
  //TODO: all the old (expecting Promises) code calling this will have to call .toPromise() on the reuslt
  getById(id, callback?:Function): Observable<KMap>
  {
    //TODO: check 'callback' support
    console.log('KnalledgeMapService::getById('+id+')');
    let url: string = this.apiUrl+'one/'+id;
    //url = 'http://localhost:8001/howAmIs/all/.json';
    //url = 'http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json';
    //url = 'http://localhost:8001/kedges/';
    console.log('url: '+url+')');
    //TODO: we cannot still use get<KMap>(url) because server returns the object as ServerData
    let result:Observable<KMap> = this.http.get<ServerData>(url)
      .pipe(
        // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
        map(map => this.extractVO<KMap>(map)), //edge => this.extractEdge(edge)),
        catchError(this.handleError('KnalledgeMapService::getById', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(map => callback(map));}
    return result; //return returnPromise ? result.toPromise() : result;

    //return this.getPlain({ searchParam:id, type:'one' }, callback);


		// TODO:
    // var that = this;
		// var map = this.getPlain({ searchParam:id, type:'one' }, function(mapFromServer){
		// 	mapFromServer = knalledge.KMap.mapFactory(mapFromServer);
		// 	mapFromServer.state = knalledge.KMap.STATE_SYNCED;
		// 	//that.map = mapFromServer;
		// 	if(callback) callback(mapFromServer);
    //
		// 	return mapFromServer;
		// });
    //
		// return map;
  }

  /* Example:
	http://localhost:8001/kmaps/by-participant/556760847125996dc1a4a24f.json
	*/
	// resource.queryByParticipant = function(participantId, callback){
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
	// 			var kMap = knalledge.KMap.mapFactory(mapsFromServer[id]);
	// 			kMap.state = knalledge.KMap.STATE_SYNCED;
	// 			mapsFromServer[id] = kMap;
	// 		}
	// 		if(callback) callback(mapsFromServer);
	// 	});
	// 	// for(var i in maps){
	// 	// 	//TODO fix maps.state, etc
	// 	// }
	// 	return maps;
	// };
  //
  // /*
  // Example: http://localhost:8001/kmaps/in_map/default/579811d88e12abfa556f6b59.json
  // */
  //TODO: all the old (expecting Promises) code calling this will have to call .toPromise() on the reuslt
  // queryInMap(id, callback?:Function): Observable<KMap[]>
  // {
  //   //TODO: check 'callback' support
  //   function processMaps(mapsS):Array<KMap>{
  //     console.log("processMaps");
  //     let maps:Array<KMap> = mapsS.data as Array<KMap>;
  //     for(let id=0; id<maps.length; id++){
  //       //TODO: will not be needed when/if we get rid of ServerData wrapping needed now, because the response from server will be typed to KMap unlike in previous versions
  //       let kMap:KMap = KMap.mapFactory(maps[id]);
  //       kMap.state = KMap.STATE_SYNCED;
  //       console.log(kMap);
  //       maps[id] = kMap;
  //     }
  //     return maps;
  //   }
  //
  //   let result:Observable<KMap[]> = this.http.get<ServerData>(this.apiUrl+'in_map/'+this.defaultAction+'/'+id)
  //     .pipe(
  //       map(mapsFromServer => processMaps(mapsFromServer)),
  //       catchError(this.handleError('KnalledgeMapService::queryInMap', null))
  //     );
  //
  //   if(callback){result.subscribe(maps => callback(maps));}
  //   return result; //return returnPromise ? result.toPromise() : result;
  // }

  //KnalledgeMapService.create((newMap, callback)

  //KnalledgeMapService.update(map, actionType, patch, callback)

  //KnalledgeMapService.destroy(id)
}
