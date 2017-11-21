import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {CFService} from './cf.service';

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

	private knalledgeMapQueue:any = null;
	private knAllEdgeRealTimeService:any = null;

	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
  ){
    super();
    console.log('KnalledgeEdgeService:: constructor NG 4.++');
    //this.apiUrl = this.ENV.server.backend + '/' + edgeAP + '/';
    this.apiUrl = CFService.serverAP + '/' + edgeAP + '/';
  }

  //TODO: all the old (expecting Promises) code calling this will have to call .toPromise() on the reuslt
  getById(id, callback?:Function): Observable<KEdge>
  {
    //TODO: check 'callback' support
    console.log('getById('+id+')');
    var url: string = this.apiUrl+'one/'+id;
    //url = 'http://localhost:8001/howAmIs/all/.json';
    //url = 'http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json';
    //url = 'http://localhost:8001/kedges/';
    console.log('url: '+url+')');
    //TODO: we cannot still use get<KEdge>(url) because server returns the object as ServerData
    var result:Observable<KEdge> = this.http.get<ServerData>(url)
      .pipe(
        // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
        map(edge => this.extractVO<KEdge>(edge,KEdge)),
        catchError(this.handleError('KnalledgeEdgeService::getById', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(edge => callback(edge));}
    return result; //return returnPromise ? result.toPromise() : result;

    //return this.getPlain({ searchParam:id, type:'one' }, callback);
  }

  /*
  Example: http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json
  */
  //TODO: all the old (expecting Promises) code calling this will have to call .toPromise() on the reuslt
  queryInMap(id, callback?:Function): Observable<KEdge[]>
  {
    //TODO: check 'callback' support
    function processEdges(edgesS):Array<KEdge>{
      console.log("processEdges");
      var edges:Array<KEdge> = edgesS.data as Array<KEdge>;
      for(var id=0; id<edges.length; id++){
        //TODO: will not be needed when/if we get rid of ServerData wrapping needed now, because the response from server will be typed to KEdge unlike in previous versions
        var kEdge:KEdge = KEdge.factory(edges[id]);
        kEdge.state = KEdge.STATE_SYNCED;
        console.log(kEdge);
        edges[id] = kEdge;
      }
      return edges;
    }

    var result:Observable<KEdge[]> = this.http.get<ServerData>(this.apiUrl+'in_map/'+id)
      .pipe(
        map(edgesFromServer => processEdges(edgesFromServer)),
        catchError(this.handleError('KnalledgeEdgeService::queryInMap', null))
      );

    if(callback){result.subscribe(edges => callback(edges));}
    return result; //return returnPromise ? result.toPromise() : result;
  }


  queryBetween(id, callback?:Function)
  {
    // return this.queryPlain({ searchParam:id, type:'between' }, callback);
  }

  queryConnected(id, callback?:Function)
  {
    // return this.queryPlain({ searchParam:id, type:'connected' }, callback);
  }
}
