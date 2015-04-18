(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var KEdge =  knalledge.KEdge = function(){
	this._id = 0; //TODO: maxId logic should be migrated here
	this.name = "name...";
	this.mapId = "";	
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
	
	/* local-to-frontend */
	this.state = KEdge.STATE_LOCAL;
};

KEdge.edgeFactory = function(obj){
	var kEdge = new knalledge.KEdge();
	kEdge.fill(obj);
	return kEdge;
};

KEdge.STATE_LOCAL = "STATE_LOCAL";
KEdge.STATE_NON_SYNCED = "STATE_NON_SYNCED";
KEdge.STATE_SYNCED = "STATE_SYNCED";

KEdge.prototype.init = function(){
	
};

KEdge.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("name" in obj){this.name = obj.name;}
		if("mapId" in obj){this.mapId = obj.mapId;}
		if("iAmId" in obj){this.iAmId = obj.iAmId;}
		if("activeVersion" in obj){this.activeVersion = obj.activeVersion;}
		if("ideaId" in obj){this.ideaId = obj.ideaId;}
		if("version" in obj){this.version = obj.version;}
		if("isPublic" in obj){this.isPublic = obj.isPublic;}
		if("createdAt" in obj){this.createdAt = obj.createdAt;} //TODO: converto to Date nativ type
		if("updatedAt" in obj){this.updatedAt = obj.updatedAt;}//TODO: converto to Date nativ type
		if("sourceId" in obj){this.sourceId = obj.sourceId;}
		if("targetId" in obj){this.targetId = obj.targetId;}
		if("dataContent" in obj){this.dataContent = obj.dataContent;}
		if("visual" in obj){this.visual = obj.visual;} // Still Visual is not used so we are not filling it like for kNode
	}
};

KEdge.prototype.toServerCopy = function(){
	var kEdge = (JSON.parse(JSON.stringify(this))); //copy
	if(kEdge.state == KEdge.STATE_LOCAL){
		delete kEdge._id;
	}
	delete kEdge.state;
	if(kEdge.createdAt === undefined || kEdge.createdAt === null) {delete kEdge.createdAt;}
	if(kEdge.updatedAt === undefined || kEdge.updatedAt === null) {delete kEdge.updatedAt;}
	return kEdge;
};

}()); // end of 'use strict';