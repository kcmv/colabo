import {Component} from 'angular2/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
// import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "angular2/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {RequestComponent} from '../request/request.component';
import {SuggestionComponent} from '../suggestion/suggestion.component';
import {upgradeAdapter} from '../../js/upgrade_adapter';

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
    providers: [],
    directives: [
        MATERIAL_DIRECTIVES,
        RequestComponent,
        SuggestionComponent,
        upgradeAdapter.upgradeNg1Component('ontovSearch'),
        upgradeAdapter.upgradeNg1Component('rimaRelevantList')
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

    constructor(
        // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[TopPanel]');

        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
    };
}
