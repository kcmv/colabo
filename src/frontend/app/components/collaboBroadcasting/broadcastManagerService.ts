import {KnalledgeMapPolicyService} from  '../knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

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
    private globalEmitterServicesArray:GlobalEmitterServicesArray;

    constructor(_KnalledgeMapPolicyService_, _KnAllEdgeRealTimeService_, _GlobalEmitterServicesArray_
      // ,
      // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
      this.knalledgeMapPolicyService = _KnalledgeMapPolicyService_;
      this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;
      this.globalEmitterServicesArray = _GlobalEmitterServicesArray_;

      //var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
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
