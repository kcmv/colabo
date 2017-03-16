/**
* Service that configures visual aspects of the KnAllEdge system
* @class KnalledgeMapViewService
* @memberof knalledge.knalledgeMap
*/

export class KnalledgeMapViewService {
    private provider: any = {
        config: {
            nodes: {
                showImages: true,
                showImagesAsThumbnails: true,
                imagesThumbnailsWidth: 50,
                imagesThumbnailsHeight: 50,
                showTypes: false,
                showUnknownNodes: false
            },
            edges: {
                showNames: true,
                showTypes: false,
                orderBy: 'name',
                showUnknownEdges: false,
                // orderBy: 'vote'
                // orderBy: 'personal_vote'
                // orderBy: undefined
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
            },
            visualization: {
              limitedRange: false,
              // viewspec: 'viewspec_list'
              viewspec: 'viewspec_tree'
            },
            panels: {
                topPanel: {
                    visible: true
                }
            },
            states: { //TODO: temp solution
              editingNode: null
            },
            editors: {
              defaultType: 'text/markdown'
              // defaultType: 'text/html'
            }
        }
    };

    get():any {
        return this.provider;
    }
}
