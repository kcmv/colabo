import {Component, Inject} from 'angular2/core';
import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MdRadioDispatcher, MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {TopiChatService} from '../topiChat/topiChatService';
import {TopiChatConfigService} from './topiChatConfigService';

@Component({
    selector: 'topichat-reports',
    providers: [MdRadioDispatcher],
    directives: [
        MATERIAL_DIRECTIVES,
        NgIf, NgFor, FORM_DIRECTIVES,
   ],
    templateUrl: 'components/topiChat/partials/reports.tpl.html',
})
export class TopiChatReports {
    config:any = {
        sniff: true
    };
    plugins:any;

    constructor(
        @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray,
        @Inject('TopiChatService') topiChatService:TopiChatService,
        @Inject('TopiChatConfigService') topiChatConfigService:TopiChatConfigService
        // globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[TopiChatReports]');

        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);

        this.globalEmitterServicesArray = globalEmitterServicesArray;
        this.topiChatService = topiChatService;
        this.topiChatConfigService = topiChatConfigService;
        this.plugins = this.getPlugins();
    };
    private globalEmitterServicesArray:GlobalEmitterServicesArray;
    private topiChatService:TopiChatService;
    private topiChatConfigService:TopiChatConfigService;

    configChanged(path, value) {
        return;
    };

    addPlugin():any {
        var pluginOptions: any = {
            name: 'test',
            events: {
                event1: function event1f(){return "event1";},
                event2: function event1f(){return "event2";}
            }
        };

        this.topiChatService.registerPlugin(pluginOptions);
    };

    /**
     * Transforms hash array of plugins and events into array
     * that is user friendly with directives like *ngFor
     * @return {any} plugins array
     */
    getPlugins():any {
        var plugins = this.topiChatService.getPlugins();
        var pluginsArray = [];
        for(let pI in plugins) {
            var plugin = plugins[pI];
            var pluginObj:any = {};
            pluginsArray.push(pluginObj);

            pluginObj.name = plugin.name;

            var events = plugin.events;
            var eventsArray = [];
            for(let eI in events) {
                var eventObj:any = {};
                eventObj.name = eI;
                eventsArray.push(eventObj);
            }
            pluginObj.events = eventsArray;
        }
        return pluginsArray;
    };

    /**
    * Transforms hash array of event into array
    * that is user friendly with directives like *ngFor
     * @return {any} events list
     */
    getEvents():any {
        var events = this.topiChatService.getEvents();
        var eventsArray = [];
        for(let eI in events) {
            var event = events[eI];
            var eventObj:any = {};
            eventsArray.push(eventObj);

            eventObj.name = eI;
            eventObj.plugins = [];

            // currently event contains only array of plugin options
            var plugins = event;
            for(let pI in plugins) {
                eventObj.plugins.push(plugins[pI].name);
            }
        }
        return eventsArray;
    };

    getMessagesForEvent(eventName):Object[] {
        var messages = this.topiChatService.getMessagesForEvent(eventName);
        return messages;
    };

}
