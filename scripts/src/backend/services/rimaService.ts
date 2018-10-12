// import KNode from './kNodeService.ts';
import {KNode} from './kNode';
import {KEdge} from './kEdge';

import {KNodeService} from '../services/kNodeService';

//export public class CoLaboArthonService {
export class RimaService {
  static TYPE_USER = "rima.user";

  //TODO migrate to CoLaboArthonService:
  static TYPE_COLABOARTHON_CONTENT = "clathon.content";
  static TYPE_COLABOARTHON_CONTENT_PROMPT = "clathon.content.prompt";
  static TYPE_COLABOARTHON_CONTENT_REPLY = "clathon.content.reply";

  protected kNodeService:KNodeService;
  constructor(private MAP_ID:string, private AUTHOR_ID:string){
    this.kNodeService = new KNodeService();
  }

  createNewUser(newUserData:any, callback:Function=null):string{
    console.log("[createNewUser] newUserData: ", newUserData);
  	newUserData.type = RimaService.TYPE_USER;
  	newUserData.mapId = this.MAP_ID;
  	newUserData.iAmId = this.AUTHOR_ID;

    var result = this.kNodeService.createNewNode(newUserData, callback);
    return "RimaService:"+result;

    // function newUserCreated(newUser:KNode, newUserEdge:KEdge){
    //   this.users.push(newUser);
    //   if(callback) callback(newUser, newUserEdge);
    // }
  }

  //TODO migrate to CoLaboArthonService:
  addReply(referenceId:string, newData:any, callback:Function=null):void{
    console.log("[addReply] newData: ", newData);
  	newData.type = RimaService.TYPE_COLABOARTHON_CONTENT_REPLY;
  	newData.mapId = this.MAP_ID;
    newData.dataContent['replyOnId'] = referenceId;

    //TODO create an EDGE and connect its source to the referenceId-node and target to this newData-node
    this.kNodeService.createNewNode(newData, callback);

    // function newNodeCreated(newUser:KNode, newUserEdge:KEdge){
    //   this.users.push(newUser);
    //   if(callback) callback(newUser, newUserEdge);
    // }
  }

  getNodeByHumanID(humanID:number, callback:Function=null):any{
    return this.kNodeService.findByDataContent('humanID', humanID, callback);
  }

  getUserByPhoneNo(phoneNo:string, callback:Function=null):any{
    //TODO filter by type === TYPE_USER
    return this.kNodeService.findByDataContent('phoneNo', phoneNo, callback);
  }

  getReplyByPhoneNo(phoneNo:string, callback:Function=null):any{
    return this.kNodeService.findByDataContent('phoneNo', phoneNo, callback);
  }

  // findMaxVal(name:string, callback:Function=null):void{
  //   this.kNodeService.findMaxVal(name, callback);
  // }
}
