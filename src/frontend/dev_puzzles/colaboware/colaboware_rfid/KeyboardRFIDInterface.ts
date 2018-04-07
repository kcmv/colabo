declare let keyboardJS:any;
declare let Kibo:any;
// http://robertwhurst.github.io/keyboardJS/
// https://github.com/RobertWHurst/keyboardJS

/**
 * @classdesc KeyboardRFIDInterface is interface to to RFID.
 * It listens for a user providing RFID card at the reader and it emmits it in an object
 * @class KeyboardRFIDInterface
 */

export class KeyboardRFIDInterface{
  destroyed:boolean = false;
  enabled:boolean = true;

  keyboardLib:any;
  keyboardCommand:string;
  keyboardCommandUp:string;
  keyboardCommandDown:string;
  keyboardSequenceKey:string;
  keyboardSequenceKeyCommand:string;
  keyboardSequenceKeyEsc:string;
  keyboardLibType:string;
  keyboardCommandUnbind:string;
  keyboardCommandUpUnbind:string;
  keyboardCommandDownUnbind:string;

  // interaction contexts
  contextStacks:string[] = ['*'];
  currentContext:string = 'colabo.colaboware.colaboware_rfid';
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
  contextualizedHandlers:any = {
    'colabo.colaboware.colaboware_rfid': {
      name: 'colabo.colaboware.colaboware_rfid',
      handlers: []
    }
  }

  /**
   * Prefix for all keyboard commands.
   * ** NOTE**: this is currently necessary since we do not isolate the Keyboard class
   * listening for commands while we are typing a regular text inside the node name or content
   */
  KEY_PREFIX:string;

  static MaxId:number = 0;
  keyboardId:number;

  constructor() {
  };

  init(){
  	this.initializeKeyboard();
  }

  /**
   * The function that is called when we are destroying parent.
   * It has to destroy, or at worst disable any subcomponent from working
   */
  destroy(){
  	this.destroyed = true;
  };

  // http://robertwhurst.github.io/keyboardJS/
  initializeKeyboard() {
  	var that = this;
  	this.keyboardId = ++KeyboardRFIDInterface.MaxId;
  	// var this.keyboardLibType = 'KeyboardJS';
  	this.keyboardLibType = 'Kibo';

  	// interaction contexts
  	this.contextStacks = ['*'];
  	this.currentContext = 'colabo.colaboware.colaboware_rfid';
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
  		'colabo.colaboware.colaboware_rfid': {
  			name: 'colabo.colaboware.colaboware_rfid',
  			handlers: []
  		}
  	}

  	switch(this.keyboardLibType){
  		case 'KeyboardJS':
  			this.keyboardLib = keyboardJS;
  			this.keyboardCommand = 'bind';
  			this.keyboardCommandUnbind = 'unbind';
  			this.keyboardSequenceKey = ' + ';
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

  	this.KEY_PREFIX = "ctrl" + this.keyboardSequenceKey;
  }

  enable(){
    this.enabled = true;
  };

  disable(){
    this.enabled = false;
  };

  // registers a keyboard key handler inside the particular context
  // the handler is activated if it is in global or current context
  registerKey(context, key, type, callback){
    var handler = {
      type: type,
      key: key,
      callback: callback
    };

    if(!(context in this.contextualizedHandlers)){
      this.contextualizedHandlers[context] =
      {
        name: context,
        handlers: []
      };
    }
    this.contextualizedHandlers[context].handlers.push(handler);

    if(context == '*' || context == '' || context === this.currentContext){
      this.activateHandler(handler);
    }
  };

  // activate handler
  activateHandler(handler){
    var keyboardCommand = this.keyboardCommand;
    switch(handler.type){
      case 'up':
        keyboardCommand = this.keyboardCommandUp;
        break;
      case 'down':
        keyboardCommand = this.keyboardCommandDown;
        break;
    }

    this.keyboardLib[keyboardCommand](handler.key, function(event){
      if(typeof handler.callback === 'function') handler.callback(event);
    }.bind(this));
  };

  // deactivate handler
  deactivateHandler(handler){
    var keyboardCommandUnbind = this.keyboardCommandUnbind;
    switch(handler.type){
      case 'up':
        this.keyboardCommand = this.keyboardCommandUpUnbind;
        break;
      case 'down':
        this.keyboardCommand = this.keyboardCommandDownUnbind;
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
  activateContext(context){
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
  pushNewContext(context){
    this.contextStacks.push(this.currentContext);
    this.activateContext(context);
  }

  // pops the previous context from the context stack and sets it as an active one
  // (used when we are closing a window popup that is over an active map, or similar scenarious)
  popContext(){
    var context = this.contextStacks.pop();
    this.activateContext(context);
  }
}
