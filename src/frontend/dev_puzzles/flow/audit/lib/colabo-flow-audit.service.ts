const MODULE_NAME: string = "@colabo-flow/f-audit";

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { AuditedAction, AuditedActionClass } from '@colabo-flow/i-audit';
import { Observable, of } from 'rxjs';
import { GetPuzzle, GetGeneral } from '@colabo-utils/i-config';

import * as moment from 'moment';

@Injectable()
export class ColaboFlowAuditService{

  // RESTfull backend API url
  static serverAP: string = GetGeneral('serverUrl');

  protected _isActive:boolean = true;
  protected puzzleConfig: any;

  constructor(
    private http: HttpClient
    ) {
    this.puzzleConfig = GetPuzzle(MODULE_NAME);
    this.init();
  }

  /**
    * Initializes service
    */
  init() {
    if(!this._isActive) return;

    // initialize 
  }

  //TODO: to remove this, we are scaling it in the component:
  get timeDivider():number{
    return this.puzzleConfig.timeDivider;
  }

  /**
* Handle Http operation that failed.
* Let the app continue.
* @param operation - name of the operation that failed
* @param result - optional value to return as the observable result
*/
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      window.alert('error: ' + error);

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  getStatisticsMockup():Observable<any>{
    let items:any = {
      "searchUser": {
        "parameters": {
          "count": 10,
          "duration": 3,
          "success": 11
        }
      },
      "checkCache": {
        "parameters": {
          "count": 20,
          "duration": 25,
          "success": 4
        }
      },
      "start": {
        "parameters": {
          "count": 50,
          "duration": 15,
          "success": 8
        }
      },
      "end": {
        "parameters": {
          "count": 40,
          "duration": 5,
          "success": 7
        }
      },
      "parseResponse": {
        "parameters": {
          "count": 30,
          "duration": 15,
          "success": 16
        }
      }
    };

    return of(items);
  }

  getStatistics(sessionIds:string[],flowId:string=null):Observable<any> {
    let url: string;

    console.log('[getStatistics] sessionIds', sessionIds);
    let idsStr:string = sessionIds.join(',');
    let searchQuery: string = 'get-stats/sessions/';

    // this.http.get<ServerData>(this.apiUrl+'id_in/'+this.defaultAction+'/'+idsStr+'.json')

    url = ColaboFlowAuditService.serverAP + '/colabo-flow/audit/' + searchQuery + idsStr + (flowId == null ? '' : ('/flow/' + flowId)) + '.json';

    const result: Observable<any[]>
      = this.http.get<any>(url)
        .pipe(
          map(statsFromServer => this.processStatsFromServer(statsFromServer.data)),
          // map(auditsFromServer => CFService.processAuditedActionsVOs(nodesFromServer, KNode)),
          catchError(this.handleError('ColaboFlowAuditService::getStatistics', null))
        );

    // result.subscribe(audits => {
    //   console.log('[ColaboFlowAuditService::loadSounds] audits: ', audits);
    // });

    // if (callback) {
    //   result.subscribe(audits => callback(audits));
    // }
    return result;
  }

  processStatsFromServer(statsFromServer:any[] ): any[] {
    let statFromServer:any = null;
    let name:string;
    // let newStatFromServer:any = null;
    for(let i:number=0; i<statsFromServer.length; i++){
      statFromServer = statsFromServer[i];
      name = statFromServer['_id'];
      // statFromServer['avgTime'] = statFromServer['avgTime'] / this.timeDivider;
      delete statFromServer['_id'];
      statsFromServer[i] = {'name': name,  'stats': JSON.parse(JSON.stringify(statFromServer))};
    }
    return statsFromServer;
  }

  getActions(): Observable<AuditedAction[]> {
    // return this.getActionsMockup();

    let searchQuery: string = 'get-audits/all/any';
    let url: string;
    url = ColaboFlowAuditService.serverAP + '/colabo-flow/audit/' + searchQuery + '.json';

    const result: Observable<any[]>
      = this.http.get<any>(url)
        .pipe(
          map(auditsFromServer => this.processAuditedActionsVOs(auditsFromServer)),
          // map(auditsFromServer => CFService.processAuditedActionsVOs(nodesFromServer, KNode)),
          catchError(this.handleError('ColaboFlowAuditService::loadSounds', null))
        );

    // result.subscribe(audits => {
    //   console.log('[ColaboFlowAuditService::loadSounds] audits: ', audits);
    // });

    // if (callback) {
    //   result.subscribe(audits => callback(audits));
    // }
    return result;

  }

  processAuditedActionsVOs(resultFull: any): AuditedAction[] {
    const audits: AuditedAction[] = [];

    let auditsFromServer:any[] = resultFull.data;

    console.log("[processAuditedActionsVOs] auditsFromServer: ", auditsFromServer);

    for (let auditId = 0; auditId < auditsFromServer.length; auditId++) {
      const auditFromServer:any = auditsFromServer[auditId];
      const auditVo: AuditedActionClass = new AuditedActionClass();

      auditVo.id = auditFromServer.id;
      if (!auditVo.id) auditVo.id = auditFromServer._id;
      auditVo.time = auditFromServer.time;
      auditVo.bpmn_type = auditFromServer.bpmn_type;
      auditVo.bpmn_subtype = auditFromServer.bpmn_subtype;
      auditVo.bpmn_subsubtype = auditFromServer.bpmn_subsubtype;
      auditVo.flowId = auditFromServer.flowId;
      auditVo.name = auditFromServer.name;
      auditVo.userId = auditFromServer.userId;
      auditVo.sessionId = auditFromServer.sessionId;
      auditVo.flowInstanceId = auditFromServer.flowInstanceId;
      auditVo.implementationId = auditFromServer.implementationId;
      auditVo.implementerId = auditFromServer.implementerId;
      auditVo.createdAt = moment(auditFromServer.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
      auditVo.updatedAt = moment(auditFromServer.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a");

      audits.push(auditVo);
    }
    console.log("[processAuditedActionsVOs] audits: ", audits);
    return audits;
  }

  getActionsMockup():Observable<AuditedAction[]>{
    let items:AuditedAction[] = [];
    items.push(({
      id: "ad30",
      name: "start",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    items.push(({
      id: "ad31",
      name: "parseRequest",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    items.push(({
      id: "ad32",
      name: "parseResponse",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    items.push(({
      id: "ad3a",
      name: "end",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    // flow ff02
    items.push(({
      id: "ad40",
      name: "start",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    items.push(({
      id: "ad41",
      name: "parseRequest",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    items.push(({
      id: "ad42",
      name: "parseResponse",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    items.push(({
      id: "ad4a",
      name: "end",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    // flow ff03
    items.push(({
      id: "ad50",
      name: "start",
      flowId: "searchSoundsWithCache",
      flowInstanceId: "ff03"
    }) as AuditedAction);

    items.push(({
      id: "ad50",
      name: "parseRequest",
      flowId: "searchSoundsWithCache",
      flowInstanceId: "ff03"
    }) as AuditedAction);

    items.push(({
      id: "ad5a",
      name: "end",
      flowId: "searchSoundsWithCache",
      flowInstanceId: "ff03"
    }) as AuditedAction);

    return of(items);
  }
}
