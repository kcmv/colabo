(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var VKEdge =  knalledge.VKEdge = function(){
	this.id = VKEdge.MaxId++; //Unique id
	this.kEdge = null; // reference to the related kEdge object
	this.iAmId = 0; //id of node creator (whoAmi/RIMA user)
	this.selectable = true;
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