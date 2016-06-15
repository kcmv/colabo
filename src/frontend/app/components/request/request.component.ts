import {Component, Inject, OnInit} from 'angular2/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "angular2/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {Request, RequestState} from "./request";
import {RequestService} from "./request.service";

@Component({
    selector: 'request',
    // since it is comming from ng1 space we need to use explicit injection decorator
    // so we cannot put it here
    providers: [],
    directives: [
        MATERIAL_DIRECTIVES,
        //NgIf, NgFor, FORM_DIRECTIVES,
   ],
   pipes: [DatePipe, OrderArrayPipe],
   moduleId: module.id, // necessary for having relative paths for templateUrl
   templateUrl: 'request.component.html',
   styleUrls: ['request.component.css']
})
export class RequestComponent implements OnInit {
  requests: Request[] = [];
  private changeSelectedNodeEventName = "changeSelectedNodeEvent";

  constructor(
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,

      // since it is comming from ng1 space we need to use explicit injection decorator
      @Inject('RequestService') private _requestService:RequestService
  ) {
      console.log('[RequestComponent]');

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);

      this.globalEmitterServicesArray.register(_requestService.EMITTER_NAME_REQUEST);
    	this.globalEmitterServicesArray.get(_requestService.EMITTER_NAME_REQUEST).subscribe(
        'RequestComponent', this.requestReceived.bind(this));
  }

  ngOnInit() {
    this.requests = this._requestService.getRequestsRef();
  }

  requestReceived(received:any) {
    let request:Request = received.request;
    console.log("[requestReceived] request", JSON.stringify(request));
  }

  grant(request){
    request.state = RequestState.GRANTED;
    this._requestService.grant(request);
  }

  topicClicked(topic){
    this.globalEmitterServicesArray.get(this.changeSelectedNodeEventName).broadcast('RequestComponent', topic._id);
  }

  revoke(request){
    request.state = RequestState.REVOKED;
    //TODO: inform user that it is revoked
    for(let i=0;i<this.requests.length;i++){
      if(this.requests[i] === request){
        this.requests.splice(i, 1);
      }
    }
  }
}
