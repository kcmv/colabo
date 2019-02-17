import { Injectable } from '@angular/core';
// import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
// import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';

import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {ColaboFlowService} from '@colabo-flow/f-core/lib/colabo-flow.service';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
// import {KnalledgeSearchService} from '@colabo-knalledge/f-search';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as config from '@colabo-utils/i-config';

const SDG_SELECTION_TYPE:string = "rima.selected_UN_SDG"; //TODO, to use from the SDGService (when it's exported to a puzzle)

@Injectable({
  providedIn: 'root'
})
export class ModerationService {

  static mapId = config.GetGeneral('mapId');

  // registeredUsers:KNode[] = [];
  
  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private knalledgeEdgeService:KnalledgeEdgeService,
    private colaboFlowService:ColaboFlowService,
    private rimaAAAService: RimaAAAService
  ) {
  }

  deleteUser(userId:string):Observable<boolean>{
    // window.alert('Function to be supported! Deleting user with _id = ' + userId);
    var that:ModerationService = this;
    let observable:Observable<boolean> = new Observable(observer => {deleteObserver = observer; return {unsubscribe() {}};});
    let deleteObserver:any = {};//Observer
    
    this.knalledgeNodeService.destroy(userId).subscribe(function(){
      that.knalledgeEdgeService.destroyEdgesToChild(userId).subscribe(
        function(){
          // window.alert('user is deleted');
          deleteObserver.next(true);
          deleteObserver.complete();
        }
      );
    }
    );
    return observable;
  }
}
