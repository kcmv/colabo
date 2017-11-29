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
    //TODO: check 'callback' support
    console.log('getById('+id+')');
    var url: string = this.apiUrl+'one/'+id;
    console.log('url: '+url+')');
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

  /*
  TODO:
  When needed, we could develop these fucntions that are already supported on backend:

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
