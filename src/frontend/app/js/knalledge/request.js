(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var knalledge = (typeof global !== 'undefined' && global.knalledge) || (typeof window !== 'undefined' && window.knalledge);

/**
 * @classdesc VRequest is data representation of the knowledge (KnAllEdge) request.
 * @class Request
 * @memberof knalledge
 */

var Request =  knalledge.Request = function(){
	this._id = Request.MaxId++; //TODO: maxId logic should be migrated here. Unique id. Here it is locally set, but is overriden by unique value, when object is saved in DB
	this.reference = null; //reference to a node or other object regarding which participant has a request
	this.type = null; //type of the object, responding to one of the Request.TYPE_... constants
	this.mapId = null; // id of map this object belongs to
	this.iAmId = 0;	//id of object creator (whoAmi/RIMA user)
	this.isPublic = true; //is the object public or visible/accessible only to the author
	this.createdAt = null; //when the object is created
	this.updatedAt = null; //when the obect is updated
	// this.dataContent = null; //additional data is stored in this object
	// this.dataContent.property = null; // value of request content (Additional Info)
	this.decorations = {
	};
	// next higher level of abstraction

	this.state = Request.STATE_REQUESTED; //state of the object, responding to some of the Request.STATE_... constants
};

Request.MaxId = 0;
Request.STATE_REQUESTED = "STATE_REQUESTED"; //
Request.STATE_GRANTED = "STATE_GRANTED"; //
Request.STATE_REVOKED = "STATE_REVOKED"; //

Request.TYPE_REPLICA = "TYPE_REPLICA"; //reference is kNode._id
Request.TYPE_CLARIFICATION = "TYPE_CLARIFICATION";

Request.prototype.init = function(){

};

Request.requestFactory = function(obj){
	var request = new knalledge.Request();
	request.fill(obj);
	return request;
};

Request.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("reference" in obj){this.reference = obj.reference;}
		if("type" in obj){this.type = obj.type;}
		if("mapId" in obj){this.mapId = obj.mapId;}
		if("iAmId" in obj){this.iAmId = obj.iAmId;}
		if("isPublic" in obj){this.isPublic = obj.isPublic;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
		if("dataContent" in obj){this.dataContent = obj.dataContent;} //TODO: deep copy?
		if("decorations" in obj){this.decorations = obj.decorations;} //TODO: deep copy?
	}
};


/** when object is updated on server we override local object by server version using this function **/
Request.prototype.overrideFromServer = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("createdAt" in obj){this.createdAt = new Date(obj.createdAt);}
		if("updatedAt" in obj){this.updatedAt = new Date(obj.updatedAt);}
	}
	this.state = Request.STATE_SYNCED;
};

/** before sending to object to server we clean it and fix it for server **/
Request.prototype.toServerCopy = function(){
	var request = {};

	// TODO: fix cloning
	var whats = null;
	if(this.dataContent && this.dataContent.rima && this.dataContent.rima.whats){
		var whats = this.dataContent.rima.whats;
		this.dataContent.rima.whats = [];
	}
	/* copying all non-system and non-function properties */
	for(var id in this){
		if(id[0] == '$') continue;
		if (typeof this[id] == 'function') continue;
		//console.log("cloning: %s", id);
		if(this[id] !== undefined){ //JSON.parse breaks at "undefined"
			request[id] = (JSON.parse(JSON.stringify(this[id])));
		}
	}
	if(whats){
		var whatsNew = [];
		/* copying all non-system and non-function properties */
		for(var wI in whats){
			var what = whats[wI];
			var whatNew = {};
			whatsNew.push(whatNew);
			for(var id in what){
				if(id[0] == '$') continue;
				if (typeof what[id] == 'function') continue;
				//console.log("cloning: %s", id);
				whatNew[id] = (JSON.parse(JSON.stringify(what[id])));
			}
		}
		this.dataContent.rima.whats = whats;
		request.dataContent.rima.whats = whatsNew;
	}

	/* deleting properties that should be set created to default value on server */
	if(request.createdAt === undefined || request.createdAt === null) {delete request.createdAt;}
	if(request.updatedAt === undefined || request.updatedAt === null) {delete request.updatedAt;}

	if(request.state == Request.STATE_LOCAL){
		delete request._id;
	}

	/* deleting local-frontend parameters */
	delete request.state;

	return request;
};

// request support (export)
if (typeof module !== 'undefined') module.exports = Request;

}()); // end of 'use strict';
