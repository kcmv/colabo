import {Injectable
} from '@angular/core';

import {Change, ChangeVisibility, ChangeType, State} from './change';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

/*
for showing structural changes, reacting on node-created, node-updated, node-deleted
(in future also for edge-deleted and edge-updated (in a case that a node is relinked, or edge/name is changed))
 */
@Injectable()
export class ChangeService {
  private rimaService:any;
  private knalledgeMapVOsService:any;
  private knAllEdgeRealTimeService:any;
  private knalledgeMapPolicyService:any;
  private globalEmitterServicesArray:GlobalEmitterServicesArray;
  private changes: Change[] = [];

  /**
   * Service constructor
   * @constructor
   * @memberof topiChat.TopiChatService
   * @param  socketFactory         [description]
   * @param  $rootScope            [description]
   * @param  {Object} ENV                   [description]
   * @param  {Service} TopiChatConfigService - TopiChat Config service
   */
  constructor(RimaService, KnalledgeMapVOsService, KnalledgeMapPolicyService,
      KnAllEdgeRealTimeService, _GlobalEmitterServicesArray_
  ) {
      //console.log('RequestService:constructor');
      this.rimaService = RimaService;
      this.knalledgeMapVOsService = KnalledgeMapVOsService;
      this.knAllEdgeRealTimeService = KnAllEdgeRealTimeService;
      this.knalledgeMapPolicyService = KnalledgeMapPolicyService;
      this.globalEmitterServicesArray = _GlobalEmitterServicesArray_;

      // let changePluginOptions: any = {
      //   name: "ChangeService",
      //   events: {
      //   }
      // };
      // changePluginOptions.events[this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST] = this.receivedChange.bind(this);
      // this.knAllEdgeRealTimeService.registerPlugin(changePluginOptions);

      this.getMockupChanges();
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

  // receivedChange(eventName:string, change:Change){
  //     this.changesByExpertise.push(change);
  //     if(this.filterChange(change)){
  //       change.iAmId = this.rimaService.getUserById(change.iAmId); //can be null!
  //       change.reference = this.knalledgeMapVOsService.getNodeById(change.reference); //can be null!
  //       console.log('[ChangeService:receivedChange] change:', JSON.stringify(change));
  //       if(change.type === ChangeType.REPLICA){
  //         console.log(' changeed REPLICA for ');
  //       }
  //       this.globalEmitterServicesArray.register(this.EMITTER_NAME_REQUEST);
  //       this.globalEmitterServicesArray.get(this.EMITTER_NAME_REQUEST).broadcast(
  //       'ChangeService', {'change':change,'event':this.EMITTER_NAME_REQUEST});
  //     }
  // }
}
