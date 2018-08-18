/* CRUD Service for SearchVO paired with kSearch backend
 old NG2 pair: src/frontend/app/components/knalledgeSearch/js/services/knalledgeSearchService.js
 */
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
//import 'rxjs/add/operator/toPromise';

import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {CFService} from '@colabo-knalledge/knalledge_store_core/cf.service';

import {KMap} from '@colabo-knalledge/knalledge_core/code/knalledge/kMap';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

const SearchNodesAP = "search-nodes";

@Injectable()
export class KnalledgeSearchNodeService extends CFService
{
  private apiUrl: string;

  constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
  ){
    super();
    console.log('KnalledgeSearchNodesService:constructor');
    this.apiUrl = CFService.serverAP + '/' + SearchNodesAP + '/';
  }

  queryChildrenInMap(nodeId:string, mapId:string, callback?:Function): Observable<KNode[]>
  {
    let result:Observable<KNode[]> = this.http.get<ServerData>(this.apiUrl+'children/in-map/'+mapId+'/'+nodeId+'.json')
      .pipe(
        map(nodesFromServer => CFService.processVOs(nodesFromServer, KNode)),
        catchError(this.handleError('KnalledgeNodeService::queryInMap', null))
      );

    if(callback){result.subscribe(nodes => callback(nodes));}
    return result;
  }

  queryParentsInMap(nodeId: string, mapId: string, callback?: Function): Observable<KNode[]> {
    let result: Observable<KNode[]> = this.http.get<ServerData>(this.apiUrl + 'parents/in-map/' + mapId + '/' + nodeId + '.json')
      .pipe(
        map(nodesFromServer => CFService.processVOs(nodesFromServer, KNode)),
        catchError(this.handleError('KnalledgeNodeService::queryInMap', null))
      );

    if (callback) { result.subscribe(nodes => callback(nodes)); }
    return result;
  }
}
