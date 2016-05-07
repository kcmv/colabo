(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

//http://robertwhurst.github.io/keyboardJS/
//	https://github.com/RobertWHurst/keyboardJS

/**
@classdesc Provides keyboard interaction for the KnAllEdge system
@class Keyboard
@memberof interaction
@constructor
@param {Object} mapInteraction - interface for interacting with map,
in this way the Keboard class is merely a action invoker for the business logic
located in mapInteraction
@param {Object} mapPlugin - access to all plugins relevant to the map
*/
var Keyboard =  interaction.Keyboard = function(mapInteraction, mapPlugins){
	this.mapInteraction = mapInteraction;
	this.mapPlugins = mapPlugins;
};

/**
 * Prefix for all keyboard commands.
 * ** NOTE**: this is currently necessary since we do not isolate the Keyboard class
 * listening for commands while we are typing a regular text inside the node name or content
 * @type {String}
 */
Keyboard.KEY_PREFIX;

/**
* @var {debugPP} debug - namespaced debug for the class
* @memberof interaction.Keyboard
*/
Keyboard.debug = debugpp.debug('interaction.Keyboard');

Keyboard.prototype.init = function(){
	this.initializeKeyboard();
};

// http://robertwhurst.github.io/keyboardJS/
Keyboard.prototype.initializeKeyboard = function() {
	var that = this;

	// var this.keyboardLibType = 'KeyboardJS';
	this.keyboardLibType = 'Kibo';

	this.keyboardLib;
	this.keyboardCommand;
	this.keyboardCommandUp;
	this.keyboardCommandDown;
	this.keyboardSequenceKey;
	this.keyboardSequenceKeyCommand;
	this.keyboardSequenceKeyEsc;
	this.mapDom = this.mapInteraction.getMapDom();

	switch(this.keyboardLibType){
		case 'KeyboardJS':
			this.keyboardLib = keyboardJS;
			this.keyboardCommand = 'bind';
			this.keyboardSequenceKey = " + ";
			this.keyboardSequenceKeyCommand = 'command';
			this.keyboardSequenceKeyEsc = 'escape';
		break;
		case 'Kibo':
			// this.keyboardLib = new Kibo(this.mapDom[0][0]);
			this.keyboardLib = new Kibo();
			this.keyboardCommand = 'down';
			this.keyboardCommandUp = 'up';
			this.keyboardCommandDown = 'down';
			this.keyboardSequenceKey = " ";
			this.keyboardSequenceKeyCommand = 'alt';
			this.keyboardSequenceKeyEsc = 'esc';
		break;
	}

	Keyboard.KEY_PREFIX = "ctrl" + this.keyboardSequenceKey;

	this.keyboardLib[this.keyboardCommand]("right", function(){
		this.mapInteraction.navigateRight();
	}.bind(this));

	this.keyboardLib[this.keyboardCommand]("left", function(){
		this.mapInteraction.navigateLeft();
	}.bind(this));

	this.keyboardLib[this.keyboardCommand]("down", function(){
		this.mapInteraction.navigateDown();
	}.bind(this));

	this.keyboardLib[this.keyboardCommand]("up", function(){
		this.mapInteraction.navigateUp();
	}.bind(this));

	/**
	 * opening node
	 */

	this.keyboardLib[this.keyboardCommand](this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1", function(){
		console.log(this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1");
		this.mapInteraction.switchToMap();
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2", function(){
		console.log(this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2");
		this.mapInteraction.switchToProperties();
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"enter", function(){
		console.log("ctrl" + this.keyboardSequenceKey + "enter");
		this.mapInteraction.toggleNode();
	}.bind(this));

	/**
	 * starting node editing
	 */
	var keyboardSpaceDown = function(){
		if(this.mapInteraction.isEditingNode()){
			return;
		}
		if(!this.mapInteraction.isStatusMap()) return;
		return false;
	}.bind(this);

	var keyboardSpaceUp = function(){
		this.mapInteraction.setEditing();
	}.bind(this);

	if(this.keyboardCommandUp && this.keyboardCommandDown){
		this.keyboardLib[this.keyboardCommandDown](
			Keyboard.KEY_PREFIX+"space", keyboardSpaceDown);
		this.keyboardLib[this.keyboardCommandUp](
			Keyboard.KEY_PREFIX+"space", keyboardSpaceUp);
	}else{
		this.keyboardLib[this.keyboardCommand](
			Keyboard.KEY_PREFIX+"space", keyboardSpaceDown,
			Keyboard.KEY_PREFIX+"space", keyboardSpaceUp);
	}

	/**
	 * search for the node name
	 */
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"f", function(){
		if(this.mapInteraction.isEditingNode()) return;
		this.mapInteraction.searchNodeByName();
	}.bind(this));

	/**
	 * toggling moderator
	 */
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "m", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.toggleModerator();
	}.bind(this));

	/**
	 * toggling presenter
	 */
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "p", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.togglePresenter();
	}.bind(this));

	/**
	 * finishing node editing
	 */
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyEsc, function(){
		console.log("editing escaping");
		this.mapInteraction.exitEditingNode();
	}.bind(this));

	// IBIS
	// Vote up
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "up", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.nodeVoteUp();
	}.bind(this));

	// Vote up
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "down", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.nodeVoteDown();
	}.bind(this));

	// Add Image
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"i", function(){
		// window.prompt("Kmek");
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.addImage();
	}.bind(this));

	// Remove Image
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + "i", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.removeImage();
	}.bind(this));

	// Add Link
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"l", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.addLink();
	}.bind(this));

	// Add new child node
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"n", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode();
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "3", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "4", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
	}.bind(this));

	// Add new sibling node
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + "n", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode();
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "3", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
	}.bind(this));

	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "4", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
	}.bind(this));

	// Relinks the node:
	// PreAction: select the node to relink
	// PostAction: select new parent node
	//TODO: this UI will not work when we will have more parents of node!
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"k", function(){
		this.mapInteraction.relinkNode();
	}.bind(this));

	// Delete node:
	this.keyboardLib[this.keyboardCommand](Keyboard.KEY_PREFIX+"delete", function(){
		console.log("ctrl" + this.keyboardSequenceKey + "delete");
		if(this.mapInteraction.isEditingNode()) return; // in typing mode

		this.mapInteraction.deleteNode();
	}.bind(this));

	//TODO: Delete edge

	if(that.mapPlugins && that.mapPlugins.keboardPlugins){
		for(var pluginName in that.mapPlugins.keboardPlugins){
			var plugin = that.mapPlugins.keboardPlugins[pluginName];
			if(typeof plugin.init === 'function'){
				plugin.init(this, that.mapInteraction);
			}
		}
	}
};

Keyboard.prototype.registerKey = function(key, event, callback){
	this.keyboardLib[this.keyboardCommand](key, function(){
		if(typeof callback === 'function') callback();
	}.bind(this));
};


}()); // end of 'use strict';
