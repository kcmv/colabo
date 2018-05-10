// import KNode from './kNodeService.ts';
import {KNode} from './kNode';
import {KEdge} from './kEdge';

import {KNodeService} from '../services/kNodeService';

//export public class CoLaboArthonService {
export class RimaService {
  static TYPE_USER = "rima.user";

  protected kNodeService:KNodeService;
  constructor(private MAP_ID:string, private AUTHOR_ID:string){
    this.kNodeService = new KNodeService();
  }

  createNewUser(newUserData:any, callback:Function=null):string{
    console.log("[createNewUser] newUserData: ", newUserData);
  	newUserData.type = RimaService.TYPE_USER;
  	newUserData.mapId = this.MAP_ID;
  	newUserData.iAmId = this.AUTHOR_ID;

    var result = this.kNodeService.createNewNode(newUserData);
    return "RimaService:"+result;

    function newUserCreated(newUser:KNode, newUserEdge:KEdge){
      this.users.push(newUser);
      if(callback) callback(newUser, newUserEdge);
    }
  }
}
