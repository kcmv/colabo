import {Component, Inject} from 'angular2/core';
import {NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {SidenavService, MdRadioDispatcher, MATERIAL_DIRECTIVES} from 'ng2-material/all';
// import {SidenavService, MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material/all';
import {KnalledgeMapPolicyService} from './knalledgeMapPolicyService';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

/**
 * Directive that holds CollaboFramework tools on the left side of the map
 *
 * Selector: `knalledge-map-tools`
 * @class KnalledgeMapTools
 * @memberof knalledge.knalledgeMap
 * @constructor
*/

@Component({
    selector: 'knalledge-map-tools',
    providers: [SidenavService, MdRadioDispatcher],
    directives: [
        MATERIAL_DIRECTIVES,
        // , MdRadioDispatcher, SidenavService
        // MdList, MdListItem, MdContent, MdButton, MdSwitch,
        NgIf, FORM_DIRECTIVES,
        upgradeAdapter.upgradeNg1Component('rimaUsersList'),
        upgradeAdapter.upgradeNg1Component('ibisTypesList')
   ],
   styles: [`
        .msg {
            font-size: 0.5em;
        }
        .container{
            margin: 5px;
            border: 1px solid gray;
        }
    `],
    moduleId: module.id,
    templateUrl: 'partials/tools.tpl.html',
})

export class KnalledgeMapTools {
    viewConfigChangedEventName:string = "viewConfigChangedEvent";
    //viewspecChangedEventName:string = "viewspecChangedEvent";
    behaviourChangedEventName:string = "behaviourChangedEvent";
    broadcastingChangedEventName:string = "broadcastingChangedEvent";

    constructor(
        sidenavService:SidenavService,
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
        @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray,
        @Inject('KnAllEdgeRealTimeService') _KnAllEdgeRealTimeService_

        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[KnalledgeMapTools]');
        this.sidenavService = sidenavService;
        this.policyConfig = knalledgeMapPolicyService.get().config;
        this.viewConfig = knalledgeMapViewService.get().config;

        this.globalEmitterServicesArray = globalEmitterServicesArray;
        globalEmitterServicesArray.register(this.viewConfigChangedEventName);
        //globalEmitterServicesArray.register(this.viewspecChangedEventName);
        globalEmitterServicesArray.register(this.behaviourChangedEventName);
        globalEmitterServicesArray.register(this.broadcastingChangedEventName);
        this.knAllEdgeRealTimeService = _KnAllEdgeRealTimeService_;
    };

    // bindings:Object = {
    //     viewspec: 'viewspec_manual'
    // };
    // visualization:Object = {
    //     limitedRange: false
    // };

    viewConfig:Object;
    policyConfig:Object;

    knRealTimeBroadcastUpdateMaps:string = "update-maps";
    knRealTimeBroadcastReloadMaps:string = "reload-maps";

    //TODO: `limitedRangeCheckBoxValue` should be changed to `config.filtering.displayDistance` when we change checkBox to some NumberSLide
    public limitedRangeCheckBoxValue:boolean = false;
    private knAllEdgeRealTimeService;
    private globalEmitterServicesArray:GlobalEmitterServicesArray;
    private sidenavService:SidenavService;

    // toggleComponentView:Function = function(componentName){
    //     // this.sidenavService('left').toggle();
    //     var result = this.sidenavService.hide('left');
    //     console.log("[toggleList] result: ", result);
    //     return;
    // };

    toggleList:Function = function(user:Object){
        // this.sidenavService('left').toggle();
        var result = this.sidenavService.hide('left');
        console.log("[toggleList] result: ", result);
        return;
    };

    //TODO: eliminate this function and use directly `viewConfigChanged` when switch values are set to exact values
    limitDisplayChanged:Function = function(path, value){
        this.viewConfig.filtering.displayDistance = (value) ? 3 : -1;
        this.viewConfigChanged(path, this.viewConfig.filtering.displayDistance);
        //this.globalEmitterServicesArray.get(this.viewConfigChangedEventName).broadcast('KnalledgeMapTools', msg);
    };

    // switchClicked:Function = function($el){
    //   var elSwitch = $element.find('.content');
    //   $(elSwitch).slideToggle();
    // };

    viewConfigChanged:Function = function(path, value){
        // alert("[viewConfigChanged] " + path + ":" + value);
      this.sendChange(path, value, this.viewConfigChangedEventName);
      //this.globalEmitterServicesArray.get(this.viewspecChangedEventName).broadcast('KnalledgeMapTools', this.bindings.viewspec);
    };

    brainstormingChanged: Function = function(path, value){
        this.sendChange(path, value, this.behaviourChangedEventName);
    };

    broadcastingChanged: Function = function(path, value){
        this.sendChange(path, value, this.broadcastingChangedEventName);
    };

    sendChange:Function = function(path, value, eventName){
        // alert("[sendChange] " + path + ":" + value);
        let msg = {
            path: path,
            value: value
        };
        this.globalEmitterServicesArray.get(eventName).broadcast('KnalledgeMapTools', msg);
    };

    broadcastUpdateMaps: Function = function(){
        this.knAllEdgeRealTimeService.emit(this.knRealTimeBroadcastUpdateMaps);
    };

    broadcastReloadMaps: Function = function(){
        this.knAllEdgeRealTimeService.emit(this.knRealTimeBroadcastReloadMaps);
    };
}
