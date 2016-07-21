import {Component, ViewEncapsulation} from '@angular/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
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

var componentDirectives = [
  MATERIAL_DIRECTIVES
];

declare var Config: any; // src/frontend/app/js/config/config.plugins.js
import {PluginsPreloader} from '../collaboPlugins/pluginsPreloader';

// get the config for ourselves
var puzzleHostingConfig = Config.Plugins.ViewComponents['bottomPanel.BottomPanel'];
var pluggableSubComponentsConfig = puzzleHostingConfig.components;

// go through all pluggable sub components
for(var pluggableSubComponentName in pluggableSubComponentsConfig){
  if (pluggableSubComponentsConfig[pluggableSubComponentName].active) {
      console.warn("[BottomPanel] Loading pluggableSubComponent: ", pluggableSubComponentName);
      // get reference to the pluggable sub component class
      var pluggableSubComponent = PluginsPreloader.components[pluggableSubComponentName];
      if(pluggableSubComponent){
        // add to other directives that puzzle-hosting view component will contain
        componentDirectives.push(pluggableSubComponent);
      }else{
        console.error("[BottomPanel] Error loading pluggableSubComponent: ", pluggableSubComponentName);
      }
  } else {
      console.warn("[BottomPanel] Not loading pluggableSubComponent: ", pluggableSubComponentName);
  }
}

@Component({
    selector: 'bottom-panel',
    encapsulation: ViewEncapsulation.None,
    providers: [
    ],
    // directives are not explicitly provided but dynamically built and provided
    directives: componentDirectives,
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
            this.showPluggableSubComponent.bind(this));
    };

    showPluggableSubComponent(path){
        this.shown = true;
        this.visiblePluggableSubComponent = path;
    }

    hideBottomPanel(){
        this.shown = false;
    }
}
