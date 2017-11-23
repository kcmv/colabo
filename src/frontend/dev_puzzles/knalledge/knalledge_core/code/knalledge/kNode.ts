declare var window:Window;
declare var knalledge:any;
declare var global:any;
declare var module:any;

// node support (import)
knalledge = (typeof global !== 'undefined' && global['knalledge']) || (typeof window !== 'undefined' && window['knalledge']);

/**
 * @classdesc VKNode is data representation of the knowledge (KnAllEdge) node.
 * It is stored on the server and it connects with other nodes through edges
 * represented with kEdges
 * @class KNode
 * @memberof knalledge
 */

export class KNode {
  static MaxId = 0;
  static STATE_LOCAL = "STATE_LOCAL"; // object is created locally and is still not created on server, so its _id is just local
  static STATE_NON_SYNCED = "STATE_NON_SYNCED"; // object is created already on server but is in meantime updated, so it is not synced
  static STATE_SYNCED = "STATE_SYNCED"; //all object's changes are synced on server

  static TYPE_KNOWLEDGE = "type_knowledge";
  static TYPE_IBIS_QUESTION = "type_ibis_question";
  static TYPE_IBIS_IDEA = "type_ibis_idea";
  static TYPE_IBIS_ARGUMENT = "type_ibis_argument";
  static TYPE_IBIS_COMMENT = "type_ibis_comment";

  static UPDATE_TYPE_ALL = 'UPDATE_NODE_TYPE_ALL';
  static UPDATE_TYPE_IMAGE = 'UPDATE_NODE_TYPE_IMAGE';
  static UPDATE_TYPE_VOTE = 'UPDATE_NODE_TYPE_VOTE';
  static UPDATE_TYPE_WHAT = 'UPDATE_NODE_TYPE_WHAT';
  //static UPDATE_TYPE_VISUAL = 'UPDATE_TYPE_VISUAL';
  static DATA_CONTENT_RIMA_WHATS_ADDING = "DATA_CONTENT_RIMA_WHATS_ADDING";
  static DATA_CONTENT_RIMA_WHATS_DELETING = "DATA_CONTENT_RIMA_WHATS_DELETING";
  static CREATE_TYPE = 'CREATE_NODE_TYPE';

	_id:string = "" + (KNode.MaxId++); //TODO: maxId logic should be migrated here. Unique id. Here it is locally set, but is overriden by unique value, when object is saved in DB
	name:string = ""; //name that is displayed, when node is visualized
	type:string = KNode.TYPE_KNOWLEDGE; //type of the object, responding to one of the KNode.TYPE_... constants
	mapId:string = null; // id of map this object belongs to
	iAmId:string = "" + 0; //id of object creator (whoAmi/RIMA user)
	version = 1; //each object can have several versions, so after creating new verisons, old are saved for auditing
	activeVersion = 1; //saying which version of this object is active
	ideaId = 0;
	//status = ; //
	isPublic:boolean = true; //is the object public or visible/accessible only to the author
	createdAt = null; //when the object is created
	updatedAt = null; //when the obect is updated
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

	/* THIS PROPERTY IS local-to-frontend */
	state:string = KNode.STATE_LOCAL; //state of the object, responding to some of the KNode.STATE_... constants

  init() {

  }

  getId():string {
  	return this._id;
  }

  static nodeFactory(obj:any):KNode {
  	var kNode = new KNode();
  	kNode.fill(obj);
  	return kNode;
  }

  isIbis():boolean{
  	return this.type == KNode.TYPE_IBIS_QUESTION || this.type == KNode.TYPE_IBIS_IDEA || this.type == KNode.TYPE_IBIS_ARGUMENT || this.type == KNode.TYPE_IBIS_COMMENT;
  }

  fill(obj):void {
  	if (obj) {
  		if ("_id" in obj) {
  			this._id = obj._id;
  		}
  		if ("name" in obj) {
  			this.name = obj.name;
  		}
  		if ("type" in obj) {
  			this.type = obj.type;
  		}
  		if ("mapId" in obj) {
  			this.mapId = obj.mapId;
  		}
  		if ("iAmId" in obj) {
  			this.iAmId = obj.iAmId;
  		}
  		if ("activeVersion" in obj) {
  			this.activeVersion = obj.activeVersion;
  		}
  		if ("ideaId" in obj) {
  			this.ideaId = obj.ideaId;
  		}
  		if ("version" in obj) {
  			this.version = obj.version;
  		}
  		if ("isPublic" in obj) {
  			this.isPublic = obj.isPublic;
  		}
  		if ("createdAt" in obj) {
  			this.createdAt = new Date(obj.createdAt);
  		}
  		if ("updatedAt" in obj) {
  			this.updatedAt = new Date(obj.updatedAt);
  		}
  		if ("dataContent" in obj) {
  			this.dataContent = obj.dataContent;
  		} //TODO: deep copy?
  		if ("decorations" in obj) {
  			this.decorations = obj.decorations;
  		} //TODO: deep copy?
  		if ("up" in obj) {
  			this.up = obj.up;
  		} //TODO: deep copy?
  		if ("visual" in obj) {
  			if (!('visual' in this)) this.visual = {};

  			if ("isOpen" in obj.visual) {
  				this.visual.isOpen = obj.visual.isOpen;
  			}
  			if ("xM" in obj.visual) {
  				this.visual.xM = obj.visual.xM;
  			}
  			if ("yM" in obj.visual) {
  				this.visual.yM = obj.visual.yM;
  			}
  			if ("widthM" in obj.visual) {
  				this.visual.widthM = obj.visual.widthM;
  			}
  			if ("heightM" in obj.visual) {
  				this.visual.heightM = obj.visual.heightM;
  			}
  		}
  	}
  }

  /** when object is updated on server we override local object by server version using this function **/
  overrideFromServer(obj):void {
  	if (obj) {
  		if ("_id" in obj) {
  			this._id = obj._id;
  		}
  		if ("createdAt" in obj) {
  			this.createdAt = new Date(obj.createdAt);
  		}
  		if ("updatedAt" in obj) {
  			this.updatedAt = new Date(obj.updatedAt);
  		}
  	}
  	this.state = KNode.STATE_SYNCED;
  }

  /** before sending to object to server we clean it and fix it for server **/
  toServerCopy():any {
  	var kNode:any = {};

  	// TODO: fix cloning
  	var whats = null;
  	if (this.dataContent && this.dataContent.rima && this.dataContent.rima.whats) {
  		var whats = this.dataContent.rima.whats;
  		this.dataContent.rima.whats = [];
  	}
  	/* copying all non-system and non-function properties */
    var id;
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
  		var whatsNew = [];
  		/* copying all non-system and non-function properties */
  		for (var wI in whats) {
  			var what = whats[wI];
  			var whatNew = {};
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

  	/* deleting properties that should be set created to default value on server */
  	if (kNode.createdAt === undefined || kNode.createdAt === null) {
  		delete kNode.createdAt;
  	}
  	if (kNode.updatedAt === undefined || kNode.updatedAt === null) {
  		delete kNode.updatedAt;
  	}

  	if (kNode.state == KNode.STATE_LOCAL) {
  		delete kNode._id;
  	}

  	/* deleting local-frontend parameters */
  	delete kNode.state;

  	return kNode;
  }
}

var KNodeClass = knalledge.KNode = KNode;

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
