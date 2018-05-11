declare var require: any;

import {KNode} from './kNode';
import {KEdge} from './kEdge';
// const RimaService = require('../services/rimaService').RimaService;
import {RimaService} from '../services/rimaService';

const MAP_ID:string = "5af39ce82843ddf04b459cb0";
const AUTHOR_ID:string = "556760847125996dc1a4a24f";

//export public class CoLaboArthonService {
export class CoLaboArthonService {

  protected rimaService:RimaService;
  constructor(){
    this.rimaService = new RimaService(MAP_ID, AUTHOR_ID);
  }

  saveParticipant(name:string, occupation:string, phoneNo:string, callback:Function = null){
    var newUser = {
      name: name,
    	isPublic: true,
    	dataContent: {
        occupation: occupation,
        phoneNo: phoneNo
      }
    }

    var result = this.rimaService.createNewUser(newUser, callback);
    return "CoLaboArthonService:"+result;
  }

  saveReply(referenceHumanId:number, reply:string, phoneNo:string, callback:Function = null):boolean{
    var newData = {
      name: reply, //TODO: check if we want to put just a substring in the name and the rest in the 'dataContent'
      isPublic: true,
      iAmId: null
      // dataContent: {
      //   background: background
      // }
    }
    var user:KNode = this.rimaService.getUserByPhoneNo(phoneNo, userFound);
    function userFound(user:KNode){
      if(user === null) {
         //TODO: extract message and translate it
        console.warn("CoLaboArthon: You should regeister first and then send your reply. Do it by sending SMS in this form: 'REG your_name your_occupation'");
        callback("CoLaboArthon: You should regeister first and then send your reply. Do it by sending SMS in this form: 'REG your_name your_occupation'",'REPLY_BY_NONREGISTERED_USER');
      }
      newData.iAmId = user.iAmId;
      let referenceNode:KNode = this.rimaService.getNodeByHumanID(referenceHumanId);
      if(referenceNode === null) {return `CoLaboArthon: Content with the ${referenceHumanId}, that you are replying on, is not found`;} //TODO: extract message and translate it
      newData.iAmId = user.iAmId;
      var result = this.rimaService.addReply(referenceNode._id, newData, callback);
      return "CoLaboArthon:"+result;

    }

    return true;
  }
}
