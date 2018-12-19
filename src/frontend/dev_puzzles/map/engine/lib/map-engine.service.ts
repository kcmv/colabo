const MODULE_NAME: string = "@colabo-topichat/f-talk";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { KnalledgeMapVoService } from '@colabo-knalledge/f-store_core';

@Injectable()
export class MapEngineService{
  constructor(
      protected knalledgeMapVoService:KnalledgeMapVoService
    ) {
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
    this.knalledgeMapVoService.getNodesAndEdgesInMap('58068a04a37162160341d402');
  }  
}
