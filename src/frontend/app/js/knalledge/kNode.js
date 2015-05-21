(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var KNode =  knalledge.KNode = function(){
	this._id = KNode.MaxId++; //TODO: maxId logic should be migrated here
	this.name = "";
	this.type = null;
	this.mapId = null;	
	this.iAmId = 0;
	this.activeVersion = 1;
	this.ideaId = 0;
	this.version = 1;
	this.isPublic = true;
	this.createdAt = null;
	this.updatedAt = null;
	// this.dataContent = null;
	// this.visual = {
	// 		isOpen: false,
	// 		xM: undefined,
	// 		yM: undefined,
	// 		widthM: undefined,
	// 		heightM: undefined
	// };
	
	/* local-to-frontend */
	this.state = KNode.STATE_LOCAL;
};

KNode.MaxId = 0;
KNode.STATE_LOCAL = "STATE_LOCAL";
KNode.STATE_NON_SYNCED = "STATE_NON_SYNCED";
KNode.STATE_SYNCED = "STATE_SYNCED";

KNode.TYPE_KNOWLEDGE = "type_knowledge";
KNode.TYPE_IBIS_QUESTION = "type_ibis_question";
KNode.TYPE_IBIS_IDEA = "type_ibis_idea";
KNode.TYPE_IBIS_ARGUMENT = "type_ibis_argument";
KNode.TYPE_IBIS_COMMENT = "type_ibis_comment";

KNode.prototype.init = function(){
	
};

KNode.nodeFactory = function(obj){
	var kNode = new knalledge.KNode();
	kNode.fill(obj);
	return kNode;
};

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

KNode.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = KNode.STATE_SYNCED;
};

KNode.prototype.toServerCopy = function(){
	var kNode = {};
	
	/* copying all non-system and non-function properties */
	for(var id in this){
		if(id[0] == '$') continue;
		if (typeof this[id] == 'function') continue;
		//console.log("cloning: %s", id);
		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
			kNode[id] = (JSON.parse(JSON.stringify(this[id])));
		}
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

}()); // end of 'use strict';