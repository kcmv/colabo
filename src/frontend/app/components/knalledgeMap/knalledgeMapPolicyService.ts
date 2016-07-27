/**
 * Service that configures policy aspects of the KnAllEdge system
 * @class KnalledgeMapPolicyService
 * @memberof knalledge.knalledgeMap
*/

export class KnalledgeMapPolicyService {
  private provider: any = {
    config: {
      broadcasting: {
          enabled: false, //broaadcasting toward receviers
          receiveNavigation: true, //going through map (changing selected nodes), ...
          receiveStructural: true, //knawledge management (creation, delete, ....)
          receiveVisualization: true, //changes in view settings (showInages, showNodeTypes, limit range of visible nodes, IBIS, etc)
          receiveBehaviours: true, //receive changes in behaviours/modes (broadcasting, etc)
      },
      moderating: {
          enabled: false
      },
      behaviour: {
          //depricated in favour of state:
          // brainstorming: 0 //0:off, 1:phase 1; ... 4:phase 4
      },
      session: {

      },
      state: {
        id: 0,
        name: "",
        brainstorming: null
        // id: 1,
        // name: "CollaboArthon"
      },
      mediation: {
        sendRequest: true
      },
      knalledgeMap: {
        nextNodeType: null
      }
    }
  };

  mustFollowPresenter():boolean {
    return this.provider.config.session && this.provider.config.session.mustFollowPresenter && !this.provider.config.moderating.enabled;
  }

  readOnly():boolean {
    return this.provider.config.session && this.provider.config.session.readOnly && !this.provider.config.moderating.enabled;
  }

  get():any {
      return this.provider;
  }
}
