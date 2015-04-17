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

KEdge.createEdge = function(obj){
	var kEdge = new knalledge.KEdge();
	if("_id" in obj){kEdge._id = obj._id;}
	if("name" in obj){kEdge.name = obj.name;}
	if("mapId" in obj){kEdge.mapId = obj.mapId;}
	if("iAmId" in obj){kEdge.iAmId = obj.iAmId;}
	if("activeVersion" in obj){kEdge.activeVersion = obj.activeVersion;}
	if("ideaId" in obj){kEdge.ideaId = obj.ideaId;}
	if("version" in obj){kEdge.version = obj.version;}
	if("isPublic" in obj){kEdge.isPublic = obj.isPublic;}
	if("createdAt" in obj){kEdge.createdAt = obj.createdAt;} //TODO: converto to Date nativ type
	if("updatedAt" in obj){kEdge.updatedAt = obj.updatedAt;}//TODO: converto to Date nativ type
	if("sourceId" in obj){kEdge.sourceId = obj.sourceId;}
	if("targetId" in obj){kEdge.targetId = obj.targetId;}
	if("dataContent" in obj){kEdge.dataContent = obj.dataContent;}
	if("visual" in obj){kEdge.visual = obj.visual;} // Still Visual is not used so we are not filling it like for kNode

	return kEdge;
}

KEdge.STATE_LOCAL = "STATE_LOCAL";
KEdge.STATE_NON_SYNCED = "STATE_NON_SYNCED";
KEdge.STATE_SYNCED = "STATE_SYNCED";

KEdge.prototype.init = function(){
	
};

}()); // end of 'use strict';