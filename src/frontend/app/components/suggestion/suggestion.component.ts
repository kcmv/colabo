import {Component, Inject, OnInit} from '@angular/core';
// import {FORM_DIRECTIVES} from '@angular/forms';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {Suggestion, SuggestionState} from "./suggestion";
import {SuggestionService} from "./suggestion.service";
//import {KNode} from "KNode";

declare var knalledge;

@Component({
    selector: 'suggestion-component',
    // since it is comming from ng1 space we need to use explicit injection decorator
    // so we cannot put it here
    providers: [],
   moduleId: module.id, // necessary for having relative paths for templateUrl
   templateUrl: 'suggestion.component.html'
})
export class SuggestionComponent implements OnInit {
  suggestionsByExpertise: Suggestion[] = [];

  constructor(
      @Inject('GlobalEmittersArrayService') private globalEmitterServicesArray:GlobalEmittersArrayService
      // @Inject('RimaService') private rimaService:RimaService

      // since it is comming from ng1 space we need to use explicit injection decorator
   , @Inject('SuggestionService') private _suggestionService:SuggestionService
  ) {
      console.log('[SuggestionComponent]');

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);
      let selectedNodeChangedEventName = "selectedNodeChangedEvent";
      this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
    	this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
       'SuggestionComponent', this.selectedNodeChanged.bind(this));
  }

  ngOnInit() {
    this._suggestionService.selectedNode = this._suggestionService.getSelectedNode();
    if(this._suggestionService.selectedNode){
      this.suggestionsByExpertise = this._suggestionService.setSuggestedExpertsForNode(this._suggestionService.selectedNode.kNode);
    }
  //TODO:  check for Selected Node
  //this.suggestionsByExpertise = this._suggestionService.setSuggestedExpertsForNode(this.selectedNode);
  }

  selectedNodeChanged(vkNode:any){
    console.log('selectedNodeChanged');
    this._suggestionService.selectedNode = vkNode;
    if(this._suggestionService.selectedNode){
      this.suggestionsByExpertise = this._suggestionService.setSuggestedExpertsForNode(this._suggestionService.selectedNode.kNode);
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
