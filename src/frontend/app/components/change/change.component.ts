import {Component, Inject, OnInit, EventEmitter, Output, Input} from '@angular/core';
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
  public changes: Change[] = [];
  @Input() initializeWithPreviousChanges: boolean = false;
  // @Input() followChanges: boolean = false;
  //@Output() newChange = new EventEmitter<any>(); used in template as `<change-component (newChange)="updateChangesNo($event)"  ...`

  private changeSelectedNodeEventName: string = "changeSelectedNodeEvent";
  constructor(
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
      // @Inject('RimaService') private rimaService:RimaService

      // since it is comming from ng1 space we need to use explicit injection decorator
   , private changeService:ChangeService
  ) {
      console.log('[ChangeComponent]');
  		this.globalEmitterServicesArray.register(this.changeSelectedNodeEventName);

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
      // let selectedNodeChangedEventName = "selectedNodeChangedEvent";
      // this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
    	// this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
      //  'ChangeComponent', this.selectedNodeChanged.bind(this));

      // this.changeService.getOne('577d5cb55be86321489aacaa')
      //     .subscribe(
      //     audit => alert("audit: " +
      //         JSON.stringify(audit)),
      //     error => alert("error: " +
      //         JSON.stringify(error))
      //     );

  }

  changesReceived(changes){
    //this.changes = changes;
    //this.updateNewChangesNo(this.changes.length);
  }

  ngOnInit() {
    this.changeService.init();
    if(this.initializeWithPreviousChanges && !this.changeService.gotChangesFromServer){
      this.changeService.getChangesFromServer();//this.changesReceived.bind(this));
    }
    this.changes = this.changeService.getChangesRef();
    //this.updateNewChangesNo(this.changes.length);
    //this.changeService.onChangeHandler = this.changesReceived.bind(this);
  }

  public valueObjectClicked(vo){
    this.globalEmitterServicesArray.get(this.changeSelectedNodeEventName).broadcast('ChangeComponent', vo);
  }

  // private updateNewChangesNo(no:number):void{
  //   this.newChange.emit(no);
  // }
}
