import {Component, ViewEncapsulation, Inject, Input} from '@angular/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from '@angular/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs';
// import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "@angular/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {RequestComponent} from '../request/request.component';
import {SuggestionComponent} from '../suggestion/suggestion.component';
import {ChangeComponent} from '../change/change.component';
import {ChangeService} from '../change/change.service';
import {SuggestionService} from '../suggestion/suggestion.service';
import {RequestService} from '../request/request.service';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import { HTTP_PROVIDERS } from '@angular/http';

export interface ITabData {
  title: string;
  content: string;
  service: any;
  newItems?: number;
  totalItems?: number;
  disabled?: boolean;
}

/**
 * Directive that
 * 1. reports all plugins registered to the topiChat communication service
 * 1. reports all messages that marshals through the topiChat communication layer
 *
 * Selector: `topichat-reports`
 * @class KnalledgeMapTools
 * @memberof topiChat
 * @constructor
*/


@Component({
    selector: 'top-panel', //'topichat-reports',
    encapsulation: ViewEncapsulation.None,
    providers: [
      HTTP_PROVIDERS
    ],
    directives: [
        MD_TABS_DIRECTIVES,
        MATERIAL_DIRECTIVES,
        RequestComponent,
        SuggestionComponent,
        ChangeComponent,
        upgradeAdapter.upgradeNg1Component('ontovSearch'),
        upgradeAdapter.upgradeNg1Component('rimaRelevantList'),
   ],
   pipes: [DatePipe, OrderArrayPipe],
   moduleId: module.id, // necessary for having relative paths for templateUrl
   templateUrl: 'partials/top_panel.tpl.html',
    // t_emplateUrl: 'components/topiChat/partials/reports.tpl.html'
})
export class TopPanel {

    // public newRelevantsNo:number = 0;
    // public newChangesNo:number = 0;
    // public newSuggestionssNo:number = 0;
    // public newRequestsNo:number = 0;
    policyConfig:Object;

    selected = null;
    previous = null;

    //public tabs: ITabData[] = [ <-- this version is used for dynamic tabs
    //but we don't use dynamic tabs until we fix tags injectinon in their content.
    private tabData: ITabData[] = [
      {
        title: 'suggestions',
        content: '<suggestion-component></suggestion-component>',
        service: this.suggestionService,
        newItems: 0,
        totalItems: 0
      },
      {
        title: 'relevant',
        content: '<rima-relevant-list class="rima_relevant_list"></rima-relevant-list>',
        service: null,
        newItems: 0,
        totalItems: 0
      },
      {
        title: 'changes',
        content: "<change-component (newChange)='updateChangesNo($event)' [initializeWithPreviousChanges]='true' [followChanges]='true'>"
        +
        "</change-component>",
        service: this.changeService,
        newItems: 0,
        totalItems: 0
      },
      {
        title: 'requests',
        content: '<request></request>',
        service: this.requestService,
        newItems: 0,
        totalItems: 0
      }
    ];

    //private _selectedIndex: number;

    constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        private changeService: ChangeService,
        @Inject('SuggestionService') private suggestionService:SuggestionService,
        @Inject('RequestService') private requestService:RequestService
    ) {
        this.policyConfig = knalledgeMapPolicyService.get().config;
        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
        //this.changeService.onChangeHandler =
        for(var i:number = 0; i< this.tabData.length; i++){
          var tab = this.tabData[i];
          if(tab.service &&
          'onChangeHandler' in tab.service //typeof tab.service.onChangeHandler === ‘function’ cannot be used ...
          //because `typeof tab.service.onChangeHandler` returns 'undefined'
          ){
            var that:TopPanel = this;
            var tabIndex: number = i;
            tab.service.onChangeHandler = function(no){
              that.updateChangesNo(no,tabIndex);
            };
          }
        }
    };

    // @Input()
    // set selectedIndex(value: number) {
    //   this.previous = this.selected;
    // //  this.selected = this.tabs[value];
    //   this._selectedIndex = value;
    //   this.tabData[value].newItems = 0;
    // }
    //
    // get selectedIndex(): number {
    //   return this._selectedIndex;
    // }
    //
    getTitle(tabIndex: number): string {
      return this.tabData[tabIndex].title + (this.tabData[tabIndex].newItems > 0 ?
        ' (' + this.tabData[tabIndex].newItems + '/' + this.tabData[tabIndex].totalItems + ')' : '');
    }

    focusChanged(tabIndex){
      console.log("focusChanged", tabIndex);
      //this._selectedIndex = tabIndex;
      this.tabData[tabIndex].newItems = 0;
    }

    selectedChanged(event){
      console.log("selectedChanged", event);
      //this._selectedIndex = event;
    }

    // addTab(title, view) {
    //   view = view || title + ' Content View';
    //   this.tabs.push({title: title, content: view, disabled: false});
    // }

    // removeTab(tab: ITabData) {
    //   var index = this.tabs.indexOf(tab);
    //   this.tabs.splice(index, 1);
    //   this.selectedIndex = Math.min(index, this.tabs.length - 1);
    // }

    opened() {
      console.log("top panel is opened");
    }

    updateChangesNo(no: number, tabIndex:number){
      console.log("[updateChangesNo] event:", no);
      if(tabIndex < this.tabData.length){
        this.tabData[tabIndex].totalItems +=no;
        this.tabData[tabIndex].newItems +=no;
      }
      //this.changesTitle = (no > 0) ? (ChangeComponent.TITLE + " (" + no + ")") : ChangeComponent.TITLE;
    }
}
