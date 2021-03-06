import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {KNode, KEdge, KMap, VO} from '@colabo-knalledge/f-core';
import {ServerData} from '@colabo-knalledge/f-store_core/ServerData';

import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/f-store_core/knalledge-map.service';

import {GlobalEmittersArrayService} from '@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray';

import {UserData} from './userData';

console.log("rima-aaa.service");

import * as config from '@colabo-utils/i-config';

import { CFService } from '@colabo-knalledge/f-store_core/cf.service';

console.log("[rima-aaa.service] config.GetGeneral('mapId'):", config.GetGeneral('mapId'));

const MAP_ID = config.GetGeneral('mapId');
const USERS_NODE_ID:string = config.GetGeneral('userNodeId');

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export enum ProfilingStateType {
  OFF = 'OFF',
  USER_ID = 'USER_ID',
  ATTRIBUTE = 'ATTRIBUTE'
}

const aaaAP = "aaa";

@Injectable()
export class RimaAAAService extends CFService{
  activeUser:KNode = null;

  private apiUrl: string;
  private defaultAction:string = 'default';

  private loggedInUser:KNode;
  private _isRegistered:boolean;
  private _isErrorLogingIn:boolean;
  private _errorLogingMsg:string;

  ProfilingStateTypeNames:string[] = [
    'OFF',
    'USER_ID',
    'ATTRIBUTE'
  ];

  currentAttributeIndex:number =  0;

  profilingState: ProfilingStateType = ProfilingStateType.OFF;

  constructor(
    private http: HttpClient,
    // private colabowareRFIDService: ColabowareRFIDService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmittersArrayService
  ) {

    super();
    console.log('RimaAAAService:constructor'); //TODO:NG2: this.apiUrl = this.ENV.server.backend + '/' + nodeAP + '/';
    this.apiUrl = CFService.serverAP + '/' + aaaAP + '/';
    this.loadLoggedInUser();

    //getting data for the user:
    //this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.coLaboWareProvidedData.bind(this));
  }

  loadLoggedInUser():KNode{
    this.loggedInUser = null;
    let _loggedInUserStr:string = window.localStorage.getItem('loggedInUser');
    if(_loggedInUserStr && _loggedInUserStr !== 'undefined' && _loggedInUserStr !== 'null'){
      this.loggedInUser = JSON.parse(_loggedInUserStr);
    }
    return this.loggedInUser;
  }

  saveLoggedInUser(_loggedInUser:KNode){
    let _loggedInUserStr:string = JSON.stringify(_loggedInUser);
    window.localStorage.setItem('loggedInUser', _loggedInUserStr);
    this.loggedInUser = _loggedInUser;
    this._isRegistered = this.loggedInUser !== null && this.loggedInUser !== undefined;
  }

  get isRegistered():boolean{
    return this._isRegistered;
  }
  getUserId():string{
      if(this.loggedInUser) return this.loggedInUser._id;
      else return null;
    //TODO: HACK:
    // return '5b4db0645381b24d03f908b6';
  }

  getUser():KNode{
      if(this.loggedInUser) return this.loggedInUser;
      else return null;
  }

  getUserById(id:string):Observable<KNode>{ //TODO: not to get users from server each time, but from a local array
      return this.knalledgeNodeService.getById(id);
  }

  getRegisteredUsers(mapId:string):Observable<KNode[]>{ //TODO: not to get users from server each time, but from a local array
    return this.knalledgeNodeService.queryInMapofType(mapId, KNode.TYPE_USER);
  }

  /**
   * Creates the provided user node on the server and returns its server-updated appearance
   * @param {KNode} kNode the pre-populated node to be created on the server
   * @param {function} callback Function to be called when the node is created
   * @returns {Observable<KNode>} the created node (now with the id and other specific data allocated to it by server, so the caller should fill the original node with it)
     @example http://localhost:8001/knodes/in_map/default/579811d88e12abfa556f6b59.json
   */
  createUserNode(kNode:KNode, callback?:Function): Observable<KNode>
  {
    // TODO, check create method in @colabo-knalledge/f-store_core/knalledge-node.service.ts
    // to see all TODOS
    let extractVO:Function = this.extractVO;

    function _extractVO(serverResponse: any):KNode {
      let vo: KNode = KNode.factory(serverResponse.data);
      vo.state = VO.STATE_SYNCED;
      return vo;
    }

    function createdResponse(serverResponse:any):KNode{
        console.log("[createUserNode:createdResponse]: created");
        if(serverResponse.success){
            let node:KNode = _extractVO(serverResponse);
            this.saveLoggedInUser(node);
            this._isRegistered = true;
            return node;
        }else{
            this.saveLoggedInUser(null);
            this._isRegistered = false;
            this._isErrorLogingIn = true;
            this._errorLogingMsg = serverResponse.message;

            return null;
        }
    }
    console.log("RimaAAAService.create");

    // give it another chance! ;)
    this._isErrorLogingIn = false;
    this._errorLogingMsg = null;

    let result: Observable<KNode> = null;

    let kNodeForServer:any = kNode.toServerCopy();
    kNodeForServer.action = 'createUser';

      result = this.http.post<ServerData>(this.apiUrl, kNodeForServer, httpOptions)
      .pipe(
        //tap((nodeS: KNode) => console.log(`CREATED 'node'${nodeS}`)), // not needed - it's just for logging
          map(serverResponse => createdResponse.bind(this)(serverResponse)), //the sever returns `ServerData` object
        catchError(this.handleError<KNode>('RimaAAAService::create'))
      );

    if(callback){result.subscribe(nodes => callback(nodes));}
  	return result;
  }

  createNewNodeWithEdge(newNode:KNode, newEdge:KEdge, parentNodeId:string, listener){
    newNode.iAmId = "556760847125996dc1a4a24f";
    newNode.visual = {};
    newEdge.iAmId = "556760847125996dc1a4a24f";
    newEdge.visual = {};

    //TODO: iAmId, createdAt, updatedAt
    this.createUserNode(newNode)
    .subscribe(newNodeCreated.bind(this));

    // callback after the new user is created
    function newNodeCreated(newNode:KNode):void{
      console.log('newUserCreated', newNode);
      this.activeUser = newNode;
      //this.nodes.push(newNode);

      newEdge.sourceId = parentNodeId;
      newEdge.targetId = newNode._id;
      //TODO: iAmId, createdAt, updatedAt
      this.knalledgeEdgeService.create(newEdge)
      .subscribe(newEdgeCreated.bind(this));

      // callback after an edge to the new node is created
      function newEdgeCreated(newEdge:KEdge):void{
        console.log('newEdgeCreated', newEdge);
        listener(newNode, newEdge);
        //this.edges.push(newEdge);
      }
    }
  }

  get isErrorLogingIn():boolean{
      return this._isErrorLogingIn;
  }

  get errorLogingMsg():string{
      return this._errorLogingMsg;
  }

  // check existing user's credentials
  checkUser(userData:UserData, callback:Function=null){
      let extractVO: Function = this.extractVO;

      function _extractVO(serverResponse: any): KNode {
          let vo: KNode = KNode.factory(serverResponse.data);
          vo.state = VO.STATE_SYNCED;
          return vo;
      }

      function checkedResponse(serverResponse: any): KNode {
          console.log("[checkUser:checkedResponse]: created");
          if (serverResponse.success) {
              let node: KNode = _extractVO(serverResponse);
              this.saveLoggedInUser(node);
              this._isRegistered = true;
              return node;
          } else {
              this.saveLoggedInUser(null);
              this._isRegistered = false;
              this._isErrorLogingIn = true;
              this._errorLogingMsg = serverResponse.message;

              return null;
          }
      }


    // give it another chance! ;)
    this._isErrorLogingIn = false;
    this._errorLogingMsg = null;

    // TODO: Avoid INJECTING action in the object
    // ather create a separate path or add additional encapsulation
    userData.action = 'checkUser';
    // TODO: we can keep that to force checking agains speciffic map
    // userData.mapId = MAP_ID;

    let result: Observable<KNode> = null;
    result = this.http.post<ServerData>(this.apiUrl, userData, httpOptions)
    .pipe(
        //tap((nodeS: KNode) => console.log(`CREATED 'node'${nodeS}`)), // not needed - it's just for logging
        map(serverResponse => checkedResponse.bind(this)(serverResponse)), //the sever returns `ServerData` object
        catchError(this.handleError<KNode>('RimaAAAService::create'))
    );

    console.log('result:');
    console.log(result);
    if(callback){result.subscribe(node => callback(node));}
    return result;
  }

  logOut(){
    this.saveLoggedInUser(null);
  }

  // create new user
  createNewUser(newUserData:any, callback:Function=null){
    console.log("[createNewUser] newUserData: ", newUserData);

    //TODO: check if the user's email is already existing (offer sign-in instead and data updating)

    // creating new user node
    let userNode:KNode = new KNode();
    userNode.mapId = MAP_ID;
    userNode.name = newUserData.firstName;
    userNode.type = KNode.TYPE_USER;
    userNode.dataContent = {
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      email: newUserData.email,
      password: newUserData.password,

      /* TODO:
      image: {
        url: newUserData.image.url
        // width: image.width,
        // height: image.height
      }
      */
    }

    // creating edge between new user and users node (with type KNode.TYPE_USERS)
    let userEdge:KEdge = new KEdge();
    userEdge.mapId = MAP_ID;
    userEdge.name = "User";
    userEdge.type = KEdge.TYPE_USER;

    this.createNewNodeWithEdge(userNode, userEdge, USERS_NODE_ID, newUserCreated.bind(this));

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      console.log('newUserCreated',newUser, newUserEdge);
      if(callback) callback(newUser, newUserEdge);
    }
  }
}
