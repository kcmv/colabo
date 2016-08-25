import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

declare var d3:any;

export const PLUGIN_NAME:string = 'PUZZLE_PRESENTATION';

@Injectable()
export class CfPuzzlesPresentationServices {
    plugins:any = {
        mapVisualizePlugins: {
            service: this,
            store: {
              enabled: true
            },
            init: function init() {
                var that = this;
            },

            nodeHtmlUpdate: function(nodeHtmlUpdate){
              var that = this;

              if(!that.store.enabled) return;

              nodeHtmlUpdate.select(".node_presentation")
            		.style("display", function(d){
            			return (that.service.knalledgeMapViewService.provider.config.nodes.showTypes && d.kNode && d.kNode.type) ? "block" : "none";
            		})
            		.html(function(d){
            			var label = "";
            			if(d.kNode && d.kNode.type){
            				var type = d.kNode.type;
            			}
            			return label;
            		})
            		.on("click", function(d){
            			console.log('presentation clicked for node ',d.kNode.name);
            			d3.event.stopPropagation();
            			that.upperAPI.nodeTypeClicked(d);
            		});
            }
        }
    };

    /**
    * the namespace for core services for the Notify system
    * @namespace knalledge.gardening.gardeningServices
    */

    /**
    * Service that is a plugin into knalledge.MapVisualization
    * @class CfPuzzlesPresentationServices
    * @memberof knalledge.gardening.gardeningServices
    */
    constructor(
      @Inject('KnalledgeMapViewService') private knalledgeMapViewService
    ) {
    }

    restart(){

    }

    finish(){

    }
}
