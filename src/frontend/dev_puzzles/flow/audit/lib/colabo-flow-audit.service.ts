const MODULE_NAME: string = "@colabo-flow/f-audit";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { AuditedAction } from '@colabo-flow/i-audit';

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
  
  getItems():AuditedAction[]{
    let items:AuditedAction[] = [];
    items.push(({
      _id: "ff3c",
      name: "Сава"
    }) as AuditedAction);
    items.push(({
      _id: "ad3c",
      name: "Николај"
    }) as AuditedAction);
    items.push(({
      _id: "872е",
      name: "Симеон"
    }) as AuditedAction);
    return items;
  }
}
