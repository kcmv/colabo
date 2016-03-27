import {KnalledgeMapPolicyService} from  '../knalledgeMap/knalledgeMapPolicyService';

export class BroadcastManagerService {
    private knalledgeMapPolicyService:KnalledgeMapPolicyService;
    private knAllEdgeRealTimeService;

    constructor(_KnalledgeMapPolicyService_, _KnAllEdgeRealTimeService_) {
        this.knalledgeMapPolicyService = _KnalledgeMapPolicyService_;
        this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;
    }
}
