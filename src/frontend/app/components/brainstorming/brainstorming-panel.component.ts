import {Component} from '@angular/core';
import {MATERIAL_DIRECTIVES} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {BrainstormingService} from "./brainstorming.service";

//declare var knalledge;
declare var window;

@Component({
    selector: 'brainstorming-panel',
    moduleId: module.id,
    templateUrl: 'partials/brainstorming-panel.component.tpl.html',
    providers: [
        BrainstormingService
    ],
    directives: [
        MATERIAL_DIRECTIVES
    ]
})
export class BrainstormingPanelComponent {
    constructor(
        ) {
          console.log("[BrainstormingPanelComponent] created");
    }

    show() {
    }

    close(confirm: boolean = false) {
        console.log("[BrainstormingPanelComponent].close:");
    }

}
