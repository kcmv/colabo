import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

declare var knalledge;

@Injectable()
export class OntovService {
    searchFacets = [];
    private ontovPluginInfo: any;
    private knAllEdgeRealTimeService: any;
    private registeredFacets: any = {};
    private mapStructure:any;

    /**
     * Service constructor
     * @constructor
     */
    constructor(
        @Inject('$injector') private $injector,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('CollaboPluginsService') private collaboPluginsService
        ) {
        let that = this;

        // globalEmitterServicesArray.register(this.showSubComponentInBottomPanelEvent);

        // this.knAllEdgeRealTimeService = this.$injector.get('KnAllEdgeRealTimeService');
        // let requestPluginOptions: any = {
        //     name: "RequestService",
        //     events: {
        //     }
        // };
        // if (this.knAllEdgeRealTimeService) {
        //     requestPluginOptions.events[Event.BRAINSTORMING_CHANGED] = this.receivedBrainstormingChange.bind(this);
        //     this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
        // }

        //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
        this.ontovPluginInfo = {
            name: "brainstorming",
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
                }
            }
        };

        // this.ontovPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.ontovPluginInfo.references.map.callback = function() {
            that.ontovPluginInfo.references.map.$resolved = true;
            that.mapStructure = that.ontovPluginInfo.references.map.items.mapStructure;
            // resolve(that.ontovPluginInfo.references.map);
            // reject('not allowed');
        };
        // });
        //
        // this.ontovPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.ontovPluginInfo.apis.map.callback = function() {
            that.ontovPluginInfo.apis.map.$resolved = true;
            // resolve(that.ontovPluginInfo.apis.map);
            // reject('not allowed');
        };
        // });
        //

        this.collaboPluginsService.registerPlugin(this.ontovPluginInfo);

        this.registerFacet("Name", {
          getFacetMatches: this._getFacetMatches_Name
        });

        this.registerFacet("Type", {
          getFacetMatches: this._getFacetMatches_Type
        });

        this.registerFacet("Who", {
          getFacetMatches: this._getFacetMatches_Who
        });

        this.registerFacet("What", {
          getFacetMatches: this._getFacetMatches_What
        });

        this.registerFacet("Tree", {
          getFacetMatches: this._getFacetMatches_Tree
        });
    }

    getFacets(){
      return this.searchFacets;
    }

    getFacetMatches(facet:string, searchTerm:string){
      if(facet in this.registeredFacets){
        return this.registeredFacets[facet].getFacetMatches(searchTerm);
      }else{
        return ['<ERROR: UNKNOWN_FACET>'];
      }
    }

    registerFacet(facet:string, options:any){
      console.log("[ontov.OntovService] new facet is registered: ", facet);
      this.registeredFacets[facet] = options;
      this.searchFacets.push(facet);
    }

    _getFacetMatches_Name(searchTerm:string){
      if(this.mapStructure){
          var nodeNameObj = {};
          for(let id in this.mapStructure.nodesById){
            var vkNode = this.mapStructure.nodesById[id];
            nodeNameObj[vkNode.kNode.name] = true;
          }
          return Object.keys(nodeNameObj);
      }else{
        return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
      }
    }

    _getFacetMatches_Type(searchTerm:string){
      return ['type_knowledge', 'type_ibis_question', 'type_ibis_idea', 'type_ibis_argument', 'type_ibis_comment'];
    }

    _getFacetMatches_Who(searchTerm:string){
      return ['Sasha', 'Sinisha', 'Dino', 'Alexander', 'John'];
    }

    _getFacetMatches_What(searchTerm:string){
      return ['ISSS', 'system', 'todo', 'sustainable'];
    }

    _getFacetMatches_Tree(searchTerm:string){
      return ['name_1', 'name_2', 'name_3', 'name_4'];
    }
};
