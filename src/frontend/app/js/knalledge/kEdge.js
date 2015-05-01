(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var KEdge =  knalledge.KEdge = function(){
	this._id = KEdge.MaxId++;
	this.name = "";//TODO: "name..."
	this.type = null;
	this.mapId = null;	
	this.iAmId = 0;
	this.type = ""; //TODO: a default type should be assigned
	this.activeVersion = 1;
	this.ideaId = 0;
	this.version = 1;
	this.isPublic = true;
	this.createdAt = null;
	this.updatedAt = null;
	this.sourceId = null;
	this.targetId = null;
	this.dataContent = null;
	this.visual = null;
	//this.sid = ++KEdge.S_ID;
	
	/* local-to-frontend */
	this.state = KEdge.STATE_LOCAL;
	
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
		if("type" in obj){this.type = obj.type;}
		if("activeVersion" in obj){this.activeVersion = obj.activeVersion;}
		if("ideaId" in obj){this.ideaId = obj.ideaId;}
		if("version" in obj){this.version = obj.version;}
		if("isPublic" in obj){this.isPublic = obj.isPublic;}
		if("createdAt" in obj){this.createdAt = obj.createdAt;} //TODO: converto to Date nativ type
		if("updatedAt" in obj){this.updatedAt = obj.updatedAt;}//TODO: converto to Date nativ type
		if("sourceId" in obj){this.sourceId = obj.sourceId;}
		if("targetId" in obj){this.targetId = obj.targetId;}
		if("dataContent" in obj){this.dataContent = obj.dataContent;} //TODO: deep copy?
		if("visual" in obj){this.visual = obj.visual;} // Still Visual is not used so we are not filling it like for kNode
	}
};

KEdge.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = obj.createdAt;} //TODO: converto to Date nativ type
		if("updatedAt" in obj){this.updatedAt = obj.updatedAt;}//TODO: converto to Date nativ type
	}
	this.state = KEdge.STATE_SYNCED;
};

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

}()); // end of 'use strict';