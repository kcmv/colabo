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

  saveParticipant(name:string, background:string){
    var newUser = {
      name: name,
    	isPublic: true,
    	dataContent: {
        background: background
      }
    }

    var result = this.rimaService.createNewUser(newUser);
    return "CoLaboArthonService:"+result;
  }
}
