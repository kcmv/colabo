import {Component, Inject} from '@angular/core';
import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {BrainstormingPhase} from '../../app/components/brainstorming/brainstorming';

//declare var knalledge;
declare var window;

@Component({
    selector: 'brainstorming-panel',
    moduleId: module.id,
    templateUrl: 'partials/ibis-panel.component.tpl.html',
    providers: [
        //BrainstormingService
    ],
})
export class BrainstormingPanelComponent {
  public showOnlyBrainstorming: boolean = true;
    constructor(
      @Inject('GlobalEmittersArrayService') private globalEmitterServicesArray:GlobalEmittersArrayService,
      private brainstormingService: BrainstormingService
        ) {
          //console.log("[BrainstormingPanelComponent] created");

          // let selectedNodeChangedEventName = "selectedNodeChangedEvent";
          // this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
        	// this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
          //  'SuggestionComponent', this.selectedNodeChanged.bind(this));
    }

    // show() {
    //   this.init();
    // }

    init(): void{
      this.showOnlyBrainstorming = this.brainstormingService.showOnlyBrainstorming;
    }

    showPanel():boolean {
      let showIt = this.brainstormingService.brainstorming && this.brainstormingService.brainstorming.phase !== BrainstormingPhase.INACTIVE;
      if(showIt){
        this.init();
        return true;
      }else{
        return false;
      }
    }

    ngOnInit() {
      this.brainstormingService.init();
    }

    close(confirm: boolean = false) {
        console.log("[BrainstormingPanelComponent].close:");
        this.brainstormingService.restoreOntov();
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
        (this.brainstormingService.brainstorming.phase === BrainstormingPhase.IDEAS_GENERATION ||
          (this.brainstormingService.brainstorming.phase === BrainstormingPhase.SHARING_IDEAS &&
            this.brainstormingService.brainstorming.allowAddingWhileSharingIdeas)
        )
        && this.brainstormingService.brainstorming.allowArgumentsToIdeas
      );
    }

    addArgument(): void{
      this.brainstormingService.addArgument();
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
        this.brainstormingService.filterToBrainstorming(filter);
    }

    changedShowMyIdeas(filter:boolean): void{
        this.filterMyIdeas(filter);
    }

    filterMyIdeas(filter:boolean): void{
      var iAmId = this.brainstormingService.getIamId();
      this.brainstormingService.filterOntov(
        [
          {
            category: 'iAmId',
            value: iAmId
          }
        ],
        filter
        );
    }
}
