import {Component, Inject} from 'angular2/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "angular2/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {Request, RequestType, RequestState} from "./request";
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
export class RequestComponent{
  requests: Request[] = [];

  constructor(
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,

      // since it is comming from ng1 space we need to use explicit injection decorator
      @Inject('RequestService') private _requestService:RequestService
      // private _requestService: RequestService
  ) {
      console.log('[RequestComponent]');

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);

      this.globalEmitterServicesArray.register(_requestService.EMITTER_NAME_REQUEST);
    	this.globalEmitterServicesArray.get(_requestService.EMITTER_NAME_REQUEST).subscribe('RequestComponent', this.requestReceived);

      this.getMockupRequests();
  }

  getMockupRequests(){
    var r1:Request = new Request();
      r1.who = null;
      r1.reference = null;
      r1.type = RequestType.REPLICA;
    var r2:Request = new Request();
      r2.who = {displayName:'Dino'};
      r2.reference = {name:'Collective Mind'};
      r2.type = RequestType.REPLICA;
    var r3:Request = new Request();
      r3.who = {displayName:'TestUser'};
      r3.reference = {name:'Eco-Problems'};
      r3.type = RequestType.CLARIFICATION;
    this.requests = [r1,r2,r3];
  }

  requestReceived(received:any) {
    let request:Request = received.request;
    console.log("[requestReceived] request", JSON.stringify(request));
    this.requests.push(request);
  }

  grant(request){
    request.state = RequestState.GRANTED;
    //TODO: inform user that it is granted
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
