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
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import { HTTP_PROVIDERS } from '@angular/http';

export interface ITabData {
  title: string;
  content: string;
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
    // t_emplateUrl: 'components/topiChat/partials/reports.tpl.html',
    styles: [`
        .md-list-item-text {
            border-bottom: 1px solid gray;
            padding-bottom: 3px;
            margin-bottom: 2px;
        }
    `]
})
export class TopPanel {

    public newRelevantsNo:number = 0;
    public newChangesNo:number = 0;
    public newSuggestionssNo:number = 0;
    public newRequestsNo:number = 0;
    policyConfig:Object;

    public tabs: ITabData[] = [
      {title: 'suggestions', content: '<suggestion-component></suggestion-component>'},
      {
        title: 'changes',
        content: "<change-component (newChange)='updateChangesNo($event)' [initializeWithChangesFromServer]='true' [followChanges]='true'>"
        +
        "</change-component>"
      },
      {
        title: 'relevant',
        content: '<rima-relevant-list class="rima_relevant_list"></rima-relevant-list>'
        // content: '<div class="rima-relevant-list" class="rima_relevant_list"></div>'
      }
    ];
    selected = null;
    previous = null;
    private _selectedIndex: number = 1;

    private changeService: ChangeService;

    constructor(
        // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
        // globalEmitterServicesArray:GlobalEmitterServicesArray
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService
    ) {
        console.log('[TopPanel]');
        this.policyConfig = knalledgeMapPolicyService.get().config;
        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
        //this.changeService.onChangeHandler =
        // for(var i:number = 0; i< tabs. addTab(title, view)
    };

    @Input()
    set selectedIndex(value: number) {
      this.previous = this.selected;
      this.selected = this.tabs[value];
      this._selectedIndex = value;
    }
    get selectedIndex(): number {
      return this._selectedIndex;
    }
    addTab(title, view) {
      view = view || title + ' Content View';
      this.tabs.push({title: title, content: view, disabled: false});
    }

    // removeTab(tab: ITabData) {
    //   var index = this.tabs.indexOf(tab);
    //   this.tabs.splice(index, 1);
    //   this.selectedIndex = Math.min(index, this.tabs.length - 1);
    // }

    opened() {
      console.log("top panel is opened");
    }

    // updateChangesNo(no){
    //   console.log("[updateChangesNo] event:", no);
    //   this.newChangesNo = no;
    //   //this.changesTitle = (no > 0) ? (ChangeComponent.TITLE + " (" + no + ")") : ChangeComponent.TITLE;
    // }
}
