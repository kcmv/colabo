import {Component, Inject} from 'angular2/core';
import {NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {SidenavService, MdRadioDispatcher, MATERIAL_DIRECTIVES} from 'ng2-material/all';
// import {SidenavService, MdList, MdListItem, MdContent, MdButton, MdSwitch} from 'ng2-material/all';
import {KnalledgeMapPolicyService} from './knalledgeMapPolicyService';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

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
    templateUrl: 'components/knalledgeMap/partials/tools.tpl.html',
    styles: [`
        .msg {
            font-size: 0.5em;
        }
        .container{
            margin: 5px;
            border: 1px solid gray;
        }
    `]
})
export class KnalledgeMapTools {
    mapStylingChangedEventName:string = "mapStylingChangedEvent";
    viewspecChangedEventName:string = "viewspecChangedEvent";
    syncingChangedEventName:string = "syncingChangedEvent";

    constructor(
        sidenavService:SidenavService,
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
        @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[KnalledgeMapTools]');
        this.sidenavService = sidenavService;
        this.policyConfig = knalledgeMapPolicyService.get().config;
        this.viewConfig = knalledgeMapViewService.get().config;

        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);

        this.globalEmitterServicesArray = globalEmitterServicesArray;
        globalEmitterServicesArray.register(this.mapStylingChangedEventName);
        globalEmitterServicesArray.register(this.viewspecChangedEventName);
        globalEmitterServicesArray.register(this.syncingChangedEventName);
    };
    public data: any = {
       cb1: true,
       cb4: true,
       cb5: false
     };
     public message = 'false';
    bindings:Object = {
        viewspec: 'viewspec_manual'
    };
    visualization:Object = {
        limitedRange: false
    };

    viewConfig:Object;
    policyConfig:Object;

    private globalEmitterServicesArray:GlobalEmitterServicesArray;
    private sidenavService:SidenavService;
    toggleList:Function = function(user:Object){
        // this.sidenavService('left').toggle();
        var result = this.sidenavService.hide('left');
        console.log("[toggleList] result: ", result);
        return;
    };
    public onChange(cbState) {
      this.message = cbState;
    };

    limitDisplayChanged:Function = function(path, value){
        var val = (this.visualization.limitedRange) ? 3 : -1;
        // alert("[viewConfigChanged] " + path + ":" + value);
        let msg = {
            path: path,
            value: val
        };
        this.viewConfig.filtering.displayDistance = val;

        this.globalEmitterServicesArray.get(this.mapStylingChangedEventName).broadcast('KnalledgeMapTools', msg);
    };

    viewConfigChanged:Function = function(path, value){
        // alert("[viewConfigChanged] " + path + ":" + value);
        let msg = {
            path: path,
            value: value
        };

        this.globalEmitterServicesArray.get(this.mapStylingChangedEventName).broadcast('KnalledgeMapTools', msg);
    };

    viewspecChanged: Function = function(viewSpec){
        // alert("viewspecChanged: "+viewSpec);
        console.log("[knalledgeMapTools] viewspec: %s", this.bindings.viewspec);
        console.log("result:" + JSON.stringify(this.bindings));
        this.globalEmitterServicesArray.get(this.viewspecChangedEventName).broadcast('KnalledgeMapTools', this.bindings.viewspec);
    };

    brainstormingChanged: Function = function(path, value){
        // alert("brainstormingChanged: "+brainstormingSpec);
        //console.log("[knalledgeMapTools] brainstormingSpec: %s", this.bindings.viewspec);
        //console.log("result:" + JSON.stringify(this.bindings));
        let msg = {
            path: path,
            value: value
        };
        this.globalEmitterServicesArray.get(this.mapStylingChangedEventName).broadcast('KnalledgeMapTools', msg);
    };

    syncingChanged = function(){
        // console.log("result:" + JSON.stringify(result));
        this.globalEmitterServicesArray.get(this.syncingChangedEventName).broadcast('KnalledgeMapTools');
    };
}
