import {KNode} from './kNode';
import {KEdge} from './kEdge';

const MAP_ID:string = "5af39ce82843ddf04b459cb0";

//export public class CoLaboArthonService {
export class CoLaboArthonService {

  //TODO: maxiId
  //TODO create in DB node for replies

  getNodeByHumanID():KNode{
    return null;
  }

  saveParticipant(name:string, background:string){
    //this.createNewUser();
  }

  createNewUser(newUserData:any, MAP_ID, callback:Function=null){
    console.log("[createNewUser] newUserData: ", newUserData);
    this.nodeService.createNewUser(newUserData, newUserCreated.bind(this));

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      this.users.push(newUser);
      if(callback) callback(newUser, newUserEdge);
    }
  }

}
