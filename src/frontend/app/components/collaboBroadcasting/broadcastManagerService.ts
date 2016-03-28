import {KnalledgeMapPolicyService} from  '../knalledgeMap/knalledgeMapPolicyService';

export class BroadcastManagerService {
    private knalledgeMapPolicyService:KnalledgeMapPolicyService;
    private knAllEdgeRealTimeService;

    public knRealTimeNodeSelectedEventName:string = "node-selected"; // Sasa private? string vs String

    constructor(_KnalledgeMapPolicyService_, _KnAllEdgeRealTimeService_) {
      this.knalledgeMapPolicyService = _KnalledgeMapPolicyService_;
      this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;


      var broadcastManagerServicePluginOptions:Object = {
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
      return;
    };
}
