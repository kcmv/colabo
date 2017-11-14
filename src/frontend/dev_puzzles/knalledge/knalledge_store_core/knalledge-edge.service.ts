import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class Edge {
  id: string;
  name: string;
}

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

  getEdge(id:string):Edge{
    var edge:Edge = new Edge();
    edge.id = id;
    edge.name = (id == '5') ? "PET" : "NE ZNAM";
    return edge;
  }
}
