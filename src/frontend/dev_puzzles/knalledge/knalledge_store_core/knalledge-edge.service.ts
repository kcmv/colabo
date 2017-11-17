import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/toPromise';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';

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

  /* ToDO: this one is needed? */
  getEdge(id:string):KEdge{
    var edge:KEdge = new KEdge();
    //'5543e78e645912db4fee96f0'
    this.getById('5543e730645912db4fee96ea'); //edge._id
    edge.name = (edge._id == '3')
      ? "AHHHHAA: 3!!!" : "NE ZNAM";
    return edge;
  }

  getById(id, callback?:Function, returnPromise:boolean = false): any // change to "Observable<KEdge>" after Promises are eliminated
  {
    console.log('getById('+id+')');
    var url: string = this.apiUrl+'id/'+id;
    console.log('url: '+url+')');
    var result:Observable<KEdge> = this.http.get<KEdge>(url)
      .pipe(
        tap(edge => console.log(`fetched edge`)),
        catchError(this.handleError('KnalledgeEdgeService::getById', null))
      );
    console.log('result: ');
    console.log(result);
    return returnPromise ? result.toPromise() : result;

    //return this.getPlain({ searchParam:id, type:'one' }, callback);
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
