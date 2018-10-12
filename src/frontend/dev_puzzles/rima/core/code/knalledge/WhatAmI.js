(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var WhatAmI =  knalledge.WhatAmI = function(){
	this._id = WhatAmI.MaxId++; //TODO: maxId logic should be migrated here
	this.name = "";
	this.parent = null;

	this.createdAt = null;
	this.updatedAt = null;
	
	/* local-to-frontend */
	this.state = WhatAmI.STATE_LOCAL;
};

WhatAmI.MaxId = 0;
WhatAmI.STATE_LOCAL = "STATE_LOCAL";
WhatAmI.STATE_NON_SYNCED = "STATE_NON_SYNCED";
WhatAmI.STATE_SYNCED = "STATE_SYNCED";

WhatAmI.prototype.init = function(){
	
};

WhatAmI.whatAmIFactory = function(obj){
	var whatAmI = new knalledge.WhatAmI();
	whatAmI.fill(obj);
	return whatAmI;
};

WhatAmI.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("name" in obj){this.name = obj.name;}
		if("parent" in obj){this.parent = obj.parent;}

		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
};

WhatAmI.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = WhatAmI.STATE_SYNCED;
};

WhatAmI.prototype.toServerCopy = function(){
	var whatAmI = {};
	
	/* copying all non-system and non-function properties */
	for(var id in this){
		if(id[0] == '$') continue;
		if (typeof this[id] == 'function') continue;
		//console.log("cloning: %s", id);
		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
			whatAmI[id] = (JSON.parse(JSON.stringify(this[id])));
		}
	}
	
	/* deleting properties that should be set created to default value on server */
	if(whatAmI.createdAt === undefined || whatAmI.createdAt === null) {delete whatAmI.createdAt;}
	if(whatAmI.updatedAt === undefined || whatAmI.updatedAt === null) {delete whatAmI.updatedAt;}
	
	if(whatAmI.state == WhatAmI.STATE_LOCAL){
		delete whatAmI._id;
	}
	
	/* deleting local-frontend parameters */
	delete whatAmI.state;
	
	return whatAmI;
};

}()); // end of 'use strict';