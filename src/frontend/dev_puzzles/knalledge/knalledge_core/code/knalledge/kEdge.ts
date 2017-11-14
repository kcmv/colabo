declare var window:Window;
declare var knalledge:any;
declare var global:any;
declare var module:any;

// node support (import)
var knalledge = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

/**
 * @classdesc KEdge is data representation of the knowledge (KnAllEdge) edge.
 * It is stored on the serverver and it connects other nodes (kNode)
 * @class KEdge
 * @memberof knalledge
 */

export class KEdge{
  static STATE_LOCAL:string = "STATE_LOCAL";
  static STATE_NON_SYNCED:string = "STATE_NON_SYNCED";
  static STATE_SYNCED:string = "STATE_SYNCED";
  static MaxId = 0;

  static TYPE_KNOWLEDGE:string = "type_knowledge";
  static TYPE_IBIS_QUESTION:string = "type_ibis_question";
  static TYPE_IBIS_IDEA:string = "type_ibis_idea";
  static TYPE_IBIS_ARGUMENT:string = "type_ibis_argument";
  static TYPE_IBIS_COMMENT:string = "type_ibis_comment";

	_id:string = "" + (KEdge.MaxId++); //Unique id. Here it is locally set, but is overriden by unique value, when object is saved in DB
	name:string = ""; //name that is displayed, when edge is visualized

	type:string = KEdge.TYPE_KNOWLEDGE; //type of the object, responding to one of the KEdge.TYPE_... constants
	mapId:string = null; // id of map this object belongs to
	iAmId:string = ""+0;	//id of object creator (whoAmi/RIMA user)
	version = 1; //each object can have several versions, so after creating new verisons, old are saved for auditing
	activeVersion = 1; //saying which version of this object is active
	ideaId:string = ""+0;
	isPublic:boolean = true; //is the object public or visible/accessible only to the author
	createdAt = null; //when the object is created
	updatedAt = null; //when the obect is updated
	sourceId = null; // id of the source node this edge is connected to
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

	/* local-to-frontend */
	state:string = KEdge.STATE_LOCAL; //state of the object, responding to some of the KEdge.STATE_... constants

	/*for debugging all moments where this object is created: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
	try {
		throw new Error('myError');
	}
	catch(e) {
	// console.warn((new Error).lineNumber)
		console.warn(this.sid + ':' + e.stack);
	}*/

  //KEdge.S_ID = 0;
  //
  getId():string {
  	return this._id;
  }

  static edgeFactory(obj):KEdge{
  	var kEdge = new knalledge.KEdge();
  	kEdge.fill(obj);
  	return kEdge;
  }

  init(){

  }

  fill(obj:any){
  	if(obj){
  		if("_id" in obj){this._id = obj._id;}
  		if("name" in obj){this.name = obj.name;}
  		if("type" in obj){this.type = obj.type;}
  		if("mapId" in obj){this.mapId = obj.mapId;}
  		if("iAmId" in obj){this.iAmId = obj.iAmId;}
  		if("activeVersion" in obj){this.activeVersion = obj.activeVersion;}
  		if("ideaId" in obj){this.ideaId = obj.ideaId;}
  		if("version" in obj){this.version = obj.version;}
  		if("isPublic" in obj){this.isPublic = obj.isPublic;}
  		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
  		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
  		if("sourceId" in obj){this.sourceId = obj.sourceId;}
  		if("targetId" in obj){this.targetId = obj.targetId;}
  		if("dataContent" in obj){this.dataContent = obj.dataContent;} //TODO: deep copy?
  		if("value" in obj){this.value = obj.value;}
  		if("visual" in obj){this.visual = obj.visual;} // Still Visual is not used so we are not filling it like for kNode
  	}
  }

  /** when object is updated on server we override local object by server version using this function **/
  overrideFromServer(obj:any){
  	if(obj){
  		if("_id" in obj){this._id = obj._id;}
  		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
  		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
  	}
  	this.state = KEdge.STATE_SYNCED;
  }

  /** before sending to object to server we clean it and fix it for server **/
  toServerCopy():any{
  	var kEdge:any = {};

  	/* copying all non-system and non-function properties */
  	for(var id in this){
  		if(id[0] == '$') continue;
  		if (typeof this[id] == 'function') continue;
  		//console.log("cloning: %s", id);
  		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
  			kEdge[id] = (JSON.parse(JSON.stringify(this[id])));
  		}
  	}

  	/* deleting properties that should be set to default value on server */
  	if(kEdge.createdAt === undefined || kEdge.createdAt === null) {delete kEdge.createdAt;}
  	if(kEdge.updatedAt === undefined || kEdge.updatedAt === null) {delete kEdge.updatedAt;}

  	if(kEdge.state == KEdge.STATE_LOCAL){
  		delete kEdge._id;
  	}

  	/* deleting local-frontend parameters */
  	delete kEdge.state;

  	return kEdge;
  }
}
var KEdgeClass =  knalledge.KEdge = KEdge;
// node support (export)
if (typeof module !== 'undefined'){
  // workarround for TypeScript's `module.exports` readonly
  if('exports' in module){
    if (typeof module.exports !== 'undefined'){
      module.exports.KEdge = KEdge;
    }
  }else{
    module.exports = KEdge;
  }
}
