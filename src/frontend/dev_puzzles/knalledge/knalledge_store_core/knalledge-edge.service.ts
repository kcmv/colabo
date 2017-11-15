import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class KnalledgeEdgeService {
	private apiUrl: string = ""; // "http://127.0.0.1:8888/dbAudits/";
	private knalledgeMapQueue:any = null;
	private knAllEdgeRealTimeService:any = null;

	constructor(
    private http: HttpClient
  ){
    console.log('KnalledgeEdgeService:constructor');
  }

  getEdge(id:string):KEdge{
    var edge:KEdge = new KEdge();
    edge.name = (edge._id == '3')
      ? "AHHHHAA: 3!!!" : "NE ZNAM";
    return edge;
  }
}
