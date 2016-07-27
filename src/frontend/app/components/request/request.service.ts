import {Injectable
} from '@angular/core';

import {Request} from './request';
import {RequestType} from './request';
import {RequestVisibility} from './request';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

declare var interaction:any;

@Injectable()
export class RequestService {
    public EMITTER_NAME_REQUEST: string = 'EMITTER_NAME_REQUEST';

    plugins:any = {
        mapVisualizeHaloPlugins: {
            service: this,
            init: function init(halo:any, actions:any, mapInteraction:any) {
                let that = this;

                this.halo = halo;
                this.mapInteraction = mapInteraction;

                actions.showRequests = function(){
                    // that.halo.remove();

                    // window.alert("show requests");
                    // that.mapInteraction.toggleNode();
                    this.service._participantRequest(this);
                }.bind(this);
            },

            create: function create(haloOptions:any) {
                haloOptions.icons.push(
                    {
                        position: "nw",
                        iconClass: "fa-bell",
                        action: "showRequests"
                    }
                );
            }
        },

/*        mapInteractionPlugins: {
            service: this,
            init: function init(){

            },

            participantRequest: function participantRequest(){
                this.service._participantRequest(this);
            }
        },
*/

        keboardPlugins: {
            service: this,
            init: function init(keyboard:any, mapInteraction:any) {
                let that = this;

                this.keyboard = keyboard;
                this.mapInteraction = mapInteraction;

                /**
            	 *  Activates Request console for participant:
            	* PreAction: ...
            	* PostAction: ...
            	*/
            	this.keyboard.registerKey(interaction.Keyboard.KEY_PREFIX+"r", 'down',
                function(){
            		// that.mapInteraction.invokePluginMethod('request.RequestService', 'participantRequest');
            		that.service._participantRequest(this);
            	}.bind(this));
            }
        }
    };

    //private static REQUEST_EVENT: string = 'REQUEST_EVENT';
    private rimaService: any;
    private knalledgeMapVOsService: any;
    private knAllEdgeRealTimeService: any;
    private knalledgeMapPolicyService: any;
    private globalEmitterServicesArray: GlobalEmitterServicesArray;
    private requests: Request[] = [];
    private _onChangeHandlers: Function[] = [];

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
        this.globalEmitterServicesArray.register(this.EMITTER_NAME_REQUEST);

        let requestPluginOptions: any = {
            name: "RequestService",
            events: {
            }
        };
        requestPluginOptions.events[this.knAllEdgeRealTimeService.REQUEST_EVENT] = this.receivedRequest.bind(this);
        this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);

        //this.getMockupRequests();
    }

    getMockupRequests() {
        var r1: Request = new Request();
        r1.who = null;
        r1.reference = null;
        r1.type = RequestType.REPLICA;
        var r2: Request = new Request();
        r2.who = { displayName: 'Dino' };
        r2.reference = { name: 'Collective Mind' };
        r2.type = RequestType.REPLICA;
        var r3: Request = new Request();
        r3.who = { displayName: 'TestUser' };
        r3.reference = { name: 'Eco-Problems' };
        r3.type = RequestType.CLARIFICATION;
        var r4: Request = new Request();
        r4.who = { displayName: 'Dino' };
        r4.reference = { name: 'Polyscopy' };
        r4.type = RequestType.CLARIFICATION;
        this.requests.push(r1);
        this.requests.push(r2);
        this.requests.push(r3);
        this.requests.push(r4);
        this.callOnChangeHandlers(4);
    }

    sendRequest(request: Request, callback: Function) {
        //let req:Request = new Request();
        request.mapId = this.knalledgeMapVOsService.getMapId();
        request.who = this.rimaService.getWhoAmI()._id;
        console.log(request);

        if (this.knAllEdgeRealTimeService) {
            this.knAllEdgeRealTimeService.emit(this.knAllEdgeRealTimeService.REQUEST_EVENT, request);
            callback(true);
        } else {
            callback(false, 'SERVICE_UNAVAILABLE');
        }
    }

    filterRequest(request) {
        switch (request.visibility) {
            case RequestVisibility.ALL:
                return true;
            //break;
            case RequestVisibility.MAP_PARTICIPANTS:
                return request.mapId === this.knalledgeMapVOsService.getMapId(); //TODO: can be ckecked further for map participants
            //break;
            case RequestVisibility.MAP_MEDIATORS:
                if (this.knalledgeMapPolicyService.provider.config.moderating.enabled) {
                    return true;
                } else {
                    return false;
                }
            //break;
            case RequestVisibility.USER:
                if (request.dataContent && request.dataContent.toWhom && request.dataContent.toWhom === this.rimaService.getWhoAmI()._id) {
                    return true;
                } else {
                    return false;
                }
            //break;
            default:
                return true;
        }
    }

    getRequestsRef() {
        return this.requests;
    }

    receivedRequest(eventName: string, request: Request) {
      if (this.filterRequest(request)) {
        this.requests.push(request);
        request.who = this.rimaService.getUserById(request.who); //can be null!
        request.reference = this.knalledgeMapVOsService.getNodeById(request.reference); //can be null!
      //  console.log('[RequestService:receivedRequest] request:', JSON.stringify(request));
        if (request.type === RequestType.REPLICA) {
            console.log(' requested REPLICA for ');
        }
        this.callOnChangeHandlers(1);

        this.globalEmitterServicesArray.get(this.EMITTER_NAME_REQUEST).broadcast(
            'RequestService', { 'request': request, 'event': this.EMITTER_NAME_REQUEST });
      }
    }

    _participantRequest(plugin){
        var reference = plugin.mapInteraction.clientApi.getSelectedNode();
        if (!reference) {
            //TODO: enable later node selection
            window.alert('You have to select a topic (node) before requesting REPLICA on it');
            return; // no parent node selected
        }
        if (window.confirm('Are you sure you want to send request for REPLICA on the node\n"'+reference.kNode.name+'"')){
          //window.alert('You are sending request for REPLICA on the node\n"' + reference.kNode.name + '"');
          if (!plugin.mapInteraction.isStatusMap()) { return; }
          let request: Request = new Request();
          request.type = RequestType.REPLICA;
          request.reference = reference.kNode._id;
          this.sendRequest(request, function(result, error) {
              if (result) {
                  //TODO: update participant's requests panel
              } else {
                  switch (error) {
                      case 'SERVICE_UNAVAILABLE':
                          window.alert('Service is unavailable at the moment. Try later');
                          break;
                  }
              }
          });
        }
    }

    grant(request){
      /*TODO:finish granting
      request.mapId = this.knalledgeMapVOsService.getMapId();
      request.who = this.rimaService.getWhoAmI()._id;
      console.log(request);

      if (this.knAllEdgeRealTimeService) {
          this.knAllEdgeRealTimeService.emit(this.knAllEdgeRealTimeService.REQUEST_EVENT, request);
          callback(true);
      } else {
          callback(false, 'SERVICE_UNAVAILABLE');
      }
      */
    }

    public set onChangeHandler(h: Function){
      for(var i: number = 0; i < this._onChangeHandlers.length; i++){
        if(this._onChangeHandlers[i] === h) return;
      }
      this._onChangeHandlers.push(h);
    }

    private callOnChangeHandlers(no:number):void {
      for(var i: number = 0; i < this._onChangeHandlers.length; i++){
        this._onChangeHandlers[i](no);
      }
    }
}
