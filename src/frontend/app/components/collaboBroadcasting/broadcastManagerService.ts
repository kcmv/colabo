import {KnalledgeMapPolicyService} from  '../knalledgeMap/knalledgeMapPolicyService';

export class BroadcastManagerService {
    private knalledgeMapPolicyService:KnalledgeMapPolicyService;
    private knAllEdgeRealTimeService;
    public KnRealTimeNodeSelectedEventName:String = "node-selected";

    constructor(_KnalledgeMapPolicyService_, _KnAllEdgeRealTimeService_) {
        this.knalledgeMapPolicyService = _KnalledgeMapPolicyService_;
        this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;

        var BroadcastManagerServicePluginOptions:Object = {
    			name: "BroadcastManagerService",
    			events: {
    			}
    		};
    		BroadcastManagerServicePluginOptions.events[KnRealTimeNodeSelectedEventName] = this.receiveBroadcast.bind(this);
    		this.knAllEdgeRealTimeService.registerPlugin(BroadcastManagerServicePluginOptions);
    }

    receiveBroadcast:Function = function(user:Object){
        console.log("[receiveBroadcast] result: ", result);
        return;
    };
}
