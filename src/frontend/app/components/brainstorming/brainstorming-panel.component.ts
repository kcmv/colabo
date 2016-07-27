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

    showPanel():boolean {
      return this.brainstormingService.brainstorming && this.brainstormingService.brainstorming.phase !== BrainstormingPhase.INACTIVE;
    }

    ngOnInit() {
      this.brainstormingService.init();
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

      return  !(
        this.brainstormingService.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS ||
        this.brainstormingService.brainstorming.phase === BrainstormingPhase.GROUP_DISCUSSION);
    }

    // hideShowOnlyBrainstormingSwitch(): boolean {
    //   if(!this.brainstormingService.brainstorming) {return true;}
    //
    //   return  !(
    //     this.brainstormingService.brainstorming.phase === BrainstormingPhase.IDEAS_GENERATION ||
    //     this.brainstormingService.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS);
    // }

    hidePresentNextIdeaBtn(): boolean {
      if(!this.brainstormingService.brainstorming) {return true;}

      return !(
        this.brainstormingService.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS
        //TODO: && this.brainstormingService.brainstorming.presenter === this.brainstormingService.
      );
    }

    presentNextIdea() {
      this.brainstormingService.presentNextIdea();
    }

    changedShowOnlyBrainstorming(filter:boolean): void{
        this.filterToBrainstorming(filter);
    }

    filterToBrainstorming(filter:boolean): void{
      this.brainstormingService.filterOntov( filter ?
        [
        {
          category: 'Tree',
          value: this.brainstormingService.brainstorming.question.kNode.name //'Ideological model'
        }
        ]
        : []);
    }
}
