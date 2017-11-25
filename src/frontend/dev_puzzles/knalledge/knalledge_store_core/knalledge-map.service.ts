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

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
  getById(id:string, callback?:Function): Observable<KMap>
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
        map(map => this.extractVO<KMap>(map,KMap)),
        catchError(this.handleError('KnalledgeMapService::getById', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(map => callback(map));}
    return result; //return returnPromise ? result.toPromise() : result;
  }

  /*
  example: http://localhost:8001/kmaps/by-name/Demo%20Map.json
  */
  getByName(name:string, callback?:Function): Observable<KMap[]>
  {
    //TODO: check 'callback' support

    console.log('KnalledgeMapService::getByName('+name+')');
    let url: string = this.apiUrl+'by-name/'+name;
  
    let result:Observable<KMap[]> = this.http.get<ServerData>(url)
      .pipe(
        // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
        map(mapsFromServer => CFService.processVOs(mapsFromServer, KMap)),
        catchError(this.handleError('KnalledgeMapService::getByName', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(maps => callback(maps));}
    return result; //return returnPromise ? result.toPromise() : result;
  }

  /* Example:
	http://localhost:8001/kmaps/by-participant/556760847125996dc1a4a24f.json
	*/
	queryByParticipant(participantId:string, callback?:Function): Observable<KMap[]>
  {
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


  create(kMap:KMap, callback?:Function): Observable<KMap>
  {
    //TODO:NG2 check 'callback' support
    //another callback approach: map(mapS => {if(callback) {callback(mapS)}}), //TODO:NG2 Test if this callback call works
  	console.log("KnalledgeMapService.create");
    let result: Observable<KMap> = null;

		if(false) // TODO:NG2: if(Plugins.puzzles.knalledgeMap.config.services.QUEUE)
    {
			// kMap.$promise = null;
			// kMap.$resolved = false;
      //
			// kMap.$promise = $q(function(resolve, reject) {
			// 	KnalledgeMapQueue.execute({data: kMap, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			// });
		}
		else{
			let kMapForServer:any = kMap.toServerCopy();
			//we return kMap:kMap, because 'map' is of type 'Resource

      /*
      TODO:NG2: in the line
        `result = this.http.post<KMap>(this.apiUrl, kMapForServer, httpOptions)`
      we had to replace Genric type stting <KMap> with <ServerData> because it defines the return valuse
      (and probably the posted value), becasuse server returns the `ServerData` object
      */
      result = this.http.post<ServerData>(this.apiUrl, kMapForServer, httpOptions)
      .pipe(
        //tap((mapS: KMap) => console.log(`CREATED 'map'${mapS}`)), // not needed - it's just for logging
        map(mapS => this.extractVO<KMap>(mapS,KMap)), //the sever returns `ServerData` object
        catchError(this.handleError<KMap>('KnalledgeMapService::create'))
      );

      // addHero (hero: Hero): Observable<Hero> {
      //   return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      //     tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      //     catchError(this.handleError<Hero>('addHero'))
      //   );
      // }
      //
			// let map = this.createPlain({
			// 	//actionType:'default'
			// 	}, kMapForServer, function(mapFromServer){
			// 	kMap.$resolved = map.$resolved;
			// 	kMap.overrideFromServer(mapFromServer);
			// 	if(callback) callback(kMap);
			// });
      //
			// //createPlain manages promises for its returning value, in our case 'map', so we need to  set its promise to the value we return
			// kMap.$promise = map.$promise;
			// kMap.$resolved = map.$resolved;
      //
			// if(map.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously
			// 	kMap.overrideFromServer(map);
			// }
		}
		//we return this value to caller as a dirty one, and then set its value to mapFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
    if(callback){result.subscribe(maps => callback(maps));}
  	return result;
  }

  //KnalledgeMapService.update(map, actionType, patch, callback)

  //KnalledgeMapService.destroy(id)
}
