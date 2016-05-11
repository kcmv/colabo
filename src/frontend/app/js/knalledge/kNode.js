(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

// node support (import)
var knalledge = (typeof global !== 'undefined' && global.knalledge) || (typeof window !== 'undefined' && window.knalledge);

/**
 * @classdesc VKNode is data representation of the knowledge (KnAllEdge) node.
 * It is stored on the server and it connects with other nodes through edges
 * represented with kEdges
 * @class KNode
 * @memberof knalledge
 */

var KNode =  knalledge.KNode = function(){
	this._id = KNode.MaxId++; //TODO: maxId logic should be migrated here. Unique id. Here it is locally set, but is overriden by unique value, when object is saved in DB
	this.name = ""; //name that is displayed, when node is visualized
	this.type = KNode.TYPE_KNOWLEDGE; //type of the object, responding to one of the KNode.TYPE_... constants
	this.mapId = null; // id of map this object belongs to
	this.iAmId = 0;	//id of object creator (whoAmi/RIMA user)
	this.version = 1; //each object can have several versions, so after creating new verisons, old are saved for auditing
	this.activeVersion = 1; //saying which version of this object is active
	this.ideaId = 0;
	this.isPublic = true; //is the object public or visible/accessible only to the author
	this.createdAt = null; //when the object is created
	this.updatedAt = null; //when the obect is updated
	// this.dataContent = null; //additional data is stored in this object
	// this.dataContent.property = null; // value of node content (Additional Info)

	this.decorations = {

	};
	// next higher level of abstraction
	this.up = {
	/*
		Suggested elements:

		_id: undefined,
		name: undefined,
		type: undefined
	*/
	};

	this.visual = {
	//	visual is an object containing aspects of visual representation of the kNode object. VKNode object is related to it.
	//	NOTE: in the future, each user will have its one or more visual representations of kNode, so accordingly this object is going to be migrated to an independent object related to iAmId (user ID)!
	 		isOpen: false, //if object is open, that its children (e.g. in tree) are displayed
	}
	// 		xM: undefined, //manual set x coordinate, set by user
	// 		yM: undefined, //manual set y coordinate, set by user
	// 		widthM: undefined, //manual set width, set by user
	// 		heightM: undefined //manual set height, set by user
	// };

	/* local-to-frontend */
	this.state = KNode.STATE_LOCAL; //state of the object, responding to some of the KNode.STATE_... constants
};

KNode.MaxId = 0;
KNode.STATE_LOCAL = "STATE_LOCAL"; // object is created locally and is still not created on server, so its _id is just local
KNode.STATE_NON_SYNCED = "STATE_NON_SYNCED"; // object is created already on server but is in meantime updated, so it is not synced
KNode.STATE_SYNCED = "STATE_SYNCED"; //all object's changes are synced on server

KNode.TYPE_KNOWLEDGE = "type_knowledge";
KNode.TYPE_IBIS_QUESTION = "type_ibis_question";
KNode.TYPE_IBIS_IDEA = "type_ibis_idea";
KNode.TYPE_IBIS_ARGUMENT = "type_ibis_argument";
KNode.TYPE_IBIS_COMMENT = "type_ibis_comment";

KNode.UPDATE_TYPE_ALL = 'UPDATE_NODE_TYPE_ALL';
KNode.UPDATE_TYPE_IMAGE = 'UPDATE_NODE_TYPE_IMAGE';
KNode.UPDATE_TYPE_VOTE = 'UPDATE_NODE_TYPE_VOTE';
KNode.UPDATE_TYPE_WHAT = 'UPDATE_NODE_TYPE_WHAT';
KNode.CREATE_TYPE = 'CREATE_NODE_TYPE';

KNode.prototype.init = function(){

};

KNode.nodeFactory = function(obj){
	var kNode = new knalledge.KNode();
	kNode.fill(obj);
	return kNode;
};

KNode.prototype.isIbis = function(){
	return this.type == KNode.TYPE_IBIS_QUESTION || this.type == KNode.TYPE_IBIS_IDEA || this.type == KNode.TYPE_IBIS_ARGUMENT || this.type == KNode.TYPE_IBIS_COMMENT;
}

KNode.prototype.fill = function(obj){
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
		if("dataContent" in obj){this.dataContent = obj.dataContent;} //TODO: deep copy?
		if("decorations" in obj){this.decorations = obj.decorations;} //TODO: deep copy?
		if("visual" in obj){
			if(!('visual' in this)) this.visual = {};

			if("isOpen" in obj.visual){this.visual.isOpen = obj.visual.isOpen;}
			if("xM" in obj.visual){this.visual.xM = obj.visual.xM;}
			if("yM" in obj.visual){this.visual.yM = obj.visual.yM;}
			if("widthM" in obj.visual){this.visual.widthM = obj.visual.widthM;}
			if("heightM" in obj.visual){this.visual.heightM = obj.visual.heightM;}
		}
	}
};


/** when object is updated on server we override local object by server version using this function **/
KNode.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = KNode.STATE_SYNCED;
};

/** before sending to object to server we clean it and fix it for server **/
KNode.prototype.toServerCopy = function(){
	var kNode = {};

	// TODO: fix cloning
	var whats = null;
	if(this.dataContent && this.dataContent.rima && this.dataContent.rima.whats){
		var whats = this.dataContent.rima.whats;
		this.dataContent.rima.whats = [];
	}
	/* copying all non-system and non-function properties */
	for(var id in this){
		if(id[0] === '$') continue;
		if(id === 'parents') continue;
		if(id === 'children') continue;
		if (typeof this[id] == 'function') continue;
		//console.log("cloning: %s", id);
		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
			kNode[id] = (JSON.parse(JSON.stringify(this[id])));
		}
	}
	if(whats){
		var whatsNew = [];
		/* copying all non-system and non-function properties */
		for(var wI in whats){
			var what = whats[wI];
			var whatNew = {};
			whatsNew.push(whatNew);
			for(var id in what){
				if(id[0] == '$') continue;
				if (typeof what[id] == 'function') continue;
				//console.log("cloning: %s", id);
				whatNew[id] = (JSON.parse(JSON.stringify(what[id])));
			}
		}
		this.dataContent.rima.whats = whats;
		kNode.dataContent.rima.whats = whatsNew;
	}

	/* deleting properties that should be set created to default value on server */
	if(kNode.createdAt === undefined || kNode.createdAt === null) {delete kNode.createdAt;}
	if(kNode.updatedAt === undefined || kNode.updatedAt === null) {delete kNode.updatedAt;}

	if(kNode.state == KNode.STATE_LOCAL){
		delete kNode._id;
	}

	/* deleting local-frontend parameters */
	delete kNode.state;

	return kNode;
};

// node support (export)
if (typeof module !== 'undefined') module.exports = KNode;

}()); // end of 'use strict';
