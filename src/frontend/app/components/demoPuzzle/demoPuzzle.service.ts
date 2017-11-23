import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
//import {CollaboPluginsService} from 'collabo';
import {DemoPuzzle, DemoPuzzleExampleConstants} from './demoPuzzle';
import {Change, ChangeType, Domain, Event} from '../change/change';
import {CollaboGrammarService} from '../collaboPlugins/CollaboGrammarService';

declare var d3:any;
declare var knalledge;

@Injectable()
export class DemoPuzzleService {
  //public static MaxId: number = 0;
  //public id:number;
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
                  .attr("class", "demoPuzzle_decoration")
                  // .on("click", function(d){
                  //     d3.event.stopPropagation();
                  //     service.changeApproval(d);
                  //     // d3.select(this).remove();
                  //     // d3.select(this).style("display", "none");
                  // })
                  .html(function(d){
                    var label = "<i class='fa fa-user-secret' aria-hidden='true'></i>";
                    //var label = "<i class='fa fa-eye-slash' aria-hidden='true'></i>";
                    //var label = "<i class='fa fa-eye' aria-hidden='true'></i>";
                    return label;
                  });
          }.bind(this), // necessary for keeping reference on service

          nodeHtmlUpdate: function(nodeHtmlUpdate){
            var that = this;
              nodeHtmlUpdate.select(".demoPuzzle_decoration")
                  .style("display", function(d){
                      var display = "none";
                      // if((d.kNode.gardening && d.kNode.gardening.approval && d.kNode.gardening.approval.state)){
                      // 	display = "block";
                      // }
                      if(that.service.showDecoration(d)){
                        display = "block";
                      }
                      return display;
                  })
                  // .style("width", '2em')
                  // .style("height", '2em')
                  .html(function(d){
                    var label = "<i class='fa fa-user-secret' aria-hidden='true'></i>";
                    //var label = "<i class='fa fa-eye-slash' aria-hidden='true'></i>";
                    return label;
                  })
                  .style("opacity", 1e-6);

              var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".demoPuzzle_decoration").transition().delay(300).duration(500)
                  .style("opacity", 0.8);
          },

          nodeHtmlExit: function(nodeHtmlExit){
              nodeHtmlExit.select(".demoPuzzle_decoration")
                  .on("click", null);
          }
      }
  };

    demoPuzzle: DemoPuzzle = new DemoPuzzle();

    //demoPuzzle-panel-settings:
    public showOnlyDemoPuzzle: boolean = true;

    private demoPuzzlePluginInfo: any;
    private knAllEdgeRealTimeService: any;
    private showSubComponentInBottomPanelEvent: string = "showSubComponentInBottomPanelEvent";

    private initiated:boolean = false;
    private rimaService:any = null;

    /**
     * Service constructor
     * @constructor
     */
    constructor(
        @Inject('$injector') private $injector,
        //  @Inject('RimaService') private rimaService,
        // @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('KnalledgeMapPolicyService') private knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('CollaboPluginsService') private collaboPluginsService,
        private collaboGrammarService : CollaboGrammarService
        ) {
        let that = this;
        //this.id = ++DemoPuzzleService.MaxId;
        //globalEmitterServicesArray.register(this.showSubComponentInBottomPanelEvent);

        this.knAllEdgeRealTimeService = this.$injector.get('KnAllEdgeRealTimeService');
        let requestPluginOptions: any = {
            name: "RequestService",
            events: {
            }
        };
        if (this.knAllEdgeRealTimeService) {
            // requestPluginOptions.events[Event.DEMOPUZZLE_CHANGED] = this.receivedDemoPuzzleChange.bind(this);
            // this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
        }

        //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
        this.demoPuzzlePluginInfo = {
            name: "demoPuzzle",
            components: {

            },
            references: {
                mapVOsService: {
                    items: {
                        nodesById: {},
                        edgesById: {},
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                },
                map: {
                    items: {
                        mapStructure: {
                            nodesById: {},
                            edgesById: {}
                        }
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                }
            },
            apis: {
                map: {
                    items: {
                        update: null,
                        nodeSelected: null
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                },
                mapInteraction: {
                    items: {
                        addNode: null
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                }
            }
        };

        // this.demoPuzzlePluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.demoPuzzlePluginInfo.references.map.callback = function() {
            that.demoPuzzlePluginInfo.references.map.$resolved = true;
            // resolve(that.demoPuzzlePluginInfo.references.map);
            // reject('not allowed');
        };
        // });
        //
        // this.demoPuzzlePluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.demoPuzzlePluginInfo.apis.map.callback = function() {
            that.demoPuzzlePluginInfo.apis.map.$resolved = true;
            // resolve(that.demoPuzzlePluginInfo.apis.map);
            // reject('not allowed');
        };
        // });
        //

        //this.collaboPluginsService.registerPlugin(this.demoPuzzlePluginInfo);
    }

    init(){
      if(!this.initiated){
        this.initiated = true;
        this.rimaService = this.$injector.get('RimaService');
      }
    }
}
