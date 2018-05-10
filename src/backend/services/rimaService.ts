// import KNode from './kNodeService.ts';
import {KNode} from './kNode';
import {KEdge} from './kEdge';

import {KNodeService} from '../services/kNodeService';

//export public class CoLaboArthonService {
export class RimaService {
  protected kNodeService:KNodeService;
  constructor(private MAP_ID:string){
    this.kNodeService = new KNodeService(this.MAP_ID);
  }

  createNewUser(newUserData:any, callback:Function=null):string{
    console.log("[createNewUser] newUserData: ", newUserData);
    var result = this.kNodeService.createNewNode(newUserData);
    return "RimaService:"+result;

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      this.users.push(newUser);
      if(callback) callback(newUser, newUserEdge);
    }
  }
}
