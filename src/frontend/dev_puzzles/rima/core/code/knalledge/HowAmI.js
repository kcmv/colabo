(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var HowAmI =  knalledge.HowAmI = function(){
	this._id = HowAmI.MaxId++; //TODO: maxId logic should be migrated here
	this.whoAmI = "";
	this.whatAmI = "";
	this.how = 1;
	this.negation = "";
	this.level = "";
	this.importance = 0;

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
	this.state = HowAmI.STATE_LOCAL;
};

HowAmI.MaxId = 0;
HowAmI.STATE_LOCAL = "STATE_LOCAL";
HowAmI.STATE_NON_SYNCED = "STATE_NON_SYNCED";
HowAmI.STATE_SYNCED = "STATE_SYNCED";

HowAmI.prototype.init = function(){

};

HowAmI.howAmIFactory = function(obj){
	var howAmI = new knalledge.HowAmI();
	howAmI.fill(obj);
	return howAmI;
};

HowAmI.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("whoAmI" in obj){this.whoAmI = obj.whoAmI;}
		if("whatAmI" in obj){this.whatAmI = obj.whatAmI;}
		if("how" in obj){this.how = obj.how;}
		if("negation" in obj){this.negation = obj.negation;}
		if("level" in obj){this.level = obj.level;}
		if("importance" in obj){this.importance = obj.importance;}

		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
};

HowAmI.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = HowAmI.STATE_SYNCED;
};

HowAmI.prototype.toServerCopy = function(){
	var howAmI = {};

	/* copying all non-system and non-function properties */
	for(var id in this){
		if(id[0] == '$') continue;
		if (typeof this[id] == 'function') continue;
		//console.log("cloning: %s", id);
		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
			howAmI[id] = (JSON.parse(JSON.stringify(this[id])));
		}
	}

	/* deleting properties that should be set created to default value on server */
	if(howAmI.createdAt === undefined || howAmI.createdAt === null) {delete howAmI.createdAt;}
	if(howAmI.updatedAt === undefined || howAmI.updatedAt === null) {delete howAmI.updatedAt;}

	if(howAmI.state == HowAmI.STATE_LOCAL){
		delete howAmI._id;
	}

	/* deleting local-frontend parameters */
	delete howAmI.state;

	return howAmI;
};

}()); // end of 'use strict';
