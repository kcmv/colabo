import {KNode} from './kNode';
import {KEdge} from './kEdge';

import * as KNodeModule from '../modules/kNode';

//export public class KNodeService {
export class KNodeService {
  constructor(){
  }

  createNewNode(newUserData:any, callback:Function=null):string{
    console.log("KNodeModule: ", KNodeModule);
    //TODO shouldn't newUserData be 'translated' into server format or cleaned at least?
    KNodeModule._create(newUserData, callback);
    return "KNodeService:"+newUserData;
  }

  findByDataContent(name:string, value:any, callback:Function=null):boolean{
    KNodeModule._index(name, value, 'in_content_data', callback);
    return true;
  }

  /*
  createNewUser(newUserData:any, mapId:string, callback:Function=null){
    console.log("[createNewUser] newUserData: ", newUserData);

    //this should be migrated to the CoLaboArthonService - KNodeService shouldn't know about some specific users of the app
    let usersNode = this.getFirstNodeForType(KNode.TYPE_USERS);
    console.log("usersNode:", usersNode);

    // creating new user node
    let userNode:KNode = new KNode();
    userNode.mapId = mapId;
    userNode.name = newUserData.name;
    userNode.type = KNode.TYPE_USER;
    // later to access the RFID value you would need to do:
    // let rfid = userNode.dataContent.coLaboWareData.value;
    userNode.dataContent = {
      coLaboWareData: newUserData.coLaboWareData,
      image: {
        url: newUserData.image.url
        // width: image.width,
        // height: image.height
      }
    }

    // creating edge between new user and users node (with type KNode.TYPE_USERS)
    let userEdge:KEdge = new KEdge();
    userEdge.mapId = mapId;
    userEdge.name = "User";
    userEdge.type = KEdge.TYPE_USER;

    this.createNewNodeWithEdge(userNode, userEdge, usersNode._id, callback);
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
      this.nodes.push(newNode);

      newEdge.sourceId = parentNodeId;
      newEdge.targetId = newNode._id;
      //TODO: iAmId, createdAt, updatedAt
      this.knalledgeEdgeService.create(newEdge)
      .subscribe(newEdgeCreated.bind(this));

      // callback after an edge to the new node is created
      function newEdgeCreated(newEdge:KEdge):void{
        console.log('newEdgeCreated', newEdge);
        listener(newNode, newEdge);
        this.edges.push(newEdge);
      }
    }
  }
*/
}
