(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

// http://robertwhurst.github.io/keyboardJS/
// https://github.com/RobertWHurst/keyboardJS

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
	this.destroyed = false;
	this.enabled = true;
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

/**
 * The function that is called when we are destroying parent.
 * It has to destroy, or at worst disable any subcomponent from working
 * @function destroy
 * @memberof interaction.Keyboard#
 */
Keyboard.prototype.destroy = function(){
	this.destroyed = true;
};

Keyboard.MaxId = 0;

// http://robertwhurst.github.io/keyboardJS/
Keyboard.prototype.initializeKeyboard = function() {
	var that = this;
	this.keyboardId = ++Keyboard.MaxId;
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
	this.enabled = true;

	// interaction contexts
	this.contextStacks = ['*'];
	this.currentContext = 'cf.map';
	// contextualized interaction handlers

	/*
	{
		name: <string> = [
			{
				type: <'' | 'up' | 'down'>,
				key: <string>,
				callback: Function
			}
		]
	}
	*/
	this.contextualizedHandlers = {
		cf.map: {
			name: 'cf.map',
			handlers: []
		}
	}

	switch(this.keyboardLibType){
		case 'KeyboardJS':
			this.keyboardLib = keyboardJS;
			this.keyboardCommand = 'bind';
			this.keyboardCommandUnbind = 'unbind';
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

			this.keyboardCommandUnbind = 'down';
			this.keyboardCommandUpUnbind = 'up';
			this.keyboardCommandDownUnbind = 'down';

			this.keyboardSequenceKey = " ";
			this.keyboardSequenceKeyCommand = 'alt';
			this.keyboardSequenceKeyEsc = 'esc';
		break;
	}

	Keyboard.KEY_PREFIX = "ctrl" + this.keyboardSequenceKey;

	Keyboard.prototype.enable = function(){
		this.enabled = true;
	};

	Keyboard.prototype.disable = function(){
		this.enabled = false;
	};

	// registers a keyboard key handler inside the particular context
	// the handler is activated if it is in global or current context
	Keyboard.prototype.registerKey = function(context, key, type, callback){
		var handler = {
			type: type,
			key: key,
			callback: callback
		};
		this.contextualizedHandlers[context].push(handler);

		if(context == '*' || context == '' || context === this.currentContext){
			this.activateHandler(handler);
		}
	};

	// activate handler
	Keyboard.prototype.activateHandler = function(handler){
		var keyboardCommand = this.keyboardCommand;
		switch(handler.type){
			case 'up':
				keyboardCommand = this.keyboardCommandUp;
				break;
			case 'down':
				keyboardCommand = this.keyboardCommandDown;
				break;
		}

		this.keyboardLib[keyboardCommand](handler.key, function(){
			if(typeof handler.callback === 'function') handler.callback();
		}.bind(this));
	};

	// deactivate handler
	Keyboard.prototype.deactivateHandler = function(handler){
		var keyboardCommandUnbind = this.keyboardCommandUnbind;
		switch(handler.type){
			case 'up':
				keyboardCommand = this.keyboardCommandUpUnbind;
				break;
			case 'down':
				keyboardCommand = this.keyboardCommandDownUnbind;
				break;
		}

		// Kibo requires explicit null for handler (rather than undefined)
		// This will unregister all keyboard handlers registered for that key
		this.keyboardLib[keyboardCommandUnbind](handler.key, null);
	};

	// activate (unless it is general) all handlers in the specified context
	// it deactivates (unless it is general) all handler in the previousely active context
	// (the current context is not saved (in the context stack) but rather replaced,
	// used when switching between map and node properties, etc)
	Keyboard.prototype.activateContext = function(context){
		// deactivating previous-context handlers
		if(this.currentContext != '*' && this.currentContext != ''){
			var handlers = this.contextualizedHandlers[this.currentContext].handlers;
			for(var hI=0; hI<handlers.length; hI++){
				var handler = handlers[hI];
				this.deactivateHandler(handler);
			}
		}

		this.currentContext = context;

		// activating new-context handlers
		if(this.currentContext != '*' && this.currentContext != ''){
			handlers = this.contextualizedHandlers[this.currentContext].handlers;
			for(var hI=0; hI<handlers.length; hI++){
				var handler = handlers[hI];
				this.activateHandler(handler);
			}
		}
	}

	// activates new context and pushes the previous on the context stack
	// (used when we are opening a window popup over an active map, or similar scenarious)
	Keyboard.prototype.pushNewContext = function(context){
		this.contextStacks.push(this.currentContext);
		this.activateContext(context);
	}

	// pops the previous context from the context stack and sets it as an active one
	// (used when we are closing a window popup that is over an active map, or similar scenarious)
	Keyboard.prototype.popContext = function(){
		var context = this.contextStacks.pop();
		this.activateContext(context);
	}

	/*
	COLLABORATION HANDLERS
	*/

	/**
	 * toggling moderator
	 */
	this.registerKey('*', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "m", null, function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()) return;

			this.mapInteraction.toggleModerator();
		}
	}.bind(this));

	/**
	 * toggling presenter
	 */
	this.registerKey('*', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "p", null, function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()) return;

			this.mapInteraction.togglePresenter();
		}
	}.bind(this));


	/*
	CONTEXTUALIZATION INTERACTION HANDLERS
	*/
	this.registerKey('*', this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1", null, function(){
		if(this.enabled){
			console.log(this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1");
			this.mapInteraction.switchToMap();
		}
	}.bind(this));

	this.registerKey('*', this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2", null, function(){
		if(this.enabled){
			console.log(this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2");
			this.mapInteraction.switchToProperties();
		}
	}.bind(this));


	/* ===================================
	KNALLEDGE RELATED HANDLERS
	====================================== */

	/*
	NAVIGATION HANDLERS
	*/

	this.registerKey('cf.map', "right", null, function(){
		if(this.enabled) this.mapInteraction.navigateRight();
	}.bind(this));

	this.registerKey('cf.map', "left", null, function(){
		if(this.enabled) this.mapInteraction.navigateLeft();
	}.bind(this));

	this.registerKey('cf.map', "down", null, function(){
		if(this.enabled) this.mapInteraction.navigateDown();
	}.bind(this));

	this.registerKey('cf.map', "up", null, function(){
		if(this.enabled) this.mapInteraction.navigateUp();
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"enter", null, function(){
		if(this.enabled){
			console.log("ctrl" + this.keyboardSequenceKey + "enter");
			this.mapInteraction.toggleNode();
		}
	}.bind(this));

	/**
	 * search for the node name
	 */
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"f", null, function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()) return;
			this.mapInteraction.searchNodeByName();
		}
	}.bind(this));

	 /*
 	CONTENT CHANGE handlers
 	*/

	/**
	 * starting node editing
	 */
	var keyboardSpaceDown = function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()){
				return;
			}
			if(!this.mapInteraction.isStatusMap()) return;
			return false;
		}
	}.bind(this);

	var keyboardSpaceUp = function(){
		this.mapInteraction.setEditing();
	}.bind(this);

	if(this.keyboardCommandUp && this.keyboardCommandDown){
		this.registerKey('cf.map', Keyboard.KEY_PREFIX+"space", 'down', keyboardSpaceDown);
		this.registerKey('cf.map', Keyboard.KEY_PREFIX+"space", 'up', keyboardSpaceUp);
	}else{
		this.registerKey('cf.map', Keyboard.KEY_PREFIX+"space", null, keyboardSpaceUp);
	}

	/**
	 * finishing node editing
	 */
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyEsc, null, function(){
		if(this.enabled){
			console.log("editing escaping");
			this.mapInteraction.exitEditingNode();
		}
	}.bind(this));

	// Add Image
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"i", null, function(){
		if(this.enabled){
			// window.prompt("Kmek");
			if(this.mapInteraction.isEditingNode()) return;

			this.mapInteraction.addImage();
		}
	}.bind(this));

	// Remove Image
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + "i", null, function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()) return;

			this.mapInteraction.removeImage();
		}
	}.bind(this));

	/*
	IBIS HANDLERS
	*/

	// Vote up
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "up", null, function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()) return;

			this.mapInteraction.nodeVote(1);
			return false;
		}
	}.bind(this));

	// Vote down
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "down", null, function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()) return;

			this.mapInteraction.nodeVote(-1);
			return false;
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "3", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "4", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addChildNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "1", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_QUESTION, knalledge.KEdge.TYPE_IBIS_QUESTION);
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "2", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_IDEA, knalledge.KEdge.TYPE_IBIS_IDEA);
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "3", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_ARGUMENT, knalledge.KEdge.TYPE_IBIS_ARGUMENT);
		}
	}.bind(this));

	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + this.keyboardSequenceKeyCommand + this.keyboardSequenceKey + "4", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addSiblingNode(knalledge.KNode.TYPE_IBIS_COMMENT, knalledge.KEdge.TYPE_IBIS_COMMENT);
		}
	}.bind(this));

	/*
	KNALLEDGE STRUCTURE HANDLERS
	*/

	// Add new child node
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"n", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addChildNode();
		}
	}.bind(this));

	// Add new sibling node
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"shift" + this.keyboardSequenceKey + "n", null, function(){
		if(this.enabled){
			if(!this.mapInteraction.isStatusMap()) return;
			this.mapInteraction.addSiblingNode();
		}
	}.bind(this));

	// Add Link
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"l", null, function(){
		if(this.enabled){
			if(this.mapInteraction.isEditingNode()) return;

			this.mapInteraction.addLink();
		}
	}.bind(this));

	// Relinks the node:
	// PreAction: select the node to relink
	// PostAction: select new parent node
	//TODO: this UI will not work when we will have more parents of node!
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"k", null, function(){
		if(this.enabled){
			this.mapInteraction.relinkNode();
		}
	}.bind(this));

	// Delete node:
	this.registerKey('cf.map', Keyboard.KEY_PREFIX+"delete", null, function(){
		if(this.enabled){
			console.log("ctrl" + this.keyboardSequenceKey + "delete");
			if(this.mapInteraction.isEditingNode()) return; // in typing mode

			this.mapInteraction.deleteNode();
		}
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

}()); // end of 'use strict';
