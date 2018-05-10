declare var require: any;

import {KNode} from './kNode';
import {KEdge} from './kEdge';
// const RimaService = require('../services/rimaService').RimaService;
import {RimaService} from '../services/rimaService';

const MAP_ID:string = "5af39ce82843ddf04b459cb0";

//export public class CoLaboArthonService {
export class CoLaboArthonService {

  //TODO: maxiId
  //TODO create in DB node for replies

  getNodeByHumanID():KNode{
    return null;
  }

  protected rimaService:RimaService;
  constructor(){
    this.rimaService = new RimaService(MAP_ID);
  }

  saveParticipant(name:string, background:string){
    var result = this.rimaService.createNewUser(name+":"+background);
    return "CoLaboArthonService:"+result;
  }
}
