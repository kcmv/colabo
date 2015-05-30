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

VKNode.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("name" in obj){this.name = obj.name;}
		if("isOpen" in obj){this.isOpen = obj.isOpen;}
		if("xM" in obj){this.xM = obj.xM;}
		if("yM" in obj){this.yM = obj.yM;}
		if("widthM" in obj){this.widthM = obj.widthM;}
		if("heightM" in obj){this.heightM = obj.heightM;}
	}
};

VKNode.prototype.fillWithKNode = function(kNode, setKNode){
	if(kNode){
		if(setKNode) this.kNode = kNode;
		if(kNode.visual){
			if("isOpen" in kNode.visual){this.isOpen = kNode.visual.isOpen;}
			if("xM" in kNode.visual){this.xM = kNode.visual.xM;}
			if("yM" in kNode.visual){this.yM = kNode.visual.yM;}
			if("widthM" in kNode.visual){this.widthM = kNode.visual.widthM;}
			if("heightM" in kNode.visual){this.heightM = kNode.visual.heightM;}
		}
	}
};

}()); // end of 'use strict';