(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var State =  knalledge.State = function(/*storageApi*/){
	this.addingLinkFrom = null;
	this.relinkingFrom = null;
	this.destroyed = false;
};

State.prototype.init = function(){
};

}()); // end of 'use strict';
