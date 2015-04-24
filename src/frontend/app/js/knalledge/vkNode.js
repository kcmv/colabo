(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var VKNode =  knalledge.VKNode = function(){
	this.id = VKNode.MaxId++;
	this.kNode = null;
	this.iAmId = 0;
	this.selectable = true;
	this.createdAt = null;
	this.updatedAt = null;
};

VKNode.MaxId = 0;
VKNode.prototype.init = function(){
};

}()); // end of 'use strict';