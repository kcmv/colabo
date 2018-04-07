declare let window:Window;
declare let knalledge:any;
declare let global:any;
declare let module:any;

// node support (import)
knalledge = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

import { VO } from './VO';

/**
 * @classdesc KEdge is data representation of the knowledge (KnAllEdge) edge.
 * It is stored on the serverver and it connects other nodes (kNode)
 * @class KEdge
 * @memberof knalledge
 */

export class KEdge extends VO{
  static TYPE_KNOWLEDGE:string = "type_knowledge";
  static TYPE_IBIS_QUESTION:string = "type_ibis_question";
  static TYPE_IBIS_IDEA:string = "type_ibis_idea";
  static TYPE_IBIS_ARGUMENT:string = "type_ibis_argument";
  static TYPE_IBIS_COMMENT:string = "type_ibis_comment";
  static TYPE_USERS = "type_users";
  static TYPE_USER = "type_user";

	mapId:string = null; // id of map this object belongs to
	sourceId:string = null; // id of the source node this edge is connected to
	targetId:string = null; // id of the target node this edge is connected to
	dataContent:string = null; //additional data is stored in this object
	value:any = 0; //value assigned to the edge

	// next higher level of abstraction
	up:any = {
	/*
		Suggested elements:

		_id: undefined,
		name: undefined,
		type: undefined,
		sourceId: undefined,
		targetId: undefined
	*/
	};

	visual:any = null; //	visual is an object containing aspects of visual representation of the kNode object. VKNode object is related to it.
	//	NOTE: in the future, each user will have its one or more visual representations of kNode, so accordingly this object is going to be migrated to an independent object related to iAmId (user ID)!

	//sid = ++KEdge.S_ID;

	/*for debugging all moments where this object is created: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
	try {
		throw new Error('myError');
	}
	catch(e) {
	// console.warn((new Error).lineNumber)
		console.warn(this.sid + ':' + e.stack);
	}*/

  constructor() {
    super();
    this.init();
  }

  init():void {
    super.init();
    this.isPublic = false;
    this.type = KEdge.TYPE_KNOWLEDGE; //type of the object, responding to one of the KEdge.TYPE_... constants

  }

  static edgeFactory(obj):KEdge{
  	return KEdge.factory(obj);
  }

  static factory(obj:any):KEdge {
    return VO.VOfactory<KEdge>(obj, KEdge);
  }

  fill(obj:any){
  	if(obj){
      super.fill(obj);
  		if("mapId" in obj){this.mapId = obj.mapId;}
  		if("sourceId" in obj){this.sourceId = obj.sourceId;}
  		if("targetId" in obj){this.targetId = obj.targetId;}
  		if("dataContent" in obj){this.dataContent = obj.dataContent;} //TODO: deep copy?
  		if("value" in obj){this.value = obj.value;}
  		if("visual" in obj){this.visual = obj.visual;} // Still Visual is not used so we are not filling it like for kNode
  	}
  }

}

let KEdgeClass =  knalledge.KEdge = KEdge;
// node support (export)
if (typeof module !== 'undefined'){
  // workarround for TypeScript's `module.exports` readonly
  if('exports' in module){
    if (typeof module['exports'] !== 'undefined'){
      module['exports'].KEdge = KEdge;
    }
  }else{
    module['exports'] = KEdge;
  }
}
