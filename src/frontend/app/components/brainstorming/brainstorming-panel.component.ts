import {Component} from '@angular/core';
import {MATERIAL_DIRECTIVES} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {BrainstormingService} from "./brainstorming.service";
import {BrainstormingPhase, BrainstormingPhaseNames} from './brainstorming';

//declare var knalledge;
declare var window;

@Component({
    selector: 'brainstorming-panel',
    moduleId: module.id,
    templateUrl: 'partials/brainstorming-panel.component.tpl.html',
    providers: [
        //BrainstormingService
    ],
    directives: [
        MATERIAL_DIRECTIVES
    ]
})
export class BrainstormingPanelComponent {
    constructor(
      private brainstormingService: BrainstormingService
        ) {
          console.log("[BrainstormingPanelComponent] created");
    }

    show() {

    }

    close(confirm: boolean = false) {
        console.log("[BrainstormingPanelComponent].close:");
    }

    getPhaseName(): string{
      return this.brainstormingService.brainstorming ?
      ('Brainstorming / ' + BrainstormingPhaseNames.getNameByPhase(this.brainstormingService.brainstorming.phase)) : '';
    }

    focusToQuestion(){
      this.brainstormingService.focusToQuestion();
    }

    addNewIdea(){
      this.brainstormingService.addNewIdea();
    }

    hideShowMyIdeasSwitch(): boolean {
      if(!this.brainstormingService.brainstorming) {return true;}

      return  !(this.brainstormingService.brainstorming.phase === BrainstormingPhase.IDEAS_GENERATION ||
        this.brainstormingService.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS);
    }

}
