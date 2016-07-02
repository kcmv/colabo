import {Component, OnInit, Inject} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES} from "@angular/common";

import {NgIf} from '@angular/common';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';

// import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
// import {MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material';
// import {KnalledgeMapViewService} from './knalledgeMapViewService';
// import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

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
        MATERIAL_PROVIDERS
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        // MdList, MdListItem, MdContent, MdButton, MdSwitch,
        NgIf,
        // MdRadioButton, MdRadioGroup,
        //
        MD_INPUT_DIRECTIVES
   ],
   styles: [`
        // .msg {
        //     font-size: 0.5em;
        // }
        // .container{
        //     margin: 5px;
        //     border: 1px solid gray;
        // }
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

    // private globalEmitterServicesArray:GlobalEmitterServicesArray;

    constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService
        // @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
        // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray,
        // @Inject('KnAllEdgeRealTimeService') _KnAllEdgeRealTimeService_,
        // @Inject('RimaService') _RimaService_

        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[GardeningControls]');
        this.policyConfig = knalledgeMapPolicyService.get().config;
        // this.viewConfig = knalledgeMapViewService.get().config;

        // this.globalEmitterServicesArray = globalEmitterServicesArray;
        // globalEmitterServicesArray.register(this.viewConfigChangedEventName);
        //globalEmitterServicesArray.register(this.viewspecChangedEventName);
        // globalEmitterServicesArray.register(this.behaviourChangedEventName);
        // globalEmitterServicesArray.register(this.broadcastingChangedEventName);
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

    hideShowComponent (){
      this.componentShown = !this.componentShown;
    }
}
