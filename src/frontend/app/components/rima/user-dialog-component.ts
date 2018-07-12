import {NgForm} from '@angular/forms';
import { Component, ViewChild, Inject } from '@angular/core';
import {Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';

declare var knalledge;
declare var marked;

@Component({
  selector: 'user-dialog',
  moduleId: module.id,
  templateUrl: 'partials/user-dialog-component.tpl.html',
  providers: [
      // MATERIAL_PROVIDERS,
  ],
})
export class UserDialogComponent {
  public userFormActive = true;
  forUser:knalledge.WhoAmI = null;
  user = new knalledge.WhoAmI();
  public policyConfig:any;

  private creatingFunction:Function=null;
  private SHOW_USER_DIALOG: string = "SHOW_USER_DIALOG";
  private PRESENTER_CHANGED: string = "PRESENTER_CHANGED";

  @ViewChild(MdDialog) private mdDialog:MdDialog;

  constructor(
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
      @Inject('GlobalEmittersArrayService') private globalEmitterServicesArray: GlobalEmittersArrayService
      ) {
      this.policyConfig = knalledgeMapPolicyService.get().config;

      this.globalEmitterServicesArray.register(this.SHOW_USER_DIALOG);
      this.globalEmitterServicesArray.register(this.PRESENTER_CHANGED);
      this.globalEmitterServicesArray.get(this.SHOW_USER_DIALOG).subscribe('UserDialogComponent', this.show.bind(this));
      //window.alert("[SessionFormComponent] " + this.SessionService.test);
  }

  onSubmit() {
    console.log('[onSubmit]');
    this.forUser.fill(this.user);
    //TODO: add sending to servir and broadcasting to other users
    this.mdDialog.close();
  }

  show(user:knalledge.WhoAmI){
    console.log("[MapFormComponent].show");
    this.mdDialog.show();
    this.userFormActive = false;
    setTimeout(() => this.userFormActive = true, 0.1);
    // if we do: `this.user = user;`, our changes in the form would directly change user prior confirming, i.e. despite canceling.
    this.user = knalledge.WhoAmI.whoAmIFactory(user);

    var markedOptions = {};
    if (marked.nodeEditor && marked.nodeEditor.renderer)
      markedOptions.renderer = marked.nodeEditor.renderer;
    this.user.bioHtml = marked(this.user.bio, markedOptions);

    this.forUser = user;
  }

  sendMessage():void{
    this.mdDialog.close();
  }

  makePresenter(user:knalledge.WhoAmI):void{
    //this.policyConfig.broadcasting.enabled = false;
    this.globalEmitterServicesArray.get(this.PRESENTER_CHANGED)
    .broadcast('UserDialogComponent', {'user': user._id, 'value': true});
      // user._id
  }

  close(confirm){
    console.log("[MapFormComponent].close:",confirm);
    this.mdDialog.close();
  }
}
