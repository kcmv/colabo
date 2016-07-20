import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

/**
 * Directive that handles shows node's media
 *
 * Selector: `media-show`
 * @class MediaShowComponent
 * @memberof knalledge.mediaShow
 * @constructor
*/

declare var window;

@Component({
    selector: 'media-show',
    moduleId: module.id,
    templateUrl: 'partials/media-show-component.tpl.html',
    providers: [
    ],
    directives: [
        MATERIAL_DIRECTIVES
    ],
    styles: [`
    `]
})

export class MediaShowComponent implements AfterViewInit {
    nodeName: string = "";
    mediaTitle: string = "Media Show";
    showCallback: Function;
    vkNode;
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
    @ViewChild(MdDialog) private mediaShowDialog: MdDialog;

    constructor(
        // public router: Router,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
        ) {
        console.log('[MediaShowComponent]');

        var nodeMediaClickedEventName = "nodeMediaClickedEvent";
        this.globalEmitterServicesArray.register(nodeMediaClickedEventName);

        this.globalEmitterServicesArray.get(nodeMediaClickedEventName).subscribe('knalledgeMap.Main', function(vkNode) {
            this.show(vkNode);
        }.bind(this));
    };

    ngAfterViewInit() {
    }

    show(vkNode) {
        this.vkNode = vkNode;
        console.log("[media-show] media showing for node: ", vkNode.kNode.name);
        this.mediaTitle = vkNode.kNode.name;
        this.mediaShowDialog.show();
    }

    onMediaShowCloseClicked() {

    }
}
