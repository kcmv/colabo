import {Component, Inject, OnInit} from 'angular2/core';
//import {NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';
// import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import { DatePipe } from "angular2/common";
import { OrderArrayPipe } from "../utils/orderArrayPipe";
import {Suggestion, SuggestionState} from "./suggestion";
import {SuggestionService} from "./suggestion.service";

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
  suggestions: Suggestion[] = [];
  private changeSelectedNodeEventName = "changeSelectedNodeEvent";


  constructor(
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
      // @Inject('RimaService') private rimaService:RimaService

      // since it is comming from ng1 space we need to use explicit injection decorator
   , @Inject('SuggestionService') private _suggestionService:SuggestionService
  ) {
      console.log('[SuggestionComponent]');

      // alert("this.policyConfig.moderating.enabled: "+this.policyConfig.moderating.enabled);
      // alert("policyConfig.broadcasting.enabled: "+this.policyConfig.broadcasting.enabled);

      //this.globalEmitterServicesArray.register(_suggestionService.EMITTER_NAME_REQUEST);
    	//this.globalEmitterServicesArray.get(_suggestionService.EMITTER_NAME_REQUEST).subscribe(
      //  'SuggestionComponent', this.suggestionReceived.bind(this));
  }

  ngOnInit() {
  //  this.suggestions = this._suggestionService.getSuggestionsRef();
  }

  suggestionReceived(received:any) {
    let suggestion:Suggestion = received.suggestion;
    console.log("[suggestionReceived] suggestion", JSON.stringify(suggestion));
  }


  // suggestedExpertsForSelectedNode(){
  //   //$scope.items.length = 0;
  //
  //   //for each user:
  //   //for each how of the user:
  //   var userHows = RimaService.howAmIs[RimaService.getActiveUserId()];
  //   // TODO: Sasa want logged in user also [RimaService.loggedInWhoAmI._id];
  //   //we only do it for the current node: for (var i in KnalledgeMapVOsService.mapStructure.nodesById){
  //     var vkNode = KnalledgeMapVOsService.mapStructure.nodesById[i];
  //     //getting all whats from the node:
  //     var nodeWhats = (vkNode && vkNode.kNode.dataContent && vkNode.kNode.dataContent.rima && vkNode.kNode.dataContent.rima.whats) ?
  //       vkNode.kNode.dataContent.rima.whats : [];
  //
  //     var relevantWhats = []; //here are kept all found relevant whats
  //     // TODO: can be optimized by hash of userHows
  //     for(var i=0;i<nodeWhats.length;i++){ //through all the whats of the node
  //       var nodeWhat = nodeWhats[i];
  //       for(var j in userHows){
  //         var userHow = userHows[j];
  //         if (userHow && userHow.whatAmI && (userHow.whatAmI.name == nodeWhat.name))
  //         {
  //           relevantWhats.push(userHow.whatAmI);
  //         }
  //       }
  //     }
  //     if(relevantWhats.length!=0){
  //       var whats = [
  //         {
  //           name: "knalledge",
  //           relevant: true
  //         },
  //         {
  //           name: "science",
  //           relevant: false
  //         }
  //       ]
  //       $scope.items.push(
  //         {
  //           _id: vkNode.kNode._id,
  //           name: vkNode.kNode.name,
  //           vkNode: vkNode,
  //           whats: relevantWhats
  //         }
  //       );
  //     }
  //   }
  // }


  grant(suggestion){
    suggestion.state = SuggestionState.GRANTED;
    //TODO: inform user that it is granted
  }

  topicClicked(topic){
    this.globalEmitterServicesArray.get(this.changeSelectedNodeEventName).broadcast('SuggestionComponent', topic._id);
  }

  revoke(suggestion){
    suggestion.state = SuggestionState.REVOKED;
    //TODO: inform user that it is revoked
    for(let i=0;i<this.suggestions.length;i++){
      if(this.suggestions[i] === suggestion){
        this.suggestions.splice(i, 1);
      }
    }
  }
}
