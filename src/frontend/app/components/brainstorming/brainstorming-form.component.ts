import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, Inject, ViewChild } from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
//import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs';
import {BrainstormingService} from "./brainstorming.service";
import {Brainstorming, BrainstormingPhaseNames, BrainstormingPhase} from './brainstorming';

//declare var knalledge;

export interface ITabData {
  title: string;
}

@Component({
  selector: 'brainstorming-form',
  moduleId: module.id,
  templateUrl: 'partials/brainstorming-form.component.tpl.html',
  providers: [
      // MATERIAL_PROVIDERS,
//      OVERLAY_PROVIDERS
     BrainstormingService
  ],
  directives: [
      MATERIAL_DIRECTIVES,
      MD_INPUT_DIRECTIVES,
      MD_TABS_DIRECTIVES
  ]
})
export class BrainstormingFormComponent {
  public brainstormingFormActive = true;
  model;// = new knalledge.KMap();
  setUpBroadcastingRequest: string = "setUpBroadcastingRequest";
  public brainstorming: Brainstorming;
  public readyForNewPhase:boolean = true;

  @ViewChild(MdDialog) private mdDialog:MdDialog;

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
    private brainstormingService:BrainstormingService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ){
    this.globalEmitterServicesArray.register(this.setUpBroadcastingRequest);
    this.globalEmitterServicesArray.get(this.setUpBroadcastingRequest).subscribe('BrainstormingFormComponent', this.show.bind(this));
    //window.alert("[BrainstormingFormComponent] " + this.brainstormingService.test);
    this.brainstorming = this.brainstormingService.brainstorming;
  }

  getTitle(tabIndex: number): string {
    return this.tabData[tabIndex].title;
  }

  onSubmit() {
    console.log('[onSubmit]');
    this.mdDialog.close();
    this.readyForNewPhase = true;
  }
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  // get debugging(){
  //   return
  // }

  show(){
    console.log("[BrainstormingFormComponent].show");
    this.mdDialog.show();
    this.brainstormingFormActive = false;
    setTimeout(() => this.brainstormingFormActive = true, 2);
    if(this.readyForNewPhase){
      this.brainstorming.nextPhase();
      this.readyForNewPhase = false;
    }
  }

  showStartPhase(selectedIndex): boolean{
    return selectedIndex !== BrainstormingPhase.FINISHED;
  }

  restart(): void {
    this.brainstorming = new Brainstorming();
    // this.brainstorming.nextPhase();
    // this.readyForNewPhase = false;
    this.readyForNewPhase = true;
    //this.close(false);
    this.show();
  }

  selectedIndex(): number {
    return Math.max(Math.min(this.tabData.length-1,this.brainstorming.phase-1),0);
  }

  isDisabled(selectedIndex:number): boolean {
    return selectedIndex > this.brainstorming.phase;
  }

  // nextPhase(){
  //   this.brainstorming.nextPhase();
  // }

  focusChanged(tabIndex){
    console.log("focusChanged", tabIndex);
    //this._selectedIndex = tabIndex;
    //this.tabData[tabIndex].newItems = 0;
  }

  selectedChanged(event){
    console.log("selectedChanged", event);
    //this._selectedIndex = event;
  }

  close(confirm:boolean = false){
    console.log("[BrainstormingFormComponent].close:",confirm);
    this.mdDialog.close();
  }
}
