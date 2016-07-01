import {Injectable
} from '@angular/core';

import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
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
                nodeHtmlUpdate.select(".gardening_approval")
                    .style("display", function(d){
                        var display = "none";
                        // if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
                        // 	display = "block";
                        // }
                        display = "block";
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

    private knalledgeMapVOsService: any;
    private knAllEdgeRealTimeService: any;
    private globalEmitterServicesArray: GlobalEmitterServicesArray;
    private knalledgeMapUpdateEventName:string = "knalledgeMapUpdateEvent";

    /**
    * the namespace for core services for the Notify system
    * @namespace knalledge.gardening.gardeningServices
    */

    /**
    * Service that is a plugin into knalledge.MapVisualization
    * @class ApprovalNodeService
    * @memberof knalledge.gardening.gardeningServices
    */
    constructor(KnalledgeMapVOsService, KnAllEdgeRealTimeService, _GlobalEmitterServicesArray_
        ) {
        this.knalledgeMapVOsService = KnalledgeMapVOsService;
        this.knAllEdgeRealTimeService = KnAllEdgeRealTimeService;
        this.globalEmitterServicesArray = _GlobalEmitterServicesArray_;

		    this.globalEmitterServicesArray.register(this.knalledgeMapUpdateEventName);

        //this.getMockupRequests();
    }

    changeApproval(node){
      var state = NodeGardened.nextState(node.kNode);
      var patch = NodeGardened.createApprovalStatePatch(state);
      this.globalEmitterServicesArray.get(this.knalledgeMapUpdateEventName).broadcast('ApprovalNodeService');
      if(this.knAllEdgeRealTimeService){
        this.knalledgeMapVOsService.mapStructure.updateNode(node, APPROVAL_CHANGE_EVENT, patch);
      }
    }
}
