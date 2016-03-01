(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

// node support (import)
var knalledge = (typeof global !== 'undefined' && global.knalledge) || (typeof window !== 'undefined' && window.knalledge);

var KEdge =  knalledge.KEdge = function(){
	this._id = KEdge.MaxId++; //Unique id. Here it is locally set, but is overriden by unique value, when object is saved in DB
	this.name = ""; //name that is displayed, when edge is visualized

	this.type = KEdge.TYPE_KNOWLEDGE; //type of the object, responding to one of the KEdge.TYPE_... constants
	this.mapId = null; // id of map this object belongs to
	this.iAmId = 0;	//id of object creator (whoAmi/RIMA user)
	this.version = 1; //each object can have several versions, so after creating new verisons, old are saved for auditing
	this.activeVersion = 1; //saying which version of this object is active
	this.ideaId = 0;
	this.isPublic = true; //is the object public or visible/accessible only to the author
	this.createdAt = null; //when the object is created
	this.updatedAt = null; //when the obect is updated
	this.sourceId = null; // id of the source node this edge is connected to
	this.targetId = null; // id of the target node this edge is connected to
	this.dataContent = null; //additional data is stored in this object
	this.value = 0; //value assigned to the edge

	// next higher level of abstraction
	this.up = {
	/*
		Suggested elements:

		_id: undefined,
		name: undefined,
		type: undefined,
		sourceId: undefined,
		targetId: undefined
	*/
	};

	this.visual = null; //	visual is an object containing aspects of visual representation of the kNode object. VKNode object is related to it.
	//	NOTE: in the future, each user will have its one or more visual representations of kNode, so accordingly this object is going to be migrated to an independent object related to iAmId (user ID)!

	//this.sid = ++KEdge.S_ID;

	/* local-to-frontend */
	this.state = KEdge.STATE_LOCAL; //state of the object, responding to some of the KEdge.STATE_... constants

	/*for debugging all moments where this object is created: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
	try {
		throw new Error('myError');
	}
	catch(e) {
	// console.warn((new Error).lineNumber)
		console.warn(this.sid + ':' + e.stack);
	}*/
};

KEdge.STATE_LOCAL = "STATE_LOCAL";
KEdge.STATE_NON_SYNCED = "STATE_NON_SYNCED";
KEdge.STATE_SYNCED = "STATE_SYNCED";
KEdge.MaxId = 0;

KEdge.TYPE_KNOWLEDGE = "type_knowledge";
KEdge.TYPE_IBIS_QUESTION = "type_ibis_question";
KEdge.TYPE_IBIS_IDEA = "type_ibis_idea";
KEdge.TYPE_IBIS_ARGUMENT = "type_ibis_argument";
KEdge.TYPE_IBIS_COMMENT = "type_ibis_comment";

//KEdge.S_ID = 0;

KEdge.edgeFactory = function(obj){
	var kEdge = new knalledge.KEdge();
	kEdge.fill(obj);
	return kEdge;
};

KEdge.prototype.init = function(){

};

KEdge.prototype.fill = function(obj){
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
};

/** when object is updated on server we override local object by server version using this function **/
KEdge.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = KEdge.STATE_SYNCED;
};

/** before sending to object to server we clean it and fix it for server **/
KEdge.prototype.toServerCopy = function(){
	var kEdge = {};

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
};

// node support (export)
if (typeof module !== 'undefined') module.exports = KEdge;

}()); // end of 'use strict';
