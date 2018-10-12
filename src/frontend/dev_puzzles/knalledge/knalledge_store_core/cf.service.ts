import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

import {ServerData} from '@colabo-knalledge/f-store_core/ServerData';
import {VO} from '@colabo-knalledge/f-core/code/knalledge/VO';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface IConstructor<T> {
    new (...args: any[]): T;
    factory(obj:any):T;
}

import * as config from '@colabo-utils/i-config';

@Injectable()
export class CFService {
  // RESTfull backend API url
  static serverAP = config.GetGeneral('serverUrl');

  static processVOs<T extends VO>(voS:ServerData, typeT:IConstructor<T>):Array<T>{
    //console.log("processVOs");
    let vos:Array<T> = voS.data as Array<T>;
    for(let id=0; id<vos.length; id++){
      //TODO: will not be needed when/if we get rid of ServerData wrapping needed now, because the response from server will be typed to VO unlike in previous versions
      let vo:T = typeT.factory(vos[id]);
      vo.state = VO.STATE_SYNCED;
      //console.log(vo);
      vos[id] = vo;
    }
    return vos;
  }

  constructor() { }

  /**
 * extracts VO from the server response `ServerData` and sets it up
 * @param sd - data received from server
 * @param typeT - type (class) of the object expected to be received
 */
  protected extractVO<T extends VO>(sd: ServerData, typeT: IConstructor<T>): T {
    //let vo: T = new typeT();
    let vo: T = typeT.factory(sd.data);
    vo.state = VO.STATE_SYNCED;
    return vo;
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T> (operation = 'operation', result?: T) {
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

}
