import {Component, Inject} from '@angular/core';
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
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,
      private brainstormingService: BrainstormingService
        ) {
          //console.log("[BrainstormingPanelComponent] created");

          // let selectedNodeChangedEventName = "selectedNodeChangedEvent";
          // this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
        	// this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
          //  'SuggestionComponent', this.selectedNodeChanged.bind(this));
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

    // selectedNodeChanged():void{
    //
    // }

    focusToQuestion(){
      this.brainstormingService.focusToQuestion();
    }

    addIdea(){
      this.brainstormingService.addIdea();
    }

    hideAddIdea(): boolean{
      return !(
        this.brainstormingService.brainstorming.phase === BrainstormingPhase.IDEAS_GENERATION ||
        (this.brainstormingService.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS &&
          this.brainstormingService.brainstorming.allowAddingWhileSharingIdeas)
      );
    }

    hideAddArgument(): boolean{
      return !(
        this.brainstormingService.brainstorming.phase === BrainstormingPhase.IDEAS_GENERATION
        && this.brainstormingService.brainstorming.allowArgumentsToIdeas
      );
    }

    addArgument(): void{
      window.alert("not supported yet");
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
        && this.brainstormingService.iAmPresenter
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
