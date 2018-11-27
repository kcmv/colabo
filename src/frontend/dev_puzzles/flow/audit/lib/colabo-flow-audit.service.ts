const MODULE_NAME: string = "@colabo-flow/f-audit";

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { AuditedAction } from '@colabo-flow/i-audit';
import { Observable, of } from 'rxjs';

@Injectable()
export class ColaboFlowAuditService{

  protected _isActive:boolean = true;

  constructor(
    ) {
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
    if(!this._isActive) return;

    // initialize 
  }
  
  getItems():Observable<AuditedAction[]>{
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
