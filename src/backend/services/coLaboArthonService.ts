declare var require: any;

import {KNode} from './kNode';
import {KEdge} from './kEdge';
import {Messages} from './messages';
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

  saveParticipant(name:string, occupation:string, phoneNo:string, callback:Function = null):void{
    var newUser = {
      name: name,
    	isPublic: true,
    	dataContent: {
        occupation: occupation,
        phoneNo: phoneNo
      }
    }

    this.rimaService.createNewUser(newUser, callback);
  }

  saveReply(referenceHumanId:number, reply:string, phoneNo:string, callback:Function = null):void{
    let msg:string = null;
    var newData = {
      name: reply, //TODO: check if we want to put just a substring in the name and the rest in the 'dataContent'
      isPublic: true,
      iAmId: null,
      dataContent: {
        // background: background
      }
    }
    var user:KNode = null;
    var referenceNode:KNode = null;
    this.rimaService.getUserByPhoneNo(phoneNo, userFound.bind(this));

    function replyAdded(reply:KNode,err:any):void{
      if(reply === null){
        callback(null,'ERROR_IN_ADDING');
      }
      else{
        if(msg === null){
          msg = `Thank you for your reply! It's ID is ${reply.dataContent.humanID}`
        }
        callback(msg, null);
      }
    }

    function referenceNodeFound(referenceNodes:KNode[]){
      if(referenceNodes === null ||  referenceNodes.length === 0) {
        //TODO: extract message and translate it
        let msg:string = `Content with the ID ${referenceHumanId}, that you are replying on, is not found`;
        console.warn(msg);
        callback(msg,'REFERENCED_NODE_NOT_FOUND');
      }
      else{
        referenceNode = referenceNodes[0];

        //TODO:
        //console.log(`Found referenceNode  (${referenceHumanId})'${referenceNode.name}' that user {user.name} is replying on`);
        newData.dataContent['replyOnHumanId'] = referenceHumanId;
        this.rimaService.addReply(referenceNode._id, newData, replyAdded.bind(this));
      }
    }

    function userFound(users:KNode[]){
      //console.log('userFound:users',users);
      //console.log('typeof users', typeof users);
      if(users === null ||  users.length === 0) {
         //TODO: extract message and translate it
        msg = Messages.SMS_COLABOARTHON['REPLY_NOT_REGISTERED']['EN'];
         //You should regeister first and then send your reply. Do it by sending SMS in this form: 'REG your_name your_occupation'";
        console.warn(msg);

        //TODO: this causes bug
        // user = new KNode();
        // user.name ='unergistered_user';

        newData.iAmId = null; //still unknown (not registered yet)
        //msg = 'REPLY_BY_NONREGISTERED_USER';//callback(msg,'REPLY_BY_NONREGISTERED_USER');
      }
      else{
        user = users[0];
        newData.iAmId = user._id;
      }
      //console.log('found user:',user);
      //console.log(`Found user ${user.name} that is replying`);
      //callback(msg,'REPLY_BY_NONREGISTERED_USER');
      let referenceNode:KNode = this.rimaService.getNodeByHumanID(referenceHumanId, referenceNodeFound.bind(this));
    }
  }
}
