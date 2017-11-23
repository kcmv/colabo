import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {Media} from "ng2-material";
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

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
    styles: [`
    `]
})

export class MediaShowComponent implements AfterViewInit {
    nodeName: string = "";
    mediaTitle: string = "Media Show";
    showCallback: Function;
    vkNode;
    mediaContent : string = null;
    mediaType : string = null;
    mediaImageUrl : string = null;
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
    @ViewChild(MdDialog) private mediaShowDialog: MdDialog;

    constructor(
        // public router: Router,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
        ) {
        console.log('[MediaShowComponent]');

        var nodeMediaClickedEventName = "nodeMediaClickedEvent";
        var mediaShowContentEventName = "mediaShowContentEventName";
        this.globalEmitterServicesArray.register(nodeMediaClickedEventName);
        this.globalEmitterServicesArray.register(mediaShowContentEventName);

        this.globalEmitterServicesArray.get(nodeMediaClickedEventName).subscribe('MediaShowComponent', function(vkNode) {
            this.show(vkNode);
        }.bind(this));
        this.globalEmitterServicesArray.get(mediaShowContentEventName).subscribe('MediaShowComponent', function(contentObj) {
            this.showContent(contentObj);
        }.bind(this));
    }

    ngAfterViewInit() {
    }

    clear() {
      this.mediaType = null;
      this.mediaTitle = null;
      this.mediaContent = null;
      this.mediaImageUrl = null;
      this.vkNode = null;
    }

    show(vkNode) {
      this.clear();
      this.vkNode = vkNode;
      if(!this.vkNode) return;

      console.log("[media-show] media showing for node: ", vkNode.kNode.name);
      this.mediaTitle = vkNode.kNode.name;
      this.mediaImageUrl = vkNode.kNode.dataContent.image.url;
      this.mediaShowDialog.show();
    }

    showContent(contentObj) {
      this.clear();
      console.log("[media-show] showing media content for the type: ", contentObj.type);
      this.mediaTitle = "Presentation";
      this.mediaType = contentObj.type;
      switch(contentObj.type){
        case 'text/html':
          this.mediaContent = contentObj.content;
          break;
        case 'text/markdown':
          this.mediaContent = contentObj.content;
          break;
      }
      this.mediaShowDialog.show();
    }

    onMediaShowCloseClicked() {
    }
}
