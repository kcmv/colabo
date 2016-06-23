import {Injectable
} from 'angular2/core';

import {Change, ChangeVisibility, ChangeType, ChangeState} from './change';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

/*
for showing structural changes, reacting on node-created, node-updated, node-deleted
(in future also for edge-deleted and edge-updated (in a case that a node is relinked, or edge/name is changed))
 */
@Injectable()
export class ChangeService {
  private rimaService:any;
  private knalledgeMapVOsService:any;
  private knAllEdgeRealTimeService:any;
  private knalledgeMapPolicyService:any;
  private globalEmitterServicesArray:GlobalEmitterServicesArray;
  private changesByExpertise: Change[] = [];
  private users:any[] = [];

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
      //console.log('RequestService:constructor');
      this.rimaService = RimaService;
      this.knalledgeMapVOsService = KnalledgeMapVOsService;
      this.knAllEdgeRealTimeService = KnAllEdgeRealTimeService;
      this.knalledgeMapPolicyService = KnalledgeMapPolicyService;
      this.globalEmitterServicesArray = _GlobalEmitterServicesArray_;

      // let changePluginOptions: any = {
      //   name: "ChangeService",
      //   events: {
      //   }
      // };
      // changePluginOptions.events[this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST] = this.receivedChange.bind(this);
      // this.knAllEdgeRealTimeService.registerPlugin(changePluginOptions);

      this.getMockupChanges();
      this.users = this.rimaService.getUsers(); //TODO: should we later add that CF suggests only logged in users?!
  }

  getMockupChanges(){
    var r1:Change = new Change();
      r1.who = null;
      r1.reference = null;
      r1.type = ChangeType.EXPERT;
    var r2:Change = new Change();
      r2.who = {displayName:'Dino'};
      r2.reference = {name:'Collective Mind'};
      r2.type = ChangeType.EXPERT;
    var r3:Change = new Change();
      r3.who = {displayName:'TestUser'};
      r3.reference = {name:'Eco-Problems'};
      r3.type = ChangeType.EXPERT;
    this.changesByExpertise.push(r1);
    this.changesByExpertise.push(r2);
    this.changesByExpertise.push(r3);
  }

  getSelectedNode(){
    return this.knalledgeMapVOsService.mapStructure.getSelectedNode();
  }

  isExpertHow(how:number){
    switch(how){
      case 1:
        return false;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
    }
  }

  setSuggestedExpertsForNode(node: any){
    console.log('setSuggestedExpertsForNode');
    this.changesByExpertise.length = 0;
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
              this.isExpertHow(userHow.how) //avoiding 'INTERESTED IN' (THOSE ARE NOT experts)
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
          let change:Change = new Change();
          change.reference = node;
          change.type = ChangeType.EXPERT;
          change.mapId = this.knalledgeMapVOsService.getMapId();
          change.who = user;
          change.visibility = ChangeVisibility.MAP_MEDIATORS;
          change.state = ChangeState.SUGGESTED;
          change.dataContent.relevantWhats = relevantWhats;

          this.changesByExpertise.push(change);
        }
      }
    }
    return this.changesByExpertise;
  }

  // sendChange(change: Change, callback: Function){
  //   //let req:Change = new Change();
  //   change.mapId = this.knalledgeMapVOsService.getMapId();
  //   change.who = this.rimaService.getWhoAmI()._id;
  //   console.log(change);
  //
  //   if(this.knAllEdgeRealTimeService){
  //     this.knAllEdgeRealTimeService.emit(this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST, change);
  //     callback(true);
  //   } else {
  //     callback(false, 'SERVICE_UNAVAILABLE');
  //   }
  // }

  filterChange(change){
    switch(change.visibility){
      case ChangeVisibility.ALL:
        return true;
      //break;
      case ChangeVisibility.MAP_PARTICIPANTS:
        return change.mapId === this.knalledgeMapVOsService.getMapId(); //TODO: can be ckecked further for map participants
      //break;
      case ChangeVisibility.MAP_MEDIATORS:
        if(this.knalledgeMapPolicyService.provider.config.moderating.enabled){
          return true;
        } else {
          return false;
        }
      //break;
      case ChangeVisibility.USER:
        if(change.dataContent && change.dataContent.toWhom && change.dataContent.toWhom === this.rimaService.getWhoAmI()._id){
          return true;
        } else {
          return false;
        }
      //break;
      default:
        return true;
    }
  }

  getChangesRef(){
    return this.changesByExpertise;
  }

  // receivedChange(eventName:string, change:Change){
  //     this.changesByExpertise.push(change);
  //     if(this.filterChange(change)){
  //       change.who = this.rimaService.getUserById(change.who); //can be null!
  //       change.reference = this.knalledgeMapVOsService.getNodeById(change.reference); //can be null!
  //       console.log('[ChangeService:receivedChange] change:', JSON.stringify(change));
  //       if(change.type === ChangeType.REPLICA){
  //         console.log(' changeed REPLICA for ');
  //       }
  //       this.globalEmitterServicesArray.register(this.EMITTER_NAME_REQUEST);
  //       this.globalEmitterServicesArray.get(this.EMITTER_NAME_REQUEST).broadcast(
  //       'ChangeService', {'change':change,'event':this.EMITTER_NAME_REQUEST});
  //     }
  // }
}
