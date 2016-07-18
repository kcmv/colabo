import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, Inject, ViewChild } from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
//import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

import {BrainstormingService} from "./brainstorming.service";

//declare var knalledge;

declare var window;

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
      MD_INPUT_DIRECTIVES
  ]
})
export class BrainstormingFormComponent {
  public brainstormingFormActive = true;
  model;// = new knalledge.KMap();
  setUpBroadcastingRequest: string = "setUpBroadcastingRequest";

  private creatingFunction:Function=null;

  @ViewChild(MdDialog) private mdDialog:MdDialog;

  constructor(
    private brainstormingService:BrainstormingService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ){
    this.globalEmitterServicesArray.register(this.setUpBroadcastingRequest);
    this.globalEmitterServicesArray.get(this.setUpBroadcastingRequest).subscribe('BrainstormingFormComponent', this.show);
    window.alert("[BrainstormingFormComponent] " + this.brainstormingService.test);
  }

  onSubmit() {
    console.log('[onSubmit]');
    this.mdDialog.close();
    if(this.creatingFunction){
      this.creatingFunction(true);
    }
  }
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  // get debugging(){
  //   return
  // }

  show(brainstorming?:any, creatingFunction?:Function){
    console.log("[BrainstormingFormComponent].show");
    this.creatingFunction = creatingFunction;
    this.mdDialog.show();
    this.brainstormingFormActive = false;
    setTimeout(() => this.brainstormingFormActive = true, 0);
    this.model = brainstorming;
  }

  close(confirm){
    console.log("[BrainstormingFormComponent].close:",confirm);
    this.mdDialog.close();
    if(this.creatingFunction){
      this.creatingFunction(false);
    }
  }
}
