(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
 * @classdesc VKNode is right now a local object, it does not exist on server, in database, but is packed into "visual" property of kNode
 * and upon retrieving from server it recreated from there.
 * BUT! //	NOTE: in the future, each user will have its one or more visual representations of kNode,
 * so accordingly this object is going to be an independent object in server storage, related to iAmId (user ID) and kNode!
 * @class VKNode
 * @memberof knalledge
 */
var VKNode =  knalledge.VKNode = function(){
	this.id = VKNode.MaxId++; //Unique id
	this.kNode = null; // reference to the related kNode object
	this.iAmId = 0; //id of node creator (whoAmi/RIMA user)
	this.selectable = true;
	this.visible = true; // if defined and set to false the vkNode should not be presented
	this.createdAt = null; //when the object is created
	this.updatedAt = null; //when the obect is updated
	this.presentation = {}; //containing all the parameters that define is and how the node presented regarding filtering, depth of view, etc
	this.presentation.visibleByDistance = true;
	this.presentation.visibleAsAncestor = true; //visibile because it is on root to some of visible nodes
	//TODO: some properties are not shown here, but are explained and used in the function "fill" below
};

VKNode.MaxId = 0;

VKNode.prototype.init = function(){
};

VKNode.prototype.fill = function(obj){
	if(obj){
		if("_id" in obj){this._id = obj._id;}
		if("name" in obj){this.name = obj.name;} //name that is displayed, when node is visualized, corresponding to kNode.name
		if("isOpen" in obj){this.isOpen = obj.isOpen;} //if object is open, that its children (e.g. in tree) are displayed
		if("xM" in obj){this.xM = obj.xM;} //manual set x coordinate, set by user
		if("yM" in obj){this.yM = obj.yM;} //manual set y coordinate, set by user
		if("widthM" in obj){this.widthM = obj.widthM;} //manual set width, set by user
		if("heightM" in obj){this.heightM = obj.heightM;} //manual set height, set by user
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
