(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var WhoAmI =  knalledge.WhoAmI = function(){
	this._id = WhoAmI.MaxId++; //TODO: maxId logic should be migrated here
	this.firstname = "";
	this.familyname = "";
	this.e_mail = "";
	this.passw = "";
	this.displayName = "";
	this.gender = 0;
	this.birthday = 1;
	this.affiliation = "";
	this.coordX = 0;
	this.coordY = 0;
	this.locationType = null;
	this.mySearchAreaVisible = true;
	this.myLocationVisible = true;
	this.accessedAt = null;
	this.locationUpdatedAt = null;
	this.language = "";
	this.origin = "";
	this.photoUrl = "";
	this.bio = "";

	this.extensions = {
		contacts: {}
	};

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
	this.state = WhoAmI.STATE_LOCAL;
};

WhoAmI.MaxId = 0;
WhoAmI.STATE_LOCAL = "STATE_LOCAL";
WhoAmI.STATE_NON_SYNCED = "STATE_NON_SYNCED";
WhoAmI.STATE_SYNCED = "STATE_SYNCED";

WhoAmI.prototype.getId = function() {
	return this._id;
}

WhoAmI.prototype.init = function(){

};

WhoAmI.whoAmIFactory = function(obj){
	var whoAmI = new knalledge.WhoAmI();
	whoAmI.fill(obj);
	return whoAmI;
};

WhoAmI.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("firstname" in obj){this.firstname = obj.firstname;}
		if("familyname" in obj){this.familyname = obj.familyname;}
		if("e_mail" in obj){this.e_mail = obj.e_mail;}
		if("passw" in obj){this.passw = obj.passw;}
		if("displayName" in obj){this.displayName = obj.displayName;}
		if("gender" in obj){this.gender = obj.gender;}
		if("birthday" in obj){this.birthday = obj.birthday;}
		if("affiliation" in obj){this.affiliation = obj.affiliation;}
		if("coordX" in obj){this.coordX = obj.coordX;}
		if("coordY" in obj){this.coordY = obj.coordY;}
		if("locationType" in obj){this.locationType = obj.locationType;}

		if("mySearchAreaVisible" in obj){this.mySearchAreaVisible = obj.mySearchAreaVisible;}
		if("myLocationVisible" in obj){this.myLocationVisible = obj.myLocationVisible;}
		if("accessedAt" in obj){this.accessedAt = obj.accessedAt;}
		if("locationUpdatedAt" in obj){this.locationUpdatedAt = obj.locationUpdatedAt;}
		if("language" in obj){this.language = obj.language;}
		if("origin" in obj){this.origin = obj.origin;}
		if("photoUrl" in obj){this.photoUrl = obj.photoUrl;}
		if("bio" in obj){this.bio = obj.bio;}
		if("extensions" in obj){
			this.extensions = {}; //TODO: see how to copy this
			if("contacts" in obj.extensions){
				this.extensions.contacts = obj.extensions.contacts;
			}
		}


		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
};

WhoAmI.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = WhoAmI.STATE_SYNCED;
};

WhoAmI.prototype.toServerCopy = function(){
	var whoAmI = {};

	/* copying all non-system and non-function properties */
	for(var id in this){
		if(id[0] == '$') continue;
		if (typeof this[id] == 'function') continue;
		//console.log("cloning: %s", id);
		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
			whoAmI[id] = (JSON.parse(JSON.stringify(this[id])));
		}
	}

	/* deleting properties that should be set created to default value on server */
	if(whoAmI.createdAt === undefined || whoAmI.createdAt === null) {delete whoAmI.createdAt;}
	if(whoAmI.updatedAt === undefined || whoAmI.updatedAt === null) {delete whoAmI.updatedAt;}

	if(whoAmI.state == WhoAmI.STATE_LOCAL){
		delete whoAmI._id;
	}

	/* deleting local-frontend parameters */
	delete whoAmI.state;

	return whoAmI;
};

}()); // end of 'use strict';
