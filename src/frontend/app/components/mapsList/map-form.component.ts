import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";

declare var knalledge:any;

@Component({
  selector: 'map-form',
  moduleId: module.id,
  templateUrl: 'partials/map-form.component.tpl.html',
  providers: [
      // MATERIAL_PROVIDERS,
  ],
  directives: [
      MATERIAL_DIRECTIVES,
  ]
})
export class MapFormComponent {
  public mapFormActive = true;
  model = new knalledge.KMap();

  private creatingFunction:Function=null;

  @ViewChild(MdDialog) private mdDialog:MdDialog;

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

  show(map:knalledge.KMap, creatingFunction:Function){
    console.log("[MapFormComponent].show");
    this.creatingFunction = creatingFunction;
    this.mdDialog.show();
    this.mapFormActive = false;
    setTimeout(() => this.mapFormActive = true, 0.1);
    this.model = map;
  }

  close(confirm){
    console.log("[MapFormComponent].close:",confirm);
    this.mdDialog.close();
    if(this.creatingFunction){
      this.creatingFunction(false);
    }
  }
}
