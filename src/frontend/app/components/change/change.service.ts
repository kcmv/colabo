import { Injectable, Inject } from '@angular/core';
import { Http, HTTP_PROVIDERS, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';

import {Change, ChangeVisibility, ChangeType, State} from './change';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';


// operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// statics
import 'rxjs/add/observable/throw';

/*
* HTTP
* https://angular.io/docs/ts/latest/guide/server-communication.html
* https://angular.io/docs/ts/latest/api/http/index/Http-class.html
*
* Services
* https://angular.io/docs/ts/latest/tutorial/toh-pt4.html
*/

/*
for showing structural changes, reacting on node-created, node-updated, node-deleted
(in future also for edge-deleted and edge-updated (in a case that a node is relinked, or edge/name is changed))
 */
@Injectable()
export class ChangeService {
  private changes: Change[] = [];
  private apiUrl: string = "http://127.0.0.1:8888/dbAudits/";

  /**
   * Service constructor
   * @constructor
   * @memberof topiChat.TopiChatService
   * @param  socketFactory         [description]
   * @param  $rootScope            [description]
   * @param  {Object} ENV                   [description]
   * @param  {Service} TopiChatConfigService - TopiChat Config service
   */
  constructor(
      @Inject('RimaService') private rimaService,
      @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
      private http: Http
  ) {
      //console.log('RequestService:constructor');

      // let changePluginOptions: any = {
      //   name: "ChangeService",
      //   events: {
      //   }
      // };
      // changePluginOptions.events[this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST] = this.receivedChange.bind(this);
      // this.knAllEdgeRealTimeService.registerPlugin(changePluginOptions);

      this.getMockupChanges();
      console.log("[ChangeService]: this.http: ", this.http);
  }

  getOne(id: string): Observable<any> {
      return this.http.get(this.apiUrl + "one/" + id)
          .map(this.extractData)
          .catch(this.handleError);
  }

  createPlain(change: Change): Observable<any> {
      // /return this.http.get(this.apiUrl + id)
      //     .map(this.extractData)
      //     .catch(this.handleError);
      return null;
  }

  create(change: Change): Observable<Change> {
    let body = JSON.stringify(change);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiUrl, body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getChangesInMap(mapId: string): Observable<any> {
    return this.http.get(this.apiUrl + "in_map/" + mapId)
        .map(this.extractData)
        .catch(this.handleError);
  }

  getMockupChanges(){
    var r1:Change = new Change();
      r1.iAmId = "556760847125996dc1a4a24f";
      r1.reference = "57816d593212be5142d1de20";
      r1.type = ChangeType.STRUCTURAL;
    var r2:Change = new Change();
      r2.iAmId = "556760847125996dc1a4a241";
      r2.reference = "57816da83212be5142d1de34";
      r2.type = ChangeType.STRUCTURAL;
    var r3:Change = new Change();
      r3.iAmId = "556760847125996dc1a4a241";
      r3.reference = "57816de13212be5142d1de6d";
      r3.type = ChangeType.STRUCTURAL;
    this.changes.push(this.processReferences(r1));
    this.changes.push(this.processReferences(r2));
    this.changes.push(this.processReferences(r3));
  }

  processReferences(change: Change){
    change.iAmId = this.rimaService.getUserById(change.iAmId);
    change.reference = this.knalledgeMapVOsService.getNodeById(change.reference);
    return change;
  }

  getChangesRef(){
    return this.changes;
  }

  private extractData(res: Response) {
      let body = res.json();
      return body.data || {};
  }

  private handleError(error: any) {
      // In a real world app, we might use a remote logging infrastructure
      // We'd also dig deeper into the error to get a better message
      let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
  }
}
