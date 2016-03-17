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
                //name: "collabo_arte"
                name: "collabo_framework"
                // name: "collabo_business"
            },
            filtering: {
              visbileTypes: {
                ibis: true,
                knalledge: true
              },
                displayDistance	: -1, // if we wanna show them all visible we set it to -1
                byAuthor: [] //array of iAmId. An empty means to see for all authors
            }
        }
    };

    get():any {
        return this.provider;
    }
}
