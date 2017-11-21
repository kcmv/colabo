// old NG2 pair: src/frontend/app/components/knalledgeMap/js/services/knalledgeMapVOsService.js
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/toPromise';

import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {CFService} from './cf.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const mapAP = "kmaps";
const serverAP = "http://127.0.0.1:8001";

@Injectable()
export class KnalledgeMapVoService extends CFService{
  private apiUrl: string;

  constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
    //private ENV = undefined
  ){
    super();
    console.log('KnalledgeMapVoService:constructor');
    //this.apiUrl = this.ENV.server.backend + '/' + nodeAP + '/';
    this.apiUrl = serverAP + '/' + mapAP + '/';
  }

}
