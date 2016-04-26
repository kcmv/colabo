import {Injectable
} from 'angular2/core';

import {Request} from './request';
import {RequestType} from './request';
import {RequestVisibility} from './request';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

@Injectable()
export class RequestService {
  public EMITTER_NAME_REQUEST:string = 'EMITTER_NAME_REQUEST';
  //private static EVENT_NAME_REQUEST: string = 'EVENT_NAME_REQUEST';
  private rimaService:any;
  private knalledgeMapVOsService:any;
  private knAllEdgeRealTimeService:any;
  private knalledgeMapPolicyService:any;
  private globalEmitterServicesArray:GlobalEmitterServicesArray;
  private requests: Request[] = [];

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

      let requestPluginOptions: any = {
        name: "RequestService",
        events: {
        }
      };
      requestPluginOptions.events[this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST] = this.receivedRequest.bind(this);
      this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);

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
    this.requests.push(r1);
    this.requests.push(r2);
    this.requests.push(r3);
  }

  sendRequest(request: Request, callback: Function){
    //let req:Request = new Request();
    request.mapId = this.knalledgeMapVOsService.getMapId();
    request.who = this.rimaService.getWhoAmI()._id;
    console.log(request);

    if(this.knAllEdgeRealTimeService){
      this.knAllEdgeRealTimeService.emit(this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST, request);
      callback(true);
    } else {
      callback(false, 'SERVICE_UNAVAILABLE');
    }
  }

  filterRequest(request){
    switch(request.visibility){
      case RequestVisibility.ALL:
        return true;
      //break;
      case RequestVisibility.MAP_PARTICIPANTS:
        return request.mapId === this.knalledgeMapVOsService.getMapId(); //TODO: can be ckecked further for map participants
      //break;
      case RequestVisibility.MAP_MEDIATORS:
        if(this.knalledgeMapPolicyService.provider.config.moderating.enabled){
          return true;
        } else {
          return false;
        }
      //break;
      case RequestVisibility.USER:
        if(request.dataContent && request.dataContent.toWhom && request.dataContent.toWhom === this.rimaService.getWhoAmI()._id){
          return true;
        } else {
          return false;
        }
      //break;
      default:
        return true;
    }
  }

  getRequestsRef(){
    return this.requests;
  }

  receivedRequest(eventName:string, request:Request){
      this.requests.push(request);
      if(this.filterRequest(request)){
        request.who = this.rimaService.getUserById(request.who); //can be null!
        request.reference = this.knalledgeMapVOsService.getNodeById(request.reference); //can be null!
        console.log('[RequestService:receivedRequest] request:', JSON.stringify(request));
        if(request.type === RequestType.REPLICA){
          console.log(' requested REPLICA for ');
        }
        this.globalEmitterServicesArray.register(this.EMITTER_NAME_REQUEST);
        this.globalEmitterServicesArray.get(this.EMITTER_NAME_REQUEST).broadcast(
        'RequestService', {'request':request,'event':this.EMITTER_NAME_REQUEST});
      }
  }
}
