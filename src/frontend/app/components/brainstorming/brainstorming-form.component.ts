import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, Inject, ViewChild, OnInit} from '@angular/core';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {BrainstormingService} from "./brainstorming.service";
import {Brainstorming, BrainstormingPhaseNames, BrainstormingPhase} from './brainstorming';

//declare var knalledge;
declare var window;

export interface ITabData {
    title: string;
}

@Component({
    selector: 'brainstorming-form',
    moduleId: module.id,
    templateUrl: 'partials/brainstorming-form.component.tpl.html',
    providers: [
    // MATERIAL_PROVIDERS,
    //    BrainstormingService
    ],
    directives: [
        MATERIAL_DIRECTIVES
    ]
})
export class BrainstormingFormComponent implements OnInit{
    public brainstormingFormActive = true;
    //model = new knalledge.KMap();
    setUpBroadcastingRequest: string = "setUpBroadcastingRequest";
    public model: Brainstorming = new Brainstorming();
    public brainstorming: Brainstorming;
    public readyForNewPhase: boolean = true;

    @ViewChild(MdDialog) private mdDialog: MdDialog;

    private tabData: ITabData[] = [
        {
            title: BrainstormingPhaseNames.IDEAS_GENERATION,
        },
        {
            title: BrainstormingPhaseNames.SHARING_IDEAS,
        },
        {
            title: BrainstormingPhaseNames.GROUP_DISCUSSION
        },
        {
            title: BrainstormingPhaseNames.VOTING_AND_RANKING
        },
        {
            title: BrainstormingPhaseNames.FINISHED
        }
    ];

    constructor(
        private brainstormingService: BrainstormingService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
        ) {
        this.globalEmitterServicesArray.register(this.setUpBroadcastingRequest);
        this.globalEmitterServicesArray.get(this.setUpBroadcastingRequest).subscribe('BrainstormingFormComponent', this.show.bind(this));
        //window.alert("[BrainstormingFormComponent] " + this.brainstormingService.test);
        this.brainstorming = this.brainstormingService.brainstorming;
    }

    ngOnInit() {
      this.brainstormingService.init();
    }

    getTitle(tabIndex: number): string {
        return this.tabData[tabIndex].title;
    }

    onSubmit(selectedIndex: number) {
        console.log('[onSubmit]');
        this.changePhase(selectedIndex + 1);
        this.mdDialog.close();
        this.readyForNewPhase = true;
        this.brainstormingService.previousPhase = this.brainstormingService.brainstorming.phase;
        this.brainstormingService.brainstorming.fill(this.model);
        this.brainstormingService.setUpBrainstormingChange();
        this.brainstormingService.sendBrainstorming(this.brainstormingSent.bind(this));
    }

    public changePhase(phase) {
        this.model.phase = phase;
    }


    get diagnostic() { return JSON.stringify(this.model); }

    // get debugging(){
    //   return
    // }

    show() {
      console.log("[BrainstormingFormComponent].show");
      this.model = Brainstorming.factory(this.brainstormingService.brainstorming);
      if(!this.brainstormingService.checkAndSetupQuestion(this.model)){
          window.alert("Either node is not selected or it is not of type IBIS question.");
          return;
      }
      this.mdDialog.show();
      this.brainstormingFormActive = false;
      setTimeout(() => this.brainstormingFormActive = true, 2);
      if (this.readyForNewPhase) {
          this.model.nextPhase();
          this.readyForNewPhase = false;
      }
    }

    showStartFinish(selectedIndex): boolean {
        return (selectedIndex+1) !== BrainstormingPhase.FINISHED;
    }

    restart(): void {
        if (confirm('Are you sure?')) {
            this.brainstormingService.restart();
            // this.model.nextPhase();
            // this.readyForNewPhase = false;
            this.readyForNewPhase = true;
            //this.close(false);
            this.show();
        }
    }

    selectedIndex(): number {
        return Math.max(Math.min(this.tabData.length - 1, this.model.phase - 1), 0);
    }

    isDisabled(selectedIndex: number): boolean {
        return selectedIndex > this.model.phase;
    }

    // nextPhase(){
    //   this.model.nextPhase();
    // }

    focusChanged(tabIndex) {
        console.log("focusChanged", tabIndex);
        //this._selectedIndex = tabIndex;
        //this.tabData[tabIndex].newItems = 0;
    }

    selectedChanged(event) {
        console.log("selectedChanged", event);
        //this._selectedIndex = event;
    }

    finishBrainstorming(){
      this.mdDialog.close();
      this.brainstormingService.finishBrainstorming();
    }

    testOntovFilter(){
      this.brainstormingService.filterOntov([
        // If you put more than one it will be OR (union)
        // AND is not supported (if we need it we need to talk :) )
        // {
        //   category: 'Type',
        //   value: 'type_ibis_question'
        // }

        // for some reason this doesn't filter
        {
          category: 'iAmId',
          value: '556760847125996dc1a4a241'
        }

        // {
        //   category: 'Tree',
        //   value: 'Ideological model' // node name
        // }
      ]);
    }

    close(confirm: boolean = false) {
        console.log("[BrainstormingFormComponent].close:", confirm);
        this.mdDialog.close();
        if(!confirm){
          this.model.previousPhase();
          this.readyForNewPhase = true;
        }
    }

    private brainstormingSent(result: boolean, error?: any): void {
        console.log("[brainstormingSent]", result, error);
    }
}
