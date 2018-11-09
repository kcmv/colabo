// old NG2 pair: src/frontend/app/components/knalledgeMap/js/services/knalledgeMapVOsService.js
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {KMap} from '@colabo-knalledge/f-core/code/knalledge/kMap';
// import {ServerData} from '@colabo-knalledge/f-store_core/ServerData';
import {CFService} from './cf.service';

import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
import {KnalledgeMapService} from '@colabo-knalledge/f-store_core/knalledge-map.service';
import * as config from '@colabo-utils/i-config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const mapAP = "kmaps";
const serverAP = "http://127.0.0.1:8001";
export const MAP_PARTS_TO_LOAD:number = 3;

export class MapWithContent{
  map:KMap;
  nodes:KNode[];
  edges:KEdge[];
}

@Injectable()
export class KnalledgeMapVoService extends CFService{
  static mapId = config.GetGeneral('mapId');

  mapPartsLeftToSave:number = MAP_PARTS_TO_LOAD; //TODO - now service can work with only one map loading in specific moment

  mapPartLoadedObserver:any = {};//Observer

  private apiUrl: string;

  private mapWithContent: MapWithContent = new MapWithContent();

  constructor(
    private http: HttpClient,
    private knalledgeNodeService:KnalledgeNodeService,
    private knalledgeEdgeService:KnalledgeEdgeService,
    private knalledgeMapService:KnalledgeMapService
    //@Inject('ENV') private ENV
    //private ENV = undefined
  ){
    super();
    console.log('KnalledgeMapVoService:constructor');
    //this.apiUrl = this.ENV.server.backend + '/' + nodeAP + '/';
    this.apiUrl = serverAP + '/' + mapAP + '/';
  }

  getNodesAndEdgesInMap(mapId?:string):Observable<any>{
    if(mapId === null){ mapId = KnalledgeMapVoService.mapId;}
    this.knalledgeMapService.getById(KnalledgeMapVoService.mapId).subscribe(this.mapLoaded.bind(this));
    this.knalledgeNodeService.queryInMap(KnalledgeMapVoService.mapId).subscribe(this.nodesLoaded.bind(this));
    this.knalledgeEdgeService.queryInMap(KnalledgeMapVoService.mapId).subscribe(this.edgesLoaded.bind(this));
    

    // https://angular.io/guide/observables
    return new Observable(this.mapPartsLoadedSubscriber.bind(this));
  }

  mapLoaded(map:KMap):void{
    this.mapWithContent.map = map;
    this.mapPartLoaded();
  }

  nodesLoaded(nodes:KNode[]):void{
    this.mapWithContent.nodes = nodes;
    this.mapPartLoaded();
  }

  edgesLoaded(edges:KEdge[]):void{
    this.mapWithContent.edges = edges;
    this.mapPartLoaded();
  }

  //could be done as anonymous, but we made it this way to be more clear the logic of Oberver
  mapPartsLoadedSubscriber(observer) { //:Observer) {
    console.log('mapPartLoadedSubscriber');
    this.mapPartLoadedObserver = observer;
    return {unsubscribe() {}};
  }

  mapPartLoaded():void{
    this.mapPartsLeftToSave--;
    console.log('SDGsService::mapPartSaved:', this.mapPartsLeftToSave);
    if(this.mapPartsLeftToSave === 0){
      console.log('SDGsService::ALL mapPartSaved');

      //emitting Obstacle:
      this.mapPartLoadedObserver.next(this.mapWithContent); //TODO change value
      this.mapPartLoadedObserver.complete();
    }
  }

  getRootNode(map:MapWithContent):KNode{
    for(var i:number=0; i<map.nodes.length;i++){
      if(map.nodes[i]._id === map.map.rootNodeId){
        return map.nodes[i];
      }
    }
    return null;
  }

  // mapReceived(map:KMap):void{
  //   console.log('mapReceived', map);
  // }
}
