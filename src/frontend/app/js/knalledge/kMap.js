(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
 * @classdesc KMap is a map, a data representation of the claster of related knowledge
 * It is stored on the server and **CURRENTLY** each node (KNode) or edge (KEdge)
 * can belong only to a single map (KMap)
 * @class KMap
 * @memberof knalledge
 */

var KMap =  knalledge.KMap = function(){
	this._id = KMap.MaxId++; //TODO: maxId logic should be migrated here
	this.name = "";
	this.rootNodeId = null;
	this.type = "";
	this.iAmId = 0;
	this.ideaId = 0;
	this.activeVersion = 1;
	this.version = 1;
	this.parentMapId = "";
	this.participants = [];
	this.isPublic = true;
	this.createdAt = null;
	this.updatedAt = null;
	this.dataContent = null; //dataContent.mcm.authors
	this.visual = {
	};

	/* local-to-frontend */
	this.state = KMap.STATE_LOCAL;
};

KMap.MaxId = 0;
KMap.STATE_LOCAL = "STATE_LOCAL";
KMap.STATE_NON_SYNCED = "STATE_NON_SYNCED";
KMap.STATE_SYNCED = "STATE_SYNCED";

KMap.prototype.init = function(){

};

KMap.mapFactory = function(obj){
	var kMap = new knalledge.KMap();
	kMap.fill(obj);
	return kMap;
};

KMap.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("name" in obj){this.name = obj.name;}
		if("rootNodeId" in obj){this.rootNodeId = obj.rootNodeId;}
		if("type" in obj){this.type = obj.type;}
		if("iAmId" in obj){this.iAmId = obj.iAmId;}
		if("ideaId" in obj){this.ideaId = obj.ideaId;}
		if("activeVersion" in obj){this.activeVersion = obj.activeVersion;}
		if("version" in obj){this.version = obj.version;}
		if("parentMapId" in obj){this.parentMapId = obj.parentMapId;}
		if("participants" in obj){this.participants = obj.participants;} //TODO deep copy of array?
		if("isPublic" in obj){this.isPublic = obj.isPublic;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
		if("dataContent" in obj){this.dataContent = obj.dataContent;} //TODO: deep copy?
		if("visual" in obj){
		}
	}
};

KMap.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = KMap.STATE_SYNCED;
};

KMap.prototype.toServerCopy = function(){
	var kMap = {};

	/* copying all non-system and non-function properties */
	for(var id in this){
		if(id[0] == '$') continue;
		if (typeof this[id] == 'function') continue;
		//console.log("cloning: %s", id);
		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
			kMap[id] = (JSON.parse(JSON.stringify(this[id])));
		}
	}

	/* deleting properties that should be set created to default value on server */
	if(kMap.createdAt === undefined || kMap.createdAt === null) {delete kMap.createdAt;}
	if(kMap.updatedAt === undefined || kMap.updatedAt === null) {delete kMap.updatedAt;}

	if(kMap.state == KMap.STATE_LOCAL){
		delete kMap._id;
	}

	/* deleting local-frontend parameters */
	delete kMap.state;

	return kMap;
};

}()); // end of 'use strict';
