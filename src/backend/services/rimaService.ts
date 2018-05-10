// import KNode from './nodeService.ts';
import {KNode} from './kNode';
import {KEdge} from './kEdge';

//export public class CoLaboArthonService {
export class RimaService {

  constructor(private MAP_ID:string){
  }

  createNewUser(newUserData:any, callback:Function=null):string{
    console.log("[createNewUser] newUserData: ", newUserData);
    return "RimaService:"+newUserData;
    // this.nodeService.createNewUser(newUserData, newUserCreated.bind(this));

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      this.users.push(newUser);
      if(callback) callback(newUser, newUserEdge);
    }
  }
}
