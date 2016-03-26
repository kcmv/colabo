(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

//http://robertwhurst.github.io/KeyboardJS/
//	https://github.com/RobertWHurst/KeyboardJS

/**
@classdesc Provides keyboard interaction for the KnAllEdge system
@class Keyboard
@memberof interaction
@constructor
@param {Object} mapInteraction - interface for interacting with map,
in this way the Keboard class is merely a action invoker for the business logic
located in mapInteraction
*/
var Keyboard =  interaction.Keyboard = function(mapInteraction){
	this.mapInteraction = mapInteraction;
};

/**
 * Prefix for all keyboard commands.
 * ** NOTE**: this is currently necessary since we do not isolate the Keyboard class
 * listening for commands while we are typing a regular text inside the node name or content
 * @type {String}
 */
Keyboard.KEY_PREFIX = "ctrl + ";

/**
* @var {debugPP} debug - namespaced debug for the class
* @memberof interaction.Keyboard
*/
Keyboard.debug = debugpp.debug('interaction.Keyboard');

Keyboard.prototype.init = function(){
	this.initializeKeyboard();
};

// http://robertwhurst.github.io/KeyboardJS/
Keyboard.prototype.initializeKeyboard = function() {
	//var that = this;

	KeyboardJS.on("right", function(){
		this.mapInteraction.navigateRight();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("left", function(){
		this.mapInteraction.navigateLeft();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("down", function(){
		this.mapInteraction.navigateDown();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("up", function(){
		this.mapInteraction.navigateUp();
	}.bind(this), function(){}.bind(this));

	/**
	 * opening node
	 */

	KeyboardJS.on("alt + 1", function(){
		console.log("alt + 1");
		this.mapInteraction.switchToMap();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on("alt + 2", function(){
		console.log("alt + 2");
		this.mapInteraction.switchToProperties();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on(Keyboard.KEY_PREFIX + "enter", function(){
		console.log("ctrl + enter");
		this.mapInteraction.toggleNode();
	}.bind(this), function(){}.bind(this));

	/**
	 * starting node editing
	 */
	KeyboardJS.on(Keyboard.KEY_PREFIX + "space",
		function(){
			if(this.mapInteraction.isEditingNode()){
				return;
			}
			if(!this.mapInteraction.isStatusMap()) return;
			return false;
		}.bind(this),
		function(){
			this.mapInteraction.setEditing();
		}.bind(this),
		function(){

		}.bind(this)
	);

	/**
	 * search for the node name
	 */
	KeyboardJS.on(Keyboard.KEY_PREFIX + "f", function(){
		if(this.mapInteraction.isEditingNode()) return;
		this.mapInteraction.searchNodeByName();
	}.bind(this), function(){}.bind(this));

	/**
	 * toggling moderator
	 */
	KeyboardJS.on(Keyboard.KEY_PREFIX + "alt + m", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.toggleModerator();
	}.bind(this), function(){}.bind(this));

	/**
	 * toggling presenter
	 */
	KeyboardJS.on(Keyboard.KEY_PREFIX + "alt + p", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.togglePresenter();
	}.bind(this), function(){}.bind(this));

	/**
	 * finishing node editing
	 */
	KeyboardJS.on(Keyboard.KEY_PREFIX + "escape", function(){
		console.log("editing escaping");
		this.mapInteraction.exitEditingNode();
	}.bind(this), function(){}.bind(this));

	// IBIS
	// Vote up
	KeyboardJS.on(Keyboard.KEY_PREFIX + "command + up", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.nodeVoteUp();
	}.bind(this), function(){}.bind(this));

	// Vote up
	KeyboardJS.on(Keyboard.KEY_PREFIX + "command + down", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.nodeVoteDown();
	}.bind(this), function(){}.bind(this));

	// Add Image
	KeyboardJS.on(Keyboard.KEY_PREFIX + "i", function(){
		// window.prompt("Kmek");
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.addImage();
	}.bind(this), function(){}.bind(this));

	// Remove Image
	KeyboardJS.on(Keyboard.KEY_PREFIX + "shift + i", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.removeImage();
	}.bind(this), function(){}.bind(this));

	// Add Link
	KeyboardJS.on(Keyboard.KEY_PREFIX + "l", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.addLink();
	}.bind(this), function(){}.bind(this));

	// Add new node
	KeyboardJS.on(Keyboard.KEY_PREFIX + "n", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addNode();
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on(Keyboard.KEY_PREFIX + "alt + 1", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on(Keyboard.KEY_PREFIX + "alt + 2", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on(Keyboard.KEY_PREFIX + "alt + 3", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
	}.bind(this), function(){}.bind(this));

	KeyboardJS.on(Keyboard.KEY_PREFIX + "alt + 4", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
	}.bind(this), function(){}.bind(this));

	// Relinks the node:
	// PreAction: select the node to relink
	// PostAction: select new parent node
	//TODO: this UI will not work when we will have more parents of node!
	KeyboardJS.on(Keyboard.KEY_PREFIX + "k", function(){
		this.mapInteraction.relinkNode();
	}.bind(this), function(){}.bind(this));

	// Delete node:
	KeyboardJS.on(Keyboard.KEY_PREFIX + "delete", function(){
		console.log("ctrl + delete");
		if(this.mapInteraction.isEditingNode()) return; // in typing mode

		this.mapInteraction.deleteNode();
	}.bind(this), function(){}.bind(this));

	//TODO: Delete edge
};

}()); // end of 'use strict';
