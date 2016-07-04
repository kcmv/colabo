import {Component, Inject} from '@angular/core';
import {NgIf, FORM_DIRECTIVES} from '@angular/common';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
// import {MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material';
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

import {PluginsPreloader} from '../collaboPlugins/pluginsPreloader';

var componentDirectives = [
    MATERIAL_DIRECTIVES,
    // MdList, MdListItem, MdContent, MdButton, MdSwitch,
    NgIf, FORM_DIRECTIVES,
    MdRadioButton, MdRadioGroup,
    //upgradeAdapter.upgradeNg1Component('rimaUsersList'),
    upgradeAdapter.upgradeNg1Component('ibisTypesList')
];

declare var Config: any;

if (Config.Plugins.gardening.active && PluginsPreloader.components.GardeningControls) {
    console.warn("[KnalledgeMapTools] Loading GardeningControls");
    componentDirectives.push(PluginsPreloader.components.GardeningControls);
} else {
    console.warn("[KnalledgeMapTools] Not loading GardeningControls");
}

if (Config.Plugins.rima.active && PluginsPreloader.components.RimaUsersList) {
    console.warn("[KnalledgeMapTools] Loading RimaUsersList");
    componentDirectives.push(PluginsPreloader.components.RimaUsersList);
} else {
    console.warn("[KnalledgeMapTools] Not loading RimaUsersList");
}

@Component({
    selector: 'knalledge-map-tools',
    providers: [MdRadioDispatcher],
    directives: componentDirectives,
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
    viewConfigChangedEventName: string = "viewConfigChangedEvent";
    //viewspecChangedEventName:string = "viewspecChangedEvent";
    behaviourChangedEventName: string = "behaviourChangedEvent";
    broadcastingChangedEventName: string = "broadcastingChangedEvent";

    viewConfig: Object;
    policyConfig: Object;

    knRealTimeBroadcastUpdateMaps: string = "update-maps";
    knRealTimeBroadcastReloadMaps: string = "reload-maps";

    //TODO: `limitedRangeCheckBoxValue` should be changed to `config.filtering.displayDistance` when we change checkBox to some NumberSLide
    public limitedRangeCheckBoxValue: boolean = false;
    public visualizationControlsShown: boolean = true;
    private knAllEdgeRealTimeService;
    private globalEmitterServicesArray: GlobalEmitterServicesArray;

    constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService: KnalledgeMapViewService,
        @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('KnAllEdgeRealTimeService') _KnAllEdgeRealTimeService_

        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[KnalledgeMapTools]');
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

    //TODO: eliminate this function and use directly `viewConfigChanged` when switch values are set to exact values
    limitDisplayChanged: Function = function(path, value) {
        this.viewConfig.filtering.displayDistance = (value) ? 3 : -1;
        this.viewConfigChanged(path, this.viewConfig.filtering.displayDistance);
        //this.globalEmitterServicesArray.get(this.viewConfigChangedEventName).broadcast('KnalledgeMapTools', msg);
    };

    // switchClicked:Function = function($el){
    //   var elSwitch = $element.find('.content');
    //   $(elSwitch).slideToggle();
    // };

    viewConfigChanged: Function = function(path, value) {
        // alert("[viewConfigChanged] " + path + ":" + value);
        this.sendChange(path, value, this.viewConfigChangedEventName);
        //this.globalEmitterServicesArray.get(this.viewspecChangedEventName).broadcast('KnalledgeMapTools', this.bindings.viewspec);
    };

    brainstormingChanged: Function = function(path, value) {
        this.sendChange(path, value, this.behaviourChangedEventName);
    };

    broadcastingChanged: Function = function(path, value) {
        this.sendChange(path, value, this.broadcastingChangedEventName);
    };

    hideShowVisualizationControls(){
      this.visualizationControlsShown = !this.visualizationControlsShown;
    }

    sendChange: Function = function(path, value, eventName) {
        // alert("[sendChange] " + path + ":" + value);
        let msg = {
            path: path,
            value: value
        };
        this.globalEmitterServicesArray.get(eventName).broadcast('KnalledgeMapTools', msg);
    };

    broadcastUpdateMaps: Function = function() {
        this.knAllEdgeRealTimeService.emit(this.knRealTimeBroadcastUpdateMaps);
    };

    broadcastReloadMaps: Function = function() {
        this.knAllEdgeRealTimeService.emit(this.knRealTimeBroadcastReloadMaps);
    };
}
