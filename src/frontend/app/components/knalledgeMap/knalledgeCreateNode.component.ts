import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import { AfterViewInit, ViewChild } from
'@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdDialog} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

/**
 * Directive that handles the main KnAllEdge or rather CollaboFramework user interface
 *
 * Selector: `mcm-list-component`
 * @class KnalledgeCreateNodeComponent
 * @memberof mcm
 * @constructor
*/

declare var window;

@Component({
    selector: 'knalledge-create-node',
    moduleId: module.id,
    templateUrl: 'partials/knalledge-create-node-component.tpl.html',
    providers: [
        MATERIAL_PROVIDERS,
        OVERLAY_PROVIDERS
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        MD_SIDENAV_DIRECTIVES,
        ROUTER_DIRECTIVES,
        MdToolbar,
        MD_INPUT_DIRECTIVES, FORM_DIRECTIVES
    ],
    styles: [`
    `]
})

export class KnalledgeCreateNodeComponent implements AfterViewInit{
    nodeName: string = "";
    createNodeTitle: string = "Create Node";
    showKnalledgeNodeType: string;
    showKnalledgeEdgeType: string;
    showCallback: Function;
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
    @Output() selectItem = new EventEmitter<any>();
    @Output() enterItem = new EventEmitter<any>();
    @ViewChild(MdDialog) private mdDialog:MdDialog;

    constructor(
        // public router: Router,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('McmMapAssumptionService') private mcmMapAssumptionService,
        @Inject('McmMapObjectService') private mcmMapObjectService
    ) {
        console.log('[KnalledgeCreateNodeComponent]');
    };

    ngAfterViewInit() {
    }

    show(knalledgeNodeType, knalledgeEdgeType, title: string = null, callback:Function = null){
        this.showKnalledgeNodeType = knalledgeNodeType;
        this.showKnalledgeEdgeType = knalledgeEdgeType;
        this.showCallback = callback;

        this.nodeName = "";

        if(title !==null){
          this.createNodeTitle = title;
        }else{
          switch(knalledgeNodeType){
              case "type_ibis_comment":
                  this.createNodeTitle = "Create Comment";
                  break;
              case "type_ibis_question":
                  this.createNodeTitle = "Create Question";
                  break;
              default:
                  this.createNodeTitle = "Create Node";
                  break;
          }
        }

        this.mdDialog.show();
    }

    onCreateNodeClicked(){
        // this.selectItem.emit(item);
        if(typeof this.showCallback === 'function'){

            this.mdDialog.close();
            this.showCallback(this.showKnalledgeNodeType, this.showKnalledgeEdgeType, this.nodeName);
        }
    }

    onCreateNodeDialogClosed(){

    }

    onNodeNameChanged(){

    }
}
