import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
//import {CollaboPluginsService} from 'collabo';
import {Brainstorming} from './brainstorming';
import {Change, ChangeType, Domain, Event} from '../change/change';

@Injectable()
export class BrainstormingService {
    brainstorming: Brainstorming = new Brainstorming();
    private brainstormingPluginInfo: any;
    private knAllEdgeRealTimeService: any;
    /**
     * Service constructor
     * @constructor
     */
    constructor(
        @Inject('$injector') private $injector,
        //  @Inject('RimaService') private rimaService,
        // @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray//,
        , @Inject('CollaboPluginsService') private collaboPluginsService
        ) {
        let that = this;
        this.knAllEdgeRealTimeService = this.$injector.get('KnAllEdgeRealTimeService');
        let requestPluginOptions: any = {
            name: "RequestService",
            events: {
            }
        };
        if (this.knAllEdgeRealTimeService) {
            requestPluginOptions.events[Event.BRAINSTORMING_CHANGED] = this.receivedBrainstormingChange.bind(this);
            this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
        }

        //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
        this.brainstormingPluginInfo = {
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
                        update: null
                    },
                    $resolved: false,
                    callback: null,
                    $promise: null
                }
            }
        };

        // this.brainstormingPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.brainstormingPluginInfo.references.map.callback = function() {
            that.brainstormingPluginInfo.references.map.$resolved = true;
            // resolve(that.brainstormingPluginInfo.references.map);
            // reject('not allowed');
        };
        // });
        //
        // this.brainstormingPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
        this.brainstormingPluginInfo.apis.map.callback = function() {
            that.brainstormingPluginInfo.apis.map.$resolved = true;
            // resolve(that.brainstormingPluginInfo.apis.map);
            // reject('not allowed');
        };
        // });
        //

        this.collaboPluginsService.registerPlugin(this.brainstormingPluginInfo);
    }

    isSelectedNodeIbisQuestion(): boolean {
        if (!this.brainstormingPluginInfo.references.map.$resolved) return false;

        var vkNode = this.brainstormingPluginInfo.references.map.items.mapStructure.getSelectedNode();
        if(!vkNode) return false;
        return (vkNode.kNode.type === 'type_ibis_question');
    }

    sendBrainstorming(callback: Function) {

        // this.brainstorming.mapId = this.knalledgeMapVOsService.getMapId();
        // this.brainstorming.who = this.rimaService.getWhoAmI()._id;
        console.log(this.brainstorming);

        if (this.knAllEdgeRealTimeService) {
            let change = new Change();
            change.value = this.brainstorming;
            change.reference = this.brainstorming.question;
            change.type = ChangeType.BEHAVIORAL;
            change.domain = Domain.GLOBAL;
            change.event = Event.BRAINSTORMING_CHANGED;
            this.knAllEdgeRealTimeService.emit(change.event, change);
            callback(true);
        } else {
            callback(false, 'SERVICE_UNAVAILABLE');
        }
    }

    private receivedBrainstormingChange(event: string, change: Change) {
        let receivedBrainstorming: Brainstorming = Brainstorming.factory(change.value);
        console.warn("[receivedBrainstormingChange]receivedBrainstorming: ", receivedBrainstorming);

        // how it was earlier in knalledgeMap/directives.js (TO REMOVE FROM THERE AND FROM OTHER PLACES OLD LOGICS)
        // var realTimeBehaviourChanged = function(eventName, msg){
        //   console.log('realTimeBehaviourChanged:', eventName,'msg:', msg);
        //
        //   switch(msg.path){
        //     case 'policyConfig.behaviour.brainstorming':
        //       KnalledgeMapPolicyService.provider.config.behaviour.brainstorming = msg.value;
        //       break;
        //   }
        //   updateState(msg.value);
        //   $scope.knalledgeMap.update();
        // }
    }


};
