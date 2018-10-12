import {Injectable
} from '@angular/core';

import {Suggestion, SuggestionVisibility, SuggestionType, SuggestionState} from './suggestion';
import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';
import {InfoForDialog} from '@colabo-knalledge/f-view_interaction/code/interaction/infoForDialog';

declare var knalledge;

@Injectable()
export class SuggestionService {
  public selectedNode:any; //KNode;
  private rimaService:any;
  private knalledgeMapVOsService:any;
  private knAllEdgeRealTimeService:any;
  private knalledgeMapPolicyService:any;
  private globalEmitterServicesArray:GlobalEmittersArrayService;
  private suggestionsByExpertise: Suggestion[] = [];
  private users:any[] = [];
  private SHOW_INFO: string = "SHOW_INFO";

  /**
   * Service constructor
   * @constructor
   * @memberof topiChat.TopiChatService
   * @param  socketFactory         [description]
   * @param  $rootScope            [description]
   * @param  {Object} ENV                   [description]
   * @param  {Service} TopiChatConfigService - TopiChat Config service
   */
  constructor(RimaService, KnalledgeMapVOsService, KnalledgeMapPolicyService,
      KnAllEdgeRealTimeService, _GlobalEmittersArrayService_
  ) {
      //console.log('RequestService:constructor');
      this.rimaService = RimaService;
      this.knalledgeMapVOsService = KnalledgeMapVOsService;
      this.knAllEdgeRealTimeService = KnAllEdgeRealTimeService;
      this.knalledgeMapPolicyService = KnalledgeMapPolicyService;
      this.globalEmitterServicesArray = _GlobalEmittersArrayService_;

      // let suggestionPluginOptions: any = {
      //   name: "SuggestionService",
      //   events: {
      //   }
      // };
      // suggestionPluginOptions.events[this.knAllEdgeRealTimeService.REQUEST_EVENT] = this.receivedSuggestion.bind(this);
      // this.knAllEdgeRealTimeService.registerPlugin(suggestionPluginOptions);

      this.getMockupSuggestions();
      this.users = this.rimaService.getUsers(); //TODO: should we later add that CF suggests only logged in users?!
      let rimaWhatsChangedEvent = "rimaWhatsChangedEvent";
      this.globalEmitterServicesArray.register(rimaWhatsChangedEvent);
      this.globalEmitterServicesArray.get(rimaWhatsChangedEvent).subscribe(
        'SuggestionComponent', this.rimaWhatsChanged.bind(this));
      this.globalEmitterServicesArray.register(this.SHOW_INFO);
  }

  getMockupSuggestions(){
    var r1:Suggestion = new Suggestion();
      r1.who = null;
      r1.reference = null;
      r1.type = SuggestionType.EXPERT;
    var r2:Suggestion = new Suggestion();
      r2.who = {displayName:'Dino'};
      r2.reference = {name:'Collective Mind'};
      r2.type = SuggestionType.EXPERT;
    var r3:Suggestion = new Suggestion();
      r3.who = {displayName:'TestUser'};
      r3.reference = {name:'Eco-Problems'};
      r3.type = SuggestionType.EXPERT;
    this.suggestionsByExpertise.push(r1);
    this.suggestionsByExpertise.push(r2);
    this.suggestionsByExpertise.push(r3);
  }

  getSelectedNode(){
    return this.knalledgeMapVOsService.mapStructure.getSelectedNode();
  }

  rimaWhatsChanged(msg:any){
    console.log('rimaWhatsChanged');
    if(this.selectedNode){
      this.suggestionsByExpertise = this.setSuggestedExpertsForNode(this.selectedNode.kNode);
    }
    if(msg.actionType === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING){
      if(this.isInMyHowAmIs(msg.change)){
          this.globalEmitterServicesArray.get(this.SHOW_INFO).broadcast('SuggestionService',
          new InfoForDialog('Dear ' +  this.rimaService.getWhoAmI().displayName +
          ", you've been recognized as an expert for topic <span class='emp_bg'>" +
          msg.node.name + "</span>, being added now. Are you interested in giving your thoughts on this topic?",
          'Expert recognized'));
      }
    }
  }

  isInMyHowAmIs(what:knalledge.WhatAmI){
    return this.rimaService.isInMyHowAmIs(what);
  }

  setSuggestedExpertsForNode(node: any){
    console.log('setSuggestedExpertsForNode');
    this.suggestionsByExpertise.length = 0;
    if(node !== null){
      //for each user:
      //for each how of the user:
      for(var i in this.users){
        let user = this.users[i];
        let userHows = this.rimaService.howAmIs[user._id];
      // TODO: Sasa want logged in user also [this.rimaService.loggedInWhoAmI._id];
        //getting all whats from the node:
        let nodeWhats = (node && node.dataContent && node.dataContent.rima && node.dataContent.rima.whats) ?
          node.dataContent.rima.whats : [];

        var relevantWhats = []; //here are kept all found relevant whats
        // TODO: can be optimized by hash of userHows
        for(let wi=0;wi<nodeWhats.length;wi++){ //through all the whats of the node
          var nodeWhat = nodeWhats[wi];
          for(var hi in userHows){
            var userHow = userHows[hi];
            if (userHow && userHow.whatAmI && (userHow.whatAmI.name === nodeWhat.name &&
              this.rimaService.isExpertHow(userHow.how) //avoiding 'INTERESTED IN' (THOSE ARE NOT experts)
            )){
              let alreadyAdded = false;
              //same whats can be associated to a user by different hows
              for(let rwi=0;rwi<relevantWhats.length;rwi++){
                if(relevantWhats[rwi].name === userHow.whatAmI.name){
                  alreadyAdded = true;
                }
              }
              if(!alreadyAdded){relevantWhats.push(userHow.whatAmI);}
            }
          }
        }
        if(relevantWhats.length!==0){
          let suggestion:Suggestion = new Suggestion();
          suggestion.reference = node;
          suggestion.type = SuggestionType.EXPERT;
          suggestion.mapId = this.knalledgeMapVOsService.getMapId();
          suggestion.who = user;
          suggestion.visibility = SuggestionVisibility.MAP_MEDIATORS;
          suggestion.state = SuggestionState.SUGGESTED;
          suggestion.dataContent.relevantWhats = relevantWhats;

          this.suggestionsByExpertise.push(suggestion);
        }
      }
    }
    return this.suggestionsByExpertise;
  }

  // sendSuggestion(suggestion: Suggestion, callback: Function){
  //   //let req:Suggestion = new Suggestion();
  //   suggestion.mapId = this.knalledgeMapVOsService.getMapId();
  //   suggestion.who = this.rimaService.getWhoAmI()._id;
  //   console.log(suggestion);
  //
  //   if(this.knAllEdgeRealTimeService){
  //     this.knAllEdgeRealTimeService.emit(this.knAllEdgeRealTimeService.REQUEST_EVENT, suggestion);
  //     callback(true);
  //   } else {
  //     callback(false, 'SERVICE_UNAVAILABLE');
  //   }
  // }

  filterSuggestion(suggestion){
    switch(suggestion.visibility){
      case SuggestionVisibility.ALL:
        return true;
      //break;
      case SuggestionVisibility.MAP_PARTICIPANTS:
        return suggestion.mapId === this.knalledgeMapVOsService.getMapId(); //TODO: can be ckecked further for map participants
      //break;
      case SuggestionVisibility.MAP_MEDIATORS:
        if(this.knalledgeMapPolicyService.provider.config.moderating.enabled){
          return true;
        } else {
          return false;
        }
      //break;
      case SuggestionVisibility.USER:
        if(suggestion.dataContent && suggestion.dataContent.toWhom && suggestion.dataContent.toWhom === this.rimaService.getWhoAmI()._id){
          return true;
        } else {
          return false;
        }
      //break;
      default:
        return true;
    }
  }

  getSuggestionsRef(){
    return this.suggestionsByExpertise;
  }

  // receivedSuggestion(eventName:string, suggestion:Suggestion){
  //     this.suggestionsByExpertise.push(suggestion);
  //     if(this.filterSuggestion(suggestion)){
  //       suggestion.who = this.rimaService.getUserById(suggestion.who); //can be null!
  //       suggestion.reference = this.knalledgeMapVOsService.getNodeById(suggestion.reference); //can be null!
  //       console.log('[SuggestionService:receivedSuggestion] suggestion:', JSON.stringify(suggestion));
  //       if(suggestion.type === SuggestionType.REPLICA){
  //         console.log(' suggestioned REPLICA for ');
  //       }
  //       this.globalEmitterServicesArray.register(this.EMITTER_NAME_REQUEST);
  //       this.globalEmitterServicesArray.get(this.EMITTER_NAME_REQUEST).broadcast(
  //       'SuggestionService', {'suggestion':suggestion,'event':this.EMITTER_NAME_REQUEST});
  //     }
  // }
}
