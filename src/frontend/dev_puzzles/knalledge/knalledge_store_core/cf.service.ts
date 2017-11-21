import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {ServerData} from '@colabo-knalledge/knalledge_store_core/ServerData';
import {VO} from '@colabo-knalledge/knalledge_core/code/knalledge/VO';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CFService {
  static serverAP = "http://127.0.0.1:8001";
  
  constructor() { }

  protected extractVO<T>(sd:ServerData): T{
    return null;
    //TODO:
    // var vo: T = new T();
    // (T as VO).factory<T>(sd.data);
    // (vo as VO).state = VO.STATE_SYNCED;
    // return vo;
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

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
