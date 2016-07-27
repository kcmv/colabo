import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, ViewChild, Inject } from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
//import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';

declare var knalledge;

@Component({
  selector: 'user-dialog',
  moduleId: module.id,
  templateUrl: 'partials/user-dialog-component.tpl.html',
  providers: [
      // MATERIAL_PROVIDERS,
//      OVERLAY_PROVIDERS
  ],
  directives: [
      MATERIAL_DIRECTIVES,
      MD_INPUT_DIRECTIVES
  ]
})
export class UserDialogComponent {
  //public mapFormActive = true;
  user = new knalledge.WhoAmI();
  public policyConfig:any;

  private creatingFunction:Function=null;
  private SHOW_USER_DIALOG: string = "SHOW_USER_DIALOG";

  @ViewChild(MdDialog) private mdDialog:MdDialog;

  constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
      ) {
      this.policyConfig = knalledgeMapPolicyService.get().config;

      this.globalEmitterServicesArray.register(this.SHOW_USER_DIALOG);
      this.globalEmitterServicesArray.get(this.SHOW_USER_DIALOG).subscribe('UserDialogComponent', this.show.bind(this));
      //window.alert("[SessionFormComponent] " + this.SessionService.test);
  }

  // onSubmit() {
  //   console.log('[onSubmit]');
  //   this.mdDialog.close();
  // }

  show(user:knalledge.WhoAmI){
    console.log("[MapFormComponent].show");
    this.mdDialog.show();
    // this.mapFormActive = false;
    // setTimeout(() => this.mapFormActive = true, 0.1);
    this.user = user;
  }

  makePresenter(user:knalledge.WhoAmI):void{
      
  }

  close(confirm){
    console.log("[MapFormComponent].close:",confirm);
    this.mdDialog.close();
  }
}
