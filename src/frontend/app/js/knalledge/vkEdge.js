(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var VKEdge =  knalledge.VKEdge = function(){
	this._id = 0; //TODO: maxId logic should be migrated here
	this.kEdge = null;
	this.iAmId = 0;
	this.createdAt = null;
	this.updatedAt = null;
};

VKEdge.prototype.init = function(){
};

}()); // end of 'use strict';