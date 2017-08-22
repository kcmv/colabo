import {Component, ViewEncapsulation, Inject} from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

/**
 * Directive that
 * 1. provides placeholder for other components to present their visual logic at the bottom of the screen
 *
 * Selector: `bottom-panel`
 * @class bottomPanel
 * @memberof CF
 * @constructor
*/

export var bottomPanelComponentDirectives = [
];

declare var Config: any; // src/frontend/app/js/config/config.plugins.js
import {PluginsPreloader} from '../collaboPlugins/pluginsPreloader';

PluginsPreloader.addDirectivesDependenciesForComponent('bottomPanel.BottomPanel', bottomPanelComponentDirectives);

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {Ng2MaterialModule} from 'ng2-material';

var moduleImports = [];
moduleImports.push(BrowserModule);
moduleImports.push(FormsModule);
moduleImports.push(HttpModule);
moduleImports.push(MaterialModule);
moduleImports.push(Ng2MaterialModule);

// @NgModule for tools
@NgModule({
  imports: moduleImports,
  exports: bottomPanelComponentDirectives,
  declarations: bottomPanelComponentDirectives
})
export class BottomPanelModule {}

@Component({
    selector: 'bottom-panel',
    encapsulation: ViewEncapsulation.None,
    providers: [
    ],
    // directives are not explicitly provided but dynamically built and provided
    moduleId: module.id, // necessary for having relative paths for templateUrl
    templateUrl: 'partials/bottom_panel.tpl.html'
})
export class BottomPanel {
    visiblePluggableSubComponent:string;
    shown:boolean;

    constructor(
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
    ) {

        var showSubComponentInBottomPanelEvent = "showSubComponentInBottomPanelEvent";
        this.globalEmitterServicesArray.register(showSubComponentInBottomPanelEvent);

        this.globalEmitterServicesArray.get(showSubComponentInBottomPanelEvent)
            .subscribe('knalledgeMap.BottomPanel',
            this.showPluggableSubComponent.bind(this));

        var hideBottomPanelEvent = "hideBottomPanelEvent";
        this.globalEmitterServicesArray.register(hideBottomPanelEvent);

        this.globalEmitterServicesArray.get(hideBottomPanelEvent)
            .subscribe('knalledgeMap.BottomPanel',
            this.hideBottomPanel.bind(this));
    }

    showPluggableSubComponent(path){
        this.shown = true;
        this.visiblePluggableSubComponent = path;
    }

    hideBottomPanel(){
        this.shown = false;
    }
}
