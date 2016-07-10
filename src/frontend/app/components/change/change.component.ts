import {Component, Inject, OnInit} from '@angular/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from '@angular/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "@angular/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {Change, State} from "./change";
import {ChangeService} from "./change.service";
//import {KNode} from "KNode";

@Component({
    selector: 'change-component',
    // since it is comming from ng1 space we need to use explicit injection decorator
    // so we cannot put it here
    providers: [
        // ChangeService
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        //NgIf, NgFor, FORM_DIRECTIVES,
   ],
   pipes: [DatePipe, OrderArrayPipe],
   moduleId: module.id, // necessary for having relative paths for templateUrl
   templateUrl: 'change.component.html'
  //  styleUrls: ['change.component.css']
})
export class ChangeComponent implements OnInit {
  changes: Change[] = [];

  constructor(
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
      // @Inject('RimaService') private rimaService:RimaService

      // since it is comming from ng1 space we need to use explicit injection decorator
   , private changeService:ChangeService
  ) {
      console.log('[ChangeComponent]');

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
      // let selectedNodeChangedEventName = "selectedNodeChangedEvent";
      // this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
    	// this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
      //  'ChangeComponent', this.selectedNodeChanged.bind(this));
  }

  ngOnInit() {
    this.changes = this.changeService.getChangesRef();
  }

  // changeReceived(received:any) {
  //   let change:Change = received.change;
  //   console.log("[changeReceived] change", JSON.stringify(change));
  // }

  // topicClicked(topic){
  //   this.globalEmitterServicesArray.get(this.changeSelectedNodeEventName).broadcast('ChangeComponent', topic._id);
  // }

  // revoke(change){
  //   change.state = State.REVOKED;
  //   //TODO: inform user that it is revoked
  //   for(let i=0;i<this.changes.length;i++){
  //     if(this.changes[i] === change){
  //       this.changes.splice(i, 1);
  //     }
  //   }
  // }
}
