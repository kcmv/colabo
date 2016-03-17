export class KnalledgeMapViewService {
    private provider: any = {
        config: {
            syncing: {
                poolChanges: false,
            },
            nodes: {
                showImages: true,
                showTypes: true
            },
            edges: {
                showNames: true,
                showTypes: true
            },
            type: {
                // name: "collabo_science"
                name: "collabo_arte"
                // name: "collabo_business"
            },
            filtering: {
                displayDistance	: 2,
                byAuthor: [] //array of iAmId. An empty means to see for all authors
            }
        }
    };

    get():any {
        return this.provider;
    }
}
