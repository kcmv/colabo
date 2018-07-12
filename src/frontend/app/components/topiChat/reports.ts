import {Component, Inject} from '@angular/core';
import {NgIf, NgFor} from '@angular/common';
import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {TopiChatService} from '../topiChat/topiChatService';
import {TopiChatConfigService} from './topiChatConfigService';
import { DatePipe } from "@angular/common";
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
    selector: 'topichat-reports',
    providers: [],
    pipes: [DatePipe, OrderArrayPipe],
   moduleId: module.id, // necessary for having relative paths for templateUrl
   templateUrl: 'partials/reports.tpl.html',
    // t_emplateUrl: 'components/topiChat/partials/reports.tpl.html',
    styles: [`
        .md-list-item-text {
            border-bottom: 1px solid gray;
            padding-bottom: 3px;
            margin-bottom: 2px;
        }
    `]
})
export class TopiChatReports {
    config:any = {
        sniff: true
    };
    plugins:any;
    private globalEmitterServicesArray:GlobalEmittersArrayService;
    private topiChatService:TopiChatService;
    private topiChatConfigService:TopiChatConfigService;

    constructor(
        @Inject('GlobalEmittersArrayService') globalEmitterServicesArray:GlobalEmittersArrayService,
        @Inject('TopiChatService') topiChatService:TopiChatService,
        @Inject('TopiChatConfigService') topiChatConfigService:TopiChatConfigService
        // globalEmitterServicesArray:GlobalEmittersArrayService
    ) {
        console.log('[TopiChatReports]');

        // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
        // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);

        this.globalEmitterServicesArray = globalEmitterServicesArray;
        this.topiChatService = topiChatService;
        this.topiChatConfigService = topiChatConfigService;
        this.plugins = this.getPlugins();
    }

    configChanged(path, value) {
        return;
    }

    addPlugin():any {
        var pluginOptions: any = {
            name: 'test',
            events: {
                event1: function event1f(){return "event1";},
                event2: function event1f(){return "event2";}
            }
        };

        this.topiChatService.registerPlugin(pluginOptions);
    }

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
    }

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
    }

    getMessagesForEvent(eventName):Object[] {
        var messages = this.topiChatService.getMessagesForEvent(eventName);
        return messages;
    }

}
