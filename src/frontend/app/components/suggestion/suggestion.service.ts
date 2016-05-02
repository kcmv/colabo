import {Injectable
} from 'angular2/core';

import {Suggestion, SuggestionVisibility, SuggestionType} from './suggestion';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

@Injectable()
export class SuggestionService {
  public EMITTER_NAME_REQUEST:string = 'EMITTER_NAME_REQUEST';
  //private static EVENT_NAME_REQUEST: string = 'EVENT_NAME_REQUEST';
  private rimaService:any;
  private knalledgeMapVOsService:any;
  private knAllEdgeRealTimeService:any;
  private knalledgeMapPolicyService:any;
  private globalEmitterServicesArray:GlobalEmitterServicesArray;
  private suggestions: Suggestion[] = [];

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
      KnAllEdgeRealTimeService, _GlobalEmitterServicesArray_
  ) {
      this.rimaService = RimaService;
      this.knalledgeMapVOsService = KnalledgeMapVOsService;
      this.knAllEdgeRealTimeService = KnAllEdgeRealTimeService;
      this.knalledgeMapPolicyService = KnalledgeMapPolicyService;
      this.globalEmitterServicesArray = _GlobalEmitterServicesArray_;

      let suggestionPluginOptions: any = {
        name: "SuggestionService",
        events: {
        }
      };
      suggestionPluginOptions.events[this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST] = this.receivedSuggestion.bind(this);
      this.knAllEdgeRealTimeService.registerPlugin(suggestionPluginOptions);

      this.getMockupSuggestions();
  }

  getMockupSuggestions(){
    var r1:Suggestion = new Suggestion();
      r1.who = null;
      r1.reference = null;
      r1.type = SuggestionType.REPLICA;
    var r2:Suggestion = new Suggestion();
      r2.who = {displayName:'Dino'};
      r2.reference = {name:'Collective Mind'};
      r2.type = SuggestionType.REPLICA;
    var r3:Suggestion = new Suggestion();
      r3.who = {displayName:'TestUser'};
      r3.reference = {name:'Eco-Problems'};
      r3.type = SuggestionType.CLARIFICATION;
    this.suggestions.push(r1);
    this.suggestions.push(r2);
    this.suggestions.push(r3);
  }

  sendSuggestion(suggestion: Suggestion, callback: Function){
    //let req:Suggestion = new Suggestion();
    suggestion.mapId = this.knalledgeMapVOsService.getMapId();
    suggestion.who = this.rimaService.getWhoAmI()._id;
    console.log(suggestion);

    if(this.knAllEdgeRealTimeService){
      this.knAllEdgeRealTimeService.emit(this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST, suggestion);
      callback(true);
    } else {
      callback(false, 'SERVICE_UNAVAILABLE');
    }
  }

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
    return this.suggestions;
  }

  receivedSuggestion(eventName:string, suggestion:Suggestion){
      this.suggestions.push(suggestion);
      if(this.filterSuggestion(suggestion)){
        suggestion.who = this.rimaService.getUserById(suggestion.who); //can be null!
        suggestion.reference = this.knalledgeMapVOsService.getNodeById(suggestion.reference); //can be null!
        console.log('[SuggestionService:receivedSuggestion] suggestion:', JSON.stringify(suggestion));
        if(suggestion.type === SuggestionType.REPLICA){
          console.log(' suggestioned REPLICA for ');
        }
        this.globalEmitterServicesArray.register(this.EMITTER_NAME_REQUEST);
        this.globalEmitterServicesArray.get(this.EMITTER_NAME_REQUEST).broadcast(
        'SuggestionService', {'suggestion':suggestion,'event':this.EMITTER_NAME_REQUEST});
      }
  }
}
