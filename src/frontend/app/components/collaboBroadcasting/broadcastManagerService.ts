import {KnalledgeMapPolicyService} from  '../knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

/**
 * THIS IS CLASS IS NOT USED FOR NOW - CURRENTLY DEPRICATED
 * Broadcasting manager service
 * @class BroadcastManagerService
 * @memberof collaboframework.broadcasting
*/

export class BroadcastManagerService {

    public knRealTimeNodeSelectedEventName:string = "node-selected"; // Sasa private? string vs String
    private knalledgeMapPolicyService:KnalledgeMapPolicyService;
    private knAllEdgeRealTimeService;
    private globalEmitterServicesArray:GlobalEmittersArrayService;

    constructor(_KnalledgeMapPolicyService_, _KnAllEdgeRealTimeService_, _GlobalEmittersArrayService_
      // ,
      // @Inject('GlobalEmittersArrayService') globalEmitterServicesArray:GlobalEmittersArrayService
    ) {
      this.knalledgeMapPolicyService = _KnalledgeMapPolicyService_;
      this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;
      this.globalEmitterServicesArray = _GlobalEmittersArrayService_;

      //var GlobalEmittersArrayService = $injector.get('GlobalEmittersArrayService');
  		this.globalEmitterServicesArray.register(this.knRealTimeNodeSelectedEventName);

      var broadcastManagerServicePluginOptions:any = {
  			name: "BroadcastManagerService",
  			events: {
  			}
  		};

  		broadcastManagerServicePluginOptions.events[this.knRealTimeNodeSelectedEventName] = this.receiveBroadcast.bind(this);
  		this.knAllEdgeRealTimeService.registerPlugin(broadcastManagerServicePluginOptions);
    }


    receiveBroadcast(eventName:string, msg:any) {
    	console.log("[BroadcastManagerService:receiveBroadcast] (clientId:%s) eventName: %s, msg: %s",
    	this.knAllEdgeRealTimeService.getClientInfo().clientId, eventName, JSON.stringify(msg));
      //this.globalEmitterServicesArray.get(KnRealTimeNodeCreatedEventName)
      //.subscribe('knalledgeMap', knalledgeMap.processExternalChangesInMap.bind(knalledgeMap));
      this.globalEmitterServicesArray.get(eventName).broadcast('BroadcastManagerService', msg);

      return;
    }
}
