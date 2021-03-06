const MODULE_NAME: string = "@colabo-topichat/f-talk";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { KnalledgeMapVoService, MapWithContent } from '@colabo-knalledge/f-store_core';

@Injectable()
export class MapEngineService{
  protected mapSubscritpion: Observable<any>;
  constructor(
      protected knalledgeMapVoService:KnalledgeMapVoService
    ) {
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
  }  

  public getMap(mapId:string):Observable<any>{
    console.log('[MapEngineService] getMap',mapId);
    this.mapSubscritpion = this.knalledgeMapVoService.getNodesAndEdgesInMap(mapId);
    this.mapSubscritpion.subscribe(this.mapReceived.bind(this));
    if ((<any>window).Worker) {
      var myWorker = new Worker('assets/workers/map-engine.worker.js');
      myWorker.postMessage("Привет работник!");
      console.log('Message posted to worker');

      myWorker.onmessage = function (e) {
        let result = e.data;
        console.log('Message received from worker: ', result);
        myWorker.terminate();
      };
    }
    return this.mapSubscritpion;
  }

  protected mapReceived(map:MapWithContent):void{
    console.log('mapReceived: ', map);
  }
}
