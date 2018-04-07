import { VO } from './VO';

declare let window:Window;
declare let knalledge:any;
declare let global:any;
declare let module:any;

// node support (import)
knalledge = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

/**
 * @classdesc VKNode is data representation of the knowledge (KnAllEdge) node.
 * It is stored on the server and it connects with other nodes through edges
 * represented with kEdges
 * @class KNode
 * @memberof knalledge
 */

export class KNode extends VO {
  static TYPE_KNOWLEDGE = "type_knowledge";
  static TYPE_IBIS_QUESTION = "type_ibis_question";
  static TYPE_IBIS_IDEA = "type_ibis_idea";
  static TYPE_IBIS_ARGUMENT = "type_ibis_argument";
  static TYPE_IBIS_COMMENT = "type_ibis_comment";
  static TYPE_USER = "type_user";

  static UPDATE_TYPE_ALL = 'UPDATE_NODE_TYPE_ALL';
  static UPDATE_TYPE_IMAGE = 'UPDATE_NODE_TYPE_IMAGE';
  static UPDATE_TYPE_VOTE = 'UPDATE_NODE_TYPE_VOTE';
  static UPDATE_TYPE_WHAT = 'UPDATE_NODE_TYPE_WHAT';
  //static UPDATE_TYPE_VISUAL = 'UPDATE_TYPE_VISUAL';
  static DATA_CONTENT_RIMA_WHATS_ADDING = "DATA_CONTENT_RIMA_WHATS_ADDING";
  static DATA_CONTENT_RIMA_WHATS_DELETING = "DATA_CONTENT_RIMA_WHATS_DELETING";
  static CREATE_TYPE = 'CREATE_NODE_TYPE';

	mapId:string = null; // id of map this object belongs to
	// TODO:ng2 TS needs dataContent declared,
  // we should check if this makes dataContent ending up
  // at the server even when is it empty
	dataContent:any = null; //additional data is stored in this object
	// dataContent.property = null; // value of node content (Additional Info)

	decorations:any = {

	};
	// next higher level of abstraction
	up:any = {
		/*
			Suggested elements:

			_id: undefined,
			name: undefined,
			type: undefined
		*/
	};

	visual:any = {
			//	visual is an object containing aspects of visual representation of the kNode object. VKNode object is related to it.
			//	NOTE: in the future, each user will have its one or more visual representations of kNode, so accordingly this object is going to be migrated to an independent object related to iAmId (user ID)!
			isOpen: false, //if object is open, that its children (e.g. in tree) are displayed
		}
		// 		xM: undefined, //manual set x coordinate, set by user
		// 		yM: undefined, //manual set y coordinate, set by user
		// 		widthM: undefined, //manual set width, set by user
		// 		heightM: undefined //manual set height, set by user
		// };

  constructor() {
    super();
    this.init();
  }

  init():void {
    super.init();
    this.type = KNode.TYPE_KNOWLEDGE; //type of the object, responding to one of the KNode.TYPE_... constants
  }

  static nodeFactory(obj:any):KNode { //TODO:remove - kept only for legacy of the old code
  	return KNode.factory(obj);
  }

  static factory(obj:any):KNode {
    return VO.VOfactory<KNode>(obj, KNode);
  }

  // static factory(obj:any):KNode {
  // 	let kNode:KNode = new KNode();
  // 	kNode.fill(obj);
  // 	return kNode;
  // }

  isIbis():boolean{
  	return this.type == KNode.TYPE_IBIS_QUESTION || this.type == KNode.TYPE_IBIS_IDEA || this.type == KNode.TYPE_IBIS_ARGUMENT || this.type == KNode.TYPE_IBIS_COMMENT;
  }

  fill(obj:any):void {
  	if (obj) {
      super.fill(obj);
      if ("mapId" in obj) { this.mapId = obj.mapId; }
  		if ("dataContent" in obj) { this.dataContent = obj.dataContent; } //TODO: deep copy?
  		if ("decorations" in obj) { this.decorations = obj.decorations; } //TODO: deep copy?
  		if ("up" in obj) { this.up = obj.up; } //TODO: deep copy?
  		if ("visual" in obj) {
        if (!('visual' in this)) this.visual = {};
    		if ("isOpen" in obj.visual) { 	this.visual.isOpen = obj.visual.isOpen; }
    		if ("xM" in obj.visual) { 	this.visual.xM = obj.visual.xM; }
    		if ("yM" in obj.visual) { 	this.visual.yM = obj.visual.yM; }
    		if ("widthM" in obj.visual) { 	this.visual.widthM = obj.visual.widthM; }
    		if ("heightM" in obj.visual) { 	this.visual.heightM = obj.visual.heightM; }
  		}
  	}
  }

  //TODO: refactor to the VO - like we've done in Edge and Map VOs
  toServerCopy():any {
  	let kNode:any = super.toServerCopy();

  	// TODO: fix cloning
  	let whats = null;
  	if (this.dataContent && this.dataContent.rima && this.dataContent.rima.whats) {
  		let whats = this.dataContent.rima.whats;
  		this.dataContent.rima.whats = [];
  	}
  	/* copying all non-system and non-function properties */
    let id;
  	for (id in this) {
  		if (id[0] === '$') continue;
  		if (id === 'parents' || id === 'children') continue;
  		if (id === 'parentsLinks' || id === 'childrenLinks' || id === 'tree' || id === 'what' || id === 'user') continue; //Ontov local objects
  		if (typeof this[id] == 'function') continue;
  		//console.log("cloning: %s", id);
  		if (this[id] !== undefined) { //JSON.parse breaks at "undefined"
  			kNode[id] = (JSON.parse(JSON.stringify(this[id])));
  		}
  	}
  	if (whats) {
  		let whatsNew = [];
  		/* copying all non-system and non-function properties */
  		for (let wI in whats) {
  			let what = whats[wI];
  			let whatNew = {};
  			whatsNew.push(whatNew);
  			for (id in what) {
  				if (id[0] == '$') continue;
  				if (typeof what[id] == 'function') continue;
  				//console.log("cloning: %s", id);
  				whatNew[id] = (JSON.parse(JSON.stringify(what[id])));
  			}
  		}
  		this.dataContent.rima.whats = whats;
  		kNode.dataContent.rima.whats = whatsNew;
  	}

    //TODO:NG2: done in super(), but overriden in the current method
  	/* deleting properties that should be set created to default value on server */
  	if (kNode.createdAt === undefined || kNode.createdAt === null) {
  		delete kNode.createdAt;
  	}
  	if (kNode.updatedAt === undefined || kNode.updatedAt === null) {
  		delete kNode.updatedAt;
  	}

  	if (kNode.state == VO.STATE_LOCAL) {
  		delete kNode._id;
  	}

  	/* deleting local-frontend parameters */
  	delete kNode.state;

  	return kNode;
  }
}

let KNodeClass = knalledge.KNode = KNode;

// node support (export)
if (typeof module !== 'undefined'){
  // workarround for TypeScript's `module.exports` readonly
  if('exports' in module){
    if (typeof module['exports'] !== 'undefined'){
      module['exports'].KNode = KNode;
    }
  }else{
    module['exports'] = KNode;
  }
}
