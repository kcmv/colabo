import {Component, Inject, OnInit} from 'angular2/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "angular2/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {Change, ChangeState} from "./change";
import {ChangeService} from "./change.service";
//import {KNode} from "KNode";

@Component({
    selector: 'change',
    // since it is comming from ng1 space we need to use explicit injection decorator
    // so we cannot put it here
    providers: [],
    directives: [
        MATERIAL_DIRECTIVES,
        //NgIf, NgFor, FORM_DIRECTIVES,
   ],
   pipes: [DatePipe, OrderArrayPipe],
   moduleId: module.id, // necessary for having relative paths for templateUrl
   templateUrl: 'change.component.html',
   styleUrls: ['change.component.css']
})
export class ChangeComponent implements OnInit {
  changesByExpertise: Change[] = [];
  selectedNode:any; //KNode;

  constructor(
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
      // @Inject('RimaService') private rimaService:RimaService

      // since it is comming from ng1 space we need to use explicit injection decorator
   , @Inject('ChangeService') private _changeService:ChangeService
  ) {
      console.log('[ChangeComponent]');

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
      let selectedNodeChangedEventName = "selectedNodeChangedEvent";
      this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
    	this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
       'ChangeComponent', this.selectedNodeChanged.bind(this));
  }

  ngOnInit() {
    this.selectedNode = this._changeService.getSelectedNode();
    if(this.selectedNode){
      this.changesByExpertise = this._changeService.setSuggestedExpertsForNode(this.selectedNode.kNode);
    }
  //TODO:  check for Selected Node
  //this.changesByExpertise = this._changeService.setSuggestedExpertsForNode(this.selectedNode);
  }

  selectedNodeChanged(vkNode:any){
    console.log('selectedNodeChanged');
    this.selectedNode = vkNode;
    if(this.selectedNode){
      this.changesByExpertise = this._changeService.setSuggestedExpertsForNode(this.selectedNode.kNode);
    }
  }

  // changeReceived(received:any) {
  //   let change:Change = received.change;
  //   console.log("[changeReceived] change", JSON.stringify(change));
  // }


  accept(change){
    change.state = ChangeState.ACCEPTED;
    //TODO: inform user that he is summoned
  }

  // topicClicked(topic){
  //   this.globalEmitterServicesArray.get(this.changeSelectedNodeEventName).broadcast('ChangeComponent', topic._id);
  // }

  // revoke(change){
  //   change.state = ChangeState.REVOKED;
  //   //TODO: inform user that it is revoked
  //   for(let i=0;i<this.changes.length;i++){
  //     if(this.changes[i] === change){
  //       this.changes.splice(i, 1);
  //     }
  //   }
  // }
}
