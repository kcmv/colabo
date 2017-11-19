import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/toPromise';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const edgeAP = "kedges";
const serverAP = "http://127.0.0.1:8001";

@Injectable()
export class KnalledgeEdgeService {

  //http://api.colabo.space/kedges/
  // "http://127.0.0.1:888/kedges/";

  private apiUrl: string;

	private knalledgeMapQueue:any = null;
	private knAllEdgeRealTimeService:any = null;

	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
  ){
    console.log('KnalledgeEdgeService:: constructor NG 4.++');
    //this.apiUrl = this.ENV.server.backend + '/' + edgeAP + '/';
    this.apiUrl = serverAP + '/' + edgeAP + '/';
  }

  private extractEdge(sd:ServerData):KEdge{
    return sd.data as KEdge;
  }

  getById(id, callback?:Function, returnPromise:boolean = false): any // change to "Observable<KEdge>" after Promises are eliminated
  {
    //TODO: check 'callback' support
    console.log('getById('+id+')');
    var url: string = this.apiUrl+'one/'+id;
    //url = 'http://localhost:8001/howAmIs/all/.json';
    //url = 'http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json';
    //url = 'http://localhost:8001/kedges/';
    console.log('url: '+url+')');
    //TODO: we cannot still use get<KEdge>(url) because server returns the object as ServerData
    var result:Observable<ServerData> = this.http.get<ServerData>(url)
      .pipe(
        // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
        map(edge => this.extractEdge(edge)), //edge => this.extractEdge(edge)),
        catchError(this.handleError('KnalledgeEdgeService::getById', null))
      );
    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(edge => callback(edge));}
    return returnPromise ? result.toPromise() : result;

    //return this.getPlain({ searchParam:id, type:'one' }, callback);
  }

  /*
  Example: http://localhost:8001/kedges/in_map/579811d88e12abfa556f6b59.json
  */
  queryInMap(id, callback?:Function, returnPromise:boolean = false): any //TODO: change to "Observable<KEdge[]>" after Promises are eliminated
  {
    //TODO: check 'callback' support
    function processEdges(edgesS):Array<KEdge>{
      console.log("processEdges");
      var edges:Array<KEdge> = edgesS.data as Array<KEdge>;
      for(var id=0; id<edges.length; id++){
        //TODO: will not be needed when/if we get rid of ServerData wrapping needed now, because the response from server will be typed to KEdge unlike in previous versions
        var kEdge:KEdge = KEdge.edgeFactory(edges[id]);
        kEdge.state = KEdge.STATE_SYNCED;
        console.log(kEdge);
        edges[id] = kEdge;
      }
      return edges;
    }

    var result:Observable<ServerData> = this.http.get<ServerData>(this.apiUrl+'in_map/'+id)
      .pipe(
        map(edgesFromServer => processEdges(edgesFromServer)),
        catchError(this.handleError('KnalledgeEdgeService::queryInMap', null))
      );

    if(callback){result.subscribe(edges => callback(edges));}
    return returnPromise ? result.toPromise() : result;
  }

  /*
  queryInMap(id, callback:Function, returnPromise:boolean = false): any // change to "Observable<KEdge[]>" after Promises are eliminated
  {
    function processEdges(edges){
      console.log("processEdges("+edges+")");
      for(var id=0; id<edges.length; id++){

        edges[id].state = KEdge.STATE_SYNCED;
      }

      if(callback) callback(edges);
    }

    var result:Observable<KEdge[]> = this.http.get<KEdge[]>(this.apiUrl+'in_map/'+id)
      .pipe(
        tap(edgesFromServer => processEdges(edgesFromServer)),
        catchError(this.handleError('KnalledgeEdgeService::queryInMap', []))
      );

    // var edges = this.queryPlain({ searchParam:id, type:'in_map' }, function(edgesFromServer){
    //   for(var id=0; id<edgesFromServer.length; id++){
    //     var kEdge = knalledge.KEdge.edgeFactory(edgesFromServer[id]);
    //     kEdge.state = knalledge.KEdge.STATE_SYNCED;
    //     edgesFromServer[id] = kEdge;
    //   }
    //
    //   if(callback) callback(edgesFromServer);
    // });

    return returnPromise ? result.toPromise() : result;
  }
  */

  queryBetween(id, callback:Function, returnPromise:boolean = false)
  {
    // return this.queryPlain({ searchParam:id, type:'between' }, callback);
  }

  queryConnected(id, callback:Function, returnPromise:boolean = false)
  {
    // return this.queryPlain({ searchParam:id, type:'connected' }, callback);
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
