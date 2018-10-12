import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
import { of } from 'rxjs/observable/of';

import {ServerData} from '@colabo-knalledge/f-store_core/ServerData';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const smsAP = "smsapi";

@Injectable()
export class SMSApiService // extends CFService
{

  //http://api.colabo.space/knodes/
  // "http://127.0.0.1:888/knodes/";

  static serverAP = "http://127.0.0.1:8001";

  private apiUrl: string;
  private defaultAction:string = 'default';

	private knalledgeMapQueue:any = null;
	private knAllEdgeRealTimeService:any = null;

  static UPDATE_NODE_NAME_FINAL:string = 'UPDATE_NODE_NAME_FINAL';
  static UPDATE_NODE_NAME:string = 'UPDATE_NODE_NAME';

	constructor(
    private http: HttpClient
    //@Inject('ENV') private ENV
    //private ENV = undefined
  ){
    //super();
    console.log('SMSApiService:constructor'); //TODO:NG2: this.apiUrl = this.ENV.server.backend + '/' + smsAP + '/';
    this.apiUrl = SMSApiService.serverAP + '/' + smsAP + '/';
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError(operation = 'operation', result: string) {
    return (error: any): Observable<string> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      window.alert('error: ' + error);

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as string);
    };
  }

  /**
   * extracts VO from the server response `ServerData` and sets it up
   * @param sd - data received from server
   * @param typeT - type (class) of the object expected to be received
   */
  protected extractVO(sd:string): string{
    let vo: string = sd;
    return vo;
  }

  /**
   * Creates the provided node on the server and returns its server-updated appearance
   * @param {KNode} kNode the pre-populated node to be created on the server
   * @param {function} callback Function to be called when the node is created
   * @returns {Observable<KNode>} the created node (now with the id and other specific data allocated to it by server, so the caller should fill the original node with it)
     @example http://localhost:8001/knodes/in_map/default/579811d88e12abfa556f6b59.json
   */
  create(sms:string, callback?:Function): Observable<string>
  {
  	console.log("SMSApiService.create");
    let result: Observable<string> = null;

    result = this.http.post<string>(this.apiUrl, {'sms':sms}, httpOptions)
      .pipe(
        //tap((nodeS: KNode) => console.log(`CREATED 'node'${nodeS}`)), // not needed - it's just for logging
        map(res => this.extractVO(res)) //, //the sever returns `ServerData` object
        // catchError(this.handleError('SMSApiService::create',))
      );

		//we return this value to caller as a dirty one, and then set its value to nodeFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called
    if(callback){result.subscribe(nodes => callback(nodes));}
  	return result;
  }

}
