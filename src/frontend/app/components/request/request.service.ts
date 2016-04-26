import {Injectable
 , Inject
} from 'angular2/core';

import {Request} from './request';
import {RequestType} from './request';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

@Injectable()
export class RequestService {
  public EMITTER_NAME_REQUEST:string = 'EMITTER_NAME_REQUEST';
  //private static EVENT_NAME_REQUEST: string = 'EVENT_NAME_REQUEST';
  private rimaService:any;
  private knalledgeMapVOsService:any;
  private knAllEdgeRealTimeService:any;

  /**
   * Service constructor
   * @constructor
   * @memberof topiChat.TopiChatService
   * @param  socketFactory         [description]
   * @param  $rootScope            [description]
   * @param  {Object} ENV                   [description]
   * @param  {Service} TopiChatConfigService - TopiChat Config service
   */
  constructor(RimaService, KnalledgeMapVOsService, KnAllEdgeRealTimeService
    , @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ) {
      this.rimaService = RimaService;
      this.knalledgeMapVOsService = KnalledgeMapVOsService;
      this.knAllEdgeRealTimeService = KnAllEdgeRealTimeService;


      let requestPluginOptions: any = {
        name: "RequestService",
        events: {
        }
      };
      requestPluginOptions.events[this.knAllEdgeRealTimeService.EVENT_NAME_REQUEST] = this.receivedRequest.bind(this);
      this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
  };

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
    return true;
  }

  receivedRequest(eventName:string, request:Request){
      if(this.filterRequest(request)){
        request.who = this.rimaService.getUserById(request.who); //can be null!
        request.reference = this.knalledgeMapVOsService.getNodeById(request.reference);
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
