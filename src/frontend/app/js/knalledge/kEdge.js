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

KEdge.STATE_LOCAL = "STATE_LOCAL";
KEdge.STATE_NON_SYNCED = "STATE_NON_SYNCED";
KEdge.STATE_SYNCED = "STATE_SYNCED";

KEdge.prototype.init = function(){
	
};

}()); // end of 'use strict';