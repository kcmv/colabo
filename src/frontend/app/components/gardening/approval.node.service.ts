import {Injectable
} from '@angular/core';

import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {NodeGardened, ApprovalState} from './NodeGardened';

declare var d3:any;

export const PLUGIN_NAME:string = 'GARDENING_APPROVAL';
export const APPROVAL_CHANGE_EVENT:string = PLUGIN_NAME +'_CHANGE';

@Injectable()
export class ApprovalNodeService {
    plugins:any = {
        mapVisualizePlugins: {
            service: this,
            init: function init() {
                var that = this;
            },

            nodeHtmlEnter: function(nodeHtmlEnter){
                var service = this; // keeping reference on the service

                // .filter(function(d) { return d.kNode.dataContent && d.kNode.dataContent.image; })
                nodeHtmlEnter.append("div")
                    .attr("class", "gardening_approval")
                    .on("click", function(d){
                        d3.event.stopPropagation();
                        service.changeApproval(d);
                        // d3.select(this).remove();
                        // d3.select(this).style("display", "none");
                    })
                    .html(function(d){
                        var label = NodeGardened.getApprovalLabel(d.kNode);
                        return label;
                    });
            }.bind(this), // necessary for keeping reference on service

            nodeHtmlUpdate: function(nodeHtmlUpdate){
              var that = this;
                nodeHtmlUpdate.select(".gardening_approval")
                    .style("display", function(d){
                        var display = "none";
                        // if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
                        // 	display = "block";
                        // }
                        if(that.service.interfaceConfig.showInterface){
                          display = "block";
                        }
                        return display;
                    })
                    // .style("width", '2em')
                    // .style("height", '2em')
                    .html(function(d){
                        var label = NodeGardened.getApprovalLabel(d.kNode);
                        return label;
                    })
                    .style("opacity", 1e-6);

                var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".gardening_approval").transition().delay(300).duration(500)
                    .style("opacity", 0.8);
            },

            nodeHtmlExit: function(nodeHtmlExit){
                nodeHtmlExit.select(".gardening_approval")
                    .on("click", null);
            }
        }
    };

    public interfaceConfig:Object = {showInterface:false, showNonAudited:true, showApproved:true, showDissaproved:true};
    private knalledgeMapVOsService: any;
    private knAllEdgeRealTimeService: any;
    private globalEmitterServicesArray: GlobalEmittersArrayService;
    private knalledgeMapUpdateEventName:string = "knalledgeMapUpdateEvent";
    private rimaService: any;

    /**
    * the namespace for core services for the Notify system
    * @namespace knalledge.gardening.gardeningServices
    */

    /**
    * Service that is a plugin into knalledge.MapVisualization
    * @class ApprovalNodeService
    * @memberof knalledge.gardening.gardeningServices
    */
    constructor(KnalledgeMapVOsService, KnAllEdgeRealTimeService, _GlobalEmittersArrayService_, RimaService
        ) {
        this.knalledgeMapVOsService = KnalledgeMapVOsService;
        this.knAllEdgeRealTimeService = KnAllEdgeRealTimeService;
        this.globalEmitterServicesArray = _GlobalEmittersArrayService_;
        this.rimaService = RimaService;

		    this.globalEmitterServicesArray.register(this.knalledgeMapUpdateEventName);

        //this.getMockupRequests();
    }

    disapproveNode(node){
      this.setApproval(node, ApprovalState.DISAPPROVED);
    }

    setApproval(node, state){
      var whoAmi = this.rimaService.getActiveUserId();
      var patch = NodeGardened.createApprovalStatePatch(state, whoAmi);
      this.globalEmitterServicesArray.get(this.knalledgeMapUpdateEventName).broadcast('ApprovalNodeService');
      if(this.knAllEdgeRealTimeService){
        this.knalledgeMapVOsService.mapStructure.updateNode(node, APPROVAL_CHANGE_EVENT, patch);
      }
    }

    changeApproval(node){
      this.setApproval(node, NodeGardened.nextState(node.kNode));
    }
}
