import {KNode} from './kNode';
import {KEdge} from './kEdge';

//export public class NodeService {
export class NodeService {
  createNewUser(newUserData:any, mapId:string, callback:Function=null){
    console.log("[createNewUser] newUserData: ", newUserData);

    //this should be migrated to the CoLaboArthonService - NodeService shouldn't know about some specific users of the app
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

}
