import {Component, OnInit, Inject} from '@angular/core';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {ApprovalNodeService} from './approval.node.service';

import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

// import {MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material';
// import {KnalledgeMapViewService} from './knalledgeMapViewService';
// import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

// declare var knalledge;

/**
 * Directive that holds CollaboFramework tools on the left side of the map
 *
 * Selector: `knalledge-map-tools`
 * @class GardeningControls
 * @memberof knalledge.knalledgeMap
 * @constructor
*/
@Component({
    selector: 'gardening-controls',
    providers: [
        //MATERIAL_PROVIDERS
    ],
   styles: [`
    `],
    moduleId: module.id,
    templateUrl: 'partials/gardening-controls.tpl.html'
})

export class GardeningControls implements OnInit{
    // viewConfigChangedEventName:string = "viewConfigChangedEvent";
    // //viewspecChangedEventName:string = "viewspecChangedEvent";
    // behaviourChangedEventName:string = "behaviourChangedEvent";
    // broadcastingChangedEventName:string = "broadcastingChangedEvent";
    //
    // viewConfig:Object;

    public show:number;
    private policyConfig:any;
    private componentShown:boolean = false;

    // knRealTimeBroadcastUpdateMaps:string = "update-maps";
    // knRealTimeBroadcastReloadMaps:string = "reload-maps";

    //private knAllEdgeRealTimeService;

    private knalledgeMapUpdateEventName:string = "knalledgeMapUpdateEvent";

    constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        @Inject('ApprovalNodeService') private approvalNodeService:ApprovalNodeService,
        @Inject('GlobalEmittersArrayService') private globalEmitterServicesArray:GlobalEmittersArrayService
        // @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
        // @Inject('KnAllEdgeRealTimeService') _KnAllEdgeRealTimeService_,
        // @Inject('RimaService') _RimaService_

        // globalEmitterServicesArray:GlobalEmittersArrayService
    ) {
        console.log('[GardeningControls]');
        this.policyConfig = knalledgeMapPolicyService.get().config;
        // this.viewConfig = knalledgeMapViewService.get().config;

        this.globalEmitterServicesArray.register(this.knalledgeMapUpdateEventName);
        // this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;
        // this.rimaService = _RimaService_;

        // $scope.items.sort(compare);

        // if(this.rimaService.whoAmIs.$resolved){
        //   this.initUsers(this.rimaService.whoAmIs);
        // }else{
        //   this.rimaService.whoAmIs.$promise.then(function(whoAmIs){this.initUsers(whoAmIs);});
        // }
        console.log('[GardeningControls]');
        // $scope.howAmIs = RimaService.getAllHows();
    }

    // broadcastReloadMaps: Function = function(){
    //     this.knAllEdgeRealTimeService.emit(this.knRealTimeBroadcastReloadMaps);
    // };

    ngOnInit() {

    }

    get interfaceConfig(){
      return this.approvalNodeService.interfaceConfig;
    }

    hideShowComponent (){
      this.componentShown = !this.componentShown;
    }

    configChanged(){
      this.globalEmitterServicesArray.get(this.knalledgeMapUpdateEventName).broadcast('RimUsersList');
    }
}
