export class KnalledgeMapPolicyService {
    private provider: any = {
        config: {
            broadcasting: {
                enabled: true,
            },
            moderating: {
                enabled: true
            }
        }
    };

    get():any {
        return this.provider;
    }
}
