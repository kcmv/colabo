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
	//var that = this;

	// var keyboardLibType = 'KeyboardJS';
	var keyboardLibType = 'Kibo';

	var keyboardLib;
	var keyboardCommand;
	var keyboardCommandUp;
	var keyboardCommandDown;
	var keyboardSequenceKey;
	var mapDom = this.mapInteraction.getMapDom();

	switch(keyboardLibType){
		case 'KeyboardJS':
			keyboardLib = keyboardJS;
			keyboardCommand = 'bind';
			keyboardSequenceKey = " + ";
		break;
		case 'Kibo':
			// keyboardLib = new Kibo(mapDom[0][0]);
			keyboardLib = new Kibo();
			keyboardCommand = 'down';
			keyboardCommandUp = 'up';
			keyboardCommandDown = 'down';
			keyboardSequenceKey = " ";
		break;
	}

	Keyboard.KEY_PREFIX = "ctrl" + keyboardSequenceKey;

	keyboardLib[keyboardCommand]("right", function(){
		this.mapInteraction.navigateRight();
	}.bind(this));

	keyboardLib[keyboardCommand]("left", function(){
		this.mapInteraction.navigateLeft();
	}.bind(this));

	keyboardLib[keyboardCommand]("down", function(){
		this.mapInteraction.navigateDown();
	}.bind(this));

	keyboardLib[keyboardCommand]("up", function(){
		this.mapInteraction.navigateUp();
	}.bind(this));

	/**
	 * opening node
	 */

	keyboardLib[keyboardCommand]("alt" + keyboardSequenceKey + "1", function(){
		console.log("alt" + keyboardSequenceKey + "1");
		this.mapInteraction.switchToMap();
	}.bind(this));

	keyboardLib[keyboardCommand]("alt" + keyboardSequenceKey + "2", function(){
		console.log("alt" + keyboardSequenceKey + "2");
		this.mapInteraction.switchToProperties();
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"enter", function(){
		console.log("ctrl" + keyboardSequenceKey + "enter");
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

	if(keyboardCommandUp && keyboardCommandDown){
		keyboardLib[keyboardCommandDown](
			Keyboard.KEY_PREFIX+"space", keyboardSpaceDown);
		keyboardLib[keyboardCommandUp](
			Keyboard.KEY_PREFIX+"space", keyboardSpaceUp);
	}else{
		keyboardLib[keyboardCommand](
			Keyboard.KEY_PREFIX+"space", keyboardSpaceDown,
			Keyboard.KEY_PREFIX+"space", keyboardSpaceUp);
	}

	/**
	 * search for the node name
	 */
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"f", function(){
		if(this.mapInteraction.isEditingNode()) return;
		this.mapInteraction.searchNodeByName();
	}.bind(this));

	/**
	 * toggling moderator
	 */
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"alt" + keyboardSequenceKey + "m", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.toggleModerator();
	}.bind(this));

	/**
	 * toggling presenter
	 */
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"alt" + keyboardSequenceKey + "p", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.togglePresenter();
	}.bind(this));

	/**
	 * finishing node editing
	 */
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"escape", function(){
		console.log("editing escaping");
		this.mapInteraction.exitEditingNode();
	}.bind(this));

	// IBIS
	// Vote up
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"command" + keyboardSequenceKey + "up", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.nodeVote(1);
	}.bind(this));

	// Vote up
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"command" + keyboardSequenceKey + "down", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.nodeVote(-1);
	}.bind(this));

	// Add Image
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"i", function(){
		// window.prompt("Kmek");
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.addImage();
	}.bind(this));

	// Remove Image
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"shift" + keyboardSequenceKey + "i", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.removeImage();
	}.bind(this));

	// Add Link
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"l", function(){
		if(this.mapInteraction.isEditingNode()) return;

		this.mapInteraction.addLink();
	}.bind(this));

	// Add new child node
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"n", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode();
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"alt" + keyboardSequenceKey + "1", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"alt" + keyboardSequenceKey + "2", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"alt" + keyboardSequenceKey + "3", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"alt" + keyboardSequenceKey + "4", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
	}.bind(this));

	// Add new sibling node
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"shift" + keyboardSequenceKey + "n", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode();
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"shift" + keyboardSequenceKey + "alt" + keyboardSequenceKey + "1", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"shift" + keyboardSequenceKey + "alt" + keyboardSequenceKey + "2", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"shift" + keyboardSequenceKey + "alt" + keyboardSequenceKey + "3", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
	}.bind(this));

	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"shift" + keyboardSequenceKey + "alt" + keyboardSequenceKey + "4", function(){
		if(!this.mapInteraction.isStatusMap()) return;
		this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
	}.bind(this));

	// Relinks the node:
	// PreAction: select the node to relink
	// PostAction: select new parent node
	//TODO: this UI will not work when we will have more parents of node!
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"k", function(){
		this.mapInteraction.relinkNode();
	}.bind(this));

	/**
	 *  Activates Request console for participant:
	* PreAction: ...
	* PostAction: ...
	*/
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"r", function(){
		this.mapInteraction.participantRequest();
	}.bind(this));

	// Delete node:
	keyboardLib[keyboardCommand](Keyboard.KEY_PREFIX+"delete", function(){
		console.log("ctrl" + keyboardSequenceKey + "delete");
		if(this.mapInteraction.isEditingNode()) return; // in typing mode

		this.mapInteraction.deleteNode();
	}.bind(this));

	//TODO: Delete edge
};

}()); // end of 'use strict';
