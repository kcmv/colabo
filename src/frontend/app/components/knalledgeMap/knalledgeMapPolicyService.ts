export class KnalledgeMapPolicyService {
    private provider: any = {
        config: {
            broadcasting: {
                enabled: true,
            },
            moderating: {
                enabled: true
            },
            behaviour: {
                brainstorming: 0 //0:off, 1:phase 1; ... 4:phase 4
            }
        }
    };

    get():any {
        return this.provider;
    }
}
