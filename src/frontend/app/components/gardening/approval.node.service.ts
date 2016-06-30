import {Injectable
} from '@angular/core';

import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

declare var d3:any;

@Injectable()
export class ApprovalNodeService {
    public EMITTER_NAME_REQUEST: string = 'EMITTER_NAME_REQUEST';

    plugins:any = {
        mapVisualizePlugins: {
            service: this,
            init: function init() {
                var that = this;
            },

            nodeHtmlEnter: function(nodeHtmlEnter){
                // .filter(function(d) { return d.kNode.dataContent && d.kNode.dataContent.image; })
                nodeHtmlEnter.append("div")
                    .attr("class", "approval")
                    .on("click", function(d){
                        d3.event.stopPropagation();
                        d.kNode.gardening = {
                            approval: {
                                state: 1
                            }
                        };
                        // d3.select(this).remove();
                        // d3.select(this).style("display", "none");
                    });
            },

            nodeHtmlUpdate: function(nodeHtmlUpdate){
                nodeHtmlUpdate.select(".approval")
                    .style("display", function(d){
                        var display = "none";
                        // if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
                        // 	display = "block";
                        // }
                        display = "block";
                        return display;
                    })
                    .style("width", '2em')
                    .style("height", '2em')
                    .html(function(d){
                        var label = "N";
                        if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
                            switch(d.kNode.gardening.approval.state){
                                case 1:
                                    label = "A";
                                    break;
                                default:
                                    label = "N";
                                    break;
                            }
                        }
                        return label;
                    })
                    .style("opacity", 1e-6);

                var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".approval").transition().delay(500).duration(500)
                    .style("opacity", 0.8);
            },

            nodeHtmlExit: function(nodeHtmlExit){
                nodeHtmlExit.select(".approval")
                    .on("click", null);
            }
        }
    };

    //private static EVENT_NAME_REQUEST: string = 'EVENT_NAME_REQUEST';
    private knalledgeMapVOsService: any;
    private knAllEdgeRealTimeService: any;
    private globalEmitterServicesArray: GlobalEmitterServicesArray;
    private requests: Request[] = [];

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

        //this.getMockupRequests();
    }
}
