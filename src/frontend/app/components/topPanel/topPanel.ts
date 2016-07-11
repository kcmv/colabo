import {Component, Inject} from '@angular/core';
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
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import { HTTP_PROVIDERS } from '@angular/http';

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

    constructor(
        // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
        // globalEmitterServicesArray:GlobalEmitterServicesArray
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService
    ) {
        console.log('[TopPanel]');
        this.policyConfig = knalledgeMapPolicyService.get().config;
        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
    };

    opened() {
      console.log("top panel is opened");
    }

    updateChangesNo(no){
      console.log("[updateChangesNo] event:", no);
      this.newChangesNo = no;
      //this.changesTitle = (no > 0) ? (ChangeComponent.TITLE + " (" + no + ")") : ChangeComponent.TITLE;
    }
}
