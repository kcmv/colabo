import { Injectable } from '@angular/core';

import {KMap} from '@colabo-knalledge/knalledge_core/code/knalledge/kMap';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';

import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

import {UserData} from './userData';

//this consts are defined by INSTALL.MD data:
const MAP_ID = "5b49e7f736390f03580ac9a7";
const USERS_NODE_ID:string = "5b4a16e800ea79029ca0c395";

export enum ProfilingStateType {
  OFF = 'OFF',
  USER_ID = 'USER_ID',
  ATTRIBUTE = 'ATTRIBUTE'
}

@Injectable()
export class RimaService {
  activeUser:KNode = null;

  ProfilingStateTypeNames:string[] = [
    'OFF',
    'USER_ID',
    'ATTRIBUTE'
  ];

  currentAttributeIndex:number =  0;

  profilingState: ProfilingStateType = ProfilingStateType.OFF;

  constructor(
    // private colabowareRFIDService: ColabowareRFIDService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmittersArrayService
  ) {


    //getting data for the user:
    //this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.coLaboWareProvidedData.bind(this));
  }

  createNewNodeWithEdge(newNode:KNode, newEdge:KEdge, parentNodeId:string, listener){
    newNode.iAmId = "556760847125996dc1a4a24f";
    newNode.visual = {};
    newEdge.iAmId = "556760847125996dc1a4a24f";
    newEdge.visual = {};

    //TODO: iAmId, createdAt, updatedAt
    this.knalledgeNodeService.create(newNode)
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
