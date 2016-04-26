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
          receiveVisualization: true, //changes in view settings (showIMages, showNodes, limit range of visible nodes, IBIS, etc)
          receiveBehaviours: true, //receive changes in behaviours/modes (broadcasting, etc)
      },
      moderating: {
          enabled: false
      },
      behaviour: {
          brainstorming: 0 //0:off, 1:phase 1; ... 4:phase 4
      },
      mediation: {
        sendRequest: true
      }
    }
  };

  get():any {
      return this.provider;
  }
}
