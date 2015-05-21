(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var VKEdge =  knalledge.VKEdge = function(){
	this.id = VKEdge.MaxId++;
	this.kEdge = null;
	this.iAmId = 0;
	this.selectable = true;
	this.createdAt = null;
	this.updatedAt = null;
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