(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var KNode =  knalledge.KNode = function(){
	this._id = 0; //maxId logic should be migrated here
	this.name = "name...";
	this.mapId = KNode.DEFAULT_MAP_ID;	
	this.iAmId = 0;
	this.activeVersion = 1;
	this.ideaId = 0;
	this.version = 1;
	this.isPublic = true;
	this.createdAt = null;
	this.updatedAt = null;
	this.dataContent = "";
	this.visual = {
			isOpen: false,
			x: 0,
			y: 0,
			width: 0,
			height: 0
	};
	
	/* local-to-frontend */
	this.state = KNode.STATE_LOCAL;
	
	
};

KNode.STATE_LOCAL = "STATE_LOCAL";
KNode.STATE_NON_SYNCED = "STATE_NON_SYNCED";
KNode.STATE_SYNCED = "STATE_SYNCED";
KNode.DEFAULT_MAP_ID = "552678e69ad190a642ad461c";

KNode.prototype.init = function(){
	
};

}()); // end of 'use strict';