(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
 * @classdesc VKEdge is right now a local object, it does not exist on server, in database, but is packed into "visual" property of kEdge
 * and upon retrieving from server it recreated from there.
 * BUT! //	NOTE: in the future, each user will have its one or more visual representations of kEdge,
 * so accordingly this object is going to be an independent object in server storage, related to iAmId (user ID) and kEdge!
 * @class VKEdge
 * @memberof knalledge
 */

var VKEdge =  knalledge.VKEdge = function(){
	this.id = VKEdge.MaxId++; //Unique id
	this.kEdge = null; // reference to the related kEdge object
	this.iAmId = 0; //id of node creator (whoAmi/RIMA user)
	this.selectable = true;
	this.visible = true; // if defined and set to false the vkEdge should not be presented
	this.createdAt = null; //when the object is created
	this.updatedAt = null; //when the obect is updated
};

VKEdge.MaxId = 0;
VKEdge.prototype.init = function(){
};

VKEdge.prototype.fillWithKEdge = function(kEdge, setKEdge){
	if(kEdge){
		if(setKEdge) this.kEdge = kEdge;
	}
};

}()); // end of 'use strict';
