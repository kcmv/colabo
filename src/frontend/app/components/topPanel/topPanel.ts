import {Component, Inject} from 'angular2/core';
import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MdRadioDispatcher, MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "angular2/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";

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
    providers: [MdRadioDispatcher],
    directives: [
        MATERIAL_DIRECTIVES,
        NgIf, NgFor, FORM_DIRECTIVES,
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
    config:any = {
        sniff: true
    };
    plugins:any;

    constructor(
        @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[TopPanel]');

        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);

        this.globalEmitterServicesArray = globalEmitterServicesArray;
    };
    private globalEmitterServicesArray:GlobalEmitterServicesArray;

    configChanged(path, value) {
        return;
    };

}
