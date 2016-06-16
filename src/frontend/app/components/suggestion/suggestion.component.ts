import {Component, Inject, OnInit} from 'angular2/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "angular2/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {Suggestion, SuggestionState} from "./suggestion";
import {SuggestionService} from "./suggestion.service";
//import {KNode} from "KNode";

@Component({
    selector: 'suggestion',
    // since it is comming from ng1 space we need to use explicit injection decorator
    // so we cannot put it here
    providers: [],
    directives: [
        MATERIAL_DIRECTIVES,
        //NgIf, NgFor, FORM_DIRECTIVES,
   ],
   pipes: [DatePipe, OrderArrayPipe],
   moduleId: module.id, // necessary for having relative paths for templateUrl
   templateUrl: 'suggestion.component.html',
   styleUrls: ['suggestion.component.css']
})
export class SuggestionComponent implements OnInit {
  suggestionsByExpertise: Suggestion[] = [];
  selectedNode:any; //KNode;

  constructor(
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
      // @Inject('RimaService') private rimaService:RimaService

      // since it is comming from ng1 space we need to use explicit injection decorator
   , @Inject('SuggestionService') private _suggestionService:SuggestionService
  ) {
      console.log('[SuggestionComponent]');

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
      let selectedNodeChangedEventName = "selectedNodeChangedEvent";
      let rimaWhatsChangedEvent = "rimaWhatsChangedEvent";
      this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
    	this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
       'SuggestionComponent', this.selectedNodeChanged.bind(this));
      this.globalEmitterServicesArray.register(rimaWhatsChangedEvent);
     	this.globalEmitterServicesArray.get(rimaWhatsChangedEvent).subscribe(
        'SuggestionComponent', this.rimaWhatsChanged.bind(this));
  }

  ngOnInit() {
    this.selectedNode = this._suggestionService.getSelectedNode();
    if(this.selectedNode){
      this.suggestionsByExpertise = this._suggestionService.setSuggestedExpertsForNode(this.selectedNode.kNode);
    }
  //TODO:  check for Selected Node
  //this.suggestionsByExpertise = this._suggestionService.setSuggestedExpertsForNode(this.selectedNode);
  }

  selectedNodeChanged(vkNode:any){
    console.log('selectedNodeChanged');
    this.selectedNode = vkNode;
    if(this.selectedNode){
      this.suggestionsByExpertise = this._suggestionService.setSuggestedExpertsForNode(this.selectedNode.kNode);
    }
  }

  rimaWhatsChanged(msg:any){
    console.log('rimaWhatsChanged');
    if(this.selectedNode){
      this.suggestionsByExpertise = this._suggestionService.setSuggestedExpertsForNode(this.selectedNode.kNode);
    }
  }

  // suggestionReceived(received:any) {
  //   let suggestion:Suggestion = received.suggestion;
  //   console.log("[suggestionReceived] suggestion", JSON.stringify(suggestion));
  // }


  accept(suggestion){
    suggestion.state = SuggestionState.ACCEPTED;
    //TODO: inform user that he is summoned
  }

  // topicClicked(topic){
  //   this.globalEmitterServicesArray.get(this.changeSelectedNodeEventName).broadcast('SuggestionComponent', topic._id);
  // }

  // revoke(suggestion){
  //   suggestion.state = SuggestionState.REVOKED;
  //   //TODO: inform user that it is revoked
  //   for(let i=0;i<this.suggestions.length;i++){
  //     if(this.suggestions[i] === suggestion){
  //       this.suggestions.splice(i, 1);
  //     }
  //   }
  // }
}
