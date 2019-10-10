const MODULE_NAME: string = '@colabo-topichat/b-core';

let Http = require('http');
import * as express from "express";
// socket,io documentation
// https://socket.io/docs/emit-cheatsheet/
// https://socket.io/docs/
import * as socketio from "socket.io";

/** a set of topichat system events */
enum TopiChatSystemEvents{
	ClientInit = 'tc:client-init',
	ClientEcho = 'tc:client-echo'
}

/** recognized standardized client ids */
enum TopiChatClientIDs{
	Server = "server",
	Broadcast = "broadcast"
}

/** a dictionary of events and their corresponding callbacks */
export interface EventsCallbacks{
	[eventName: string]: PluginDispatchedEventCallback
}

export interface PluginDispatchedEventCallback{
	(eventName: string, talkPackage: TopiChatPluginPackage, clientIdSender:string, tcPackage:TopiChatPackage):void
};

/** description of the topichat plugin with the plugin name, set of events it is interested in, how the topiChat core should behave, etc */
export interface TopiChatPlugin{
	/** plugin name */
	name: string;
	/** dictionary of events */
	events: EventsCallbacks
}

/** a dictionary of plugins
with the key representing the plugin name
and entry poing presenting plugin description */
export interface TopiChatPlugins{
	[pluginName: string]: TopiChatPlugin
}

/** provides mapping between event name and the list of relevant topichat plugins
 (usually plugins that are registered for that event) */
export interface TopiChatEvents{
	[eventName: string]: Array<TopiChatPlugin>
}

/** package description of topichat packages (messages) */
export interface TopiChatPackage {
	/** generated client id of a sender */
	clientIdSender: string;
	/** an id (RIMA.IAm) of a user on which behalf the message is sent
	it is usually the id of the user that is logged in on the client fronted app
	from which the topichat message is sent
	 */
	iAmIdSender?: string;
	/** generated client id of receiver */
	clientIdReciever: string;
	/** an id (RIMA.IAm) of a user whom the message is addressed to
	it is usually the id of the user that is logged in on the client fronted app
	to whom the topichat message is sent to
	 */
    iAmIdReciever?: string;
    /** time the message is generated */
    timestamp: number; // TODO: make ie everywhere available
    /** the name of the event that triggered the message.
     * It is the same value as the event name that was placed in the emit method of the socket.io library */
    eventName: string;
    /** The content sent by the message.
     * Its format is described by "higher" protocol, in other words, topichat plugins
     */
	payload: TopiChatPluginPackage;
}

/** Package description of the topichat plugin protocol (that sits on the top of the topichat protocol) and it is the payload of the topichat protocol package */
export interface TopiChatPluginPackage {
	/** an eventName that users of the transport plugins are registering to */
	eventName: string;
    /** The content sent by the message.
     * Its format is described by "higher" protocol, in other words, topichat plugins' applications
     */
	payload: any;
}

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatCore] Should we debug: ", puzzleConfig.debug);

/* 
SOCKETS
http://localhost:8060/index.html
*/

interface SocketIdToClientId{
	[id:string]:string
}

interface ClientIdToSocket{
	[id:string]:socketio.Socket
}

/**
 * This is the main class, the entry point to TopiChat. To use it, you just need to import topiChat:
 *
 * ```js
 * let TopiChat = require('topiChat');
 * ```
 *
 * In addition to topiChat, the messaging pluginsfor the dialogue dialects you want to use should also be installed in your project
 *
 * @class TopiChat
 */
export class TopiChat{
	protected options:any;
	protected app:any;
	protected ClientID:number;
	protected roomName:string;
	protected http: any;
	protected io: any;
	/** a dictionary (by plugin name) of all registered plugins */
	protected plugins:TopiChatPlugins;
	/** maps the event (name) to the array of topichat plugins interested in that event */
	protected eventsByPlugins:TopiChatEvents;
	/** maps socket.io socket ids with client ids */
	protected socketIdToClientId:SocketIdToClientId;
	protected clientIdToSocket:ClientIdToSocket;

	/**
	* Instantiate topiChat with name of the room and eventName
	*
	* #### Example usage
	*
	* ```javascript
	* let topiChat = new TopiChat('CollaboScience', 8061);
	*
	* ```
	*
	* @name TopiChat
	* @constructor
	* @param {String}	roomName The name of the room
	* @param {any}	options additional optiona
	*/
	constructor(roomName, _options?:any){
		let _optionsL = {
			'pingInterval': 2000, // ms
			'pingTimeout': 5000 // ms
		};

		this.ClientID = 0.0;
		this.roomName = roomName;
		this.options = _options || _optionsL;
		this.plugins = {};
		this.eventsByPlugins = {};
		this.socketIdToClientId = {};
		this.clientIdToSocket = {};

		let systemTopiChatPlugin:TopiChatPlugin = {
			name: "system",
			events: {}
		};

		// register ourselves (method `clientEcho`) to respond to the `TopiChatSystemEvents.ClientEcho` event
		systemTopiChatPlugin.events[TopiChatSystemEvents.ClientEcho] 
		= this.clientEcho.bind(this);

		this.registerPlugin(systemTopiChatPlugin);
	}

	/**
	* Returns a room name
	*/
	getRoomName():string {
		return this.roomName;
	}

	/**
	* Connects to the TopiChat (socket.io) backend
	* @method connect
	* @param {}	server Node.js http server
	*/
	connect(httpServer) {
		this.io = socketio(httpServer, this.options);

		this.io.on('connection', function(socket){
			this.handleClientConnection(socket);
		}.bind(this));
	}

	// gets the timestamp of the message in seconds
	getTimestamp():number {
		return Math.floor(new Date().getTime()/1000);
	}

	// return local time
	time() {
		return new Date().toLocaleTimeString();
	}

	// get the unique client id concatenating incremental client id 
	// together with the current time
	generateUniqueClientId():string {
		let _id:number = this.ClientID++;
		let id:string = "" + _id + "_" + this.getTimestamp();
		return id;
	}

	handleClientConnection(socket:socketio.Socket) {
		// get new client ID for the newly opened socket
		// later we should support recovering connections through session + user id
		// (https://github.com/Cha-OS/colabo/issues/482)
		let clientId:string = this.generateUniqueClientId();
		console.log('[TopiChat:handleClientConnection] a new client [%s] connected', clientId);
		console.log('[TopiChat:handleClientConnection] typeof socket.id', typeof socket.id);

		// bidirectional booking new connection
		this.socketIdToClientId[socket.id] = clientId;
		this.clientIdToSocket[clientId] = socket;
		socket.on('disconnect', this.disconnect.bind(this, socket));

		// debug ping-ponging
		socket.conn.on('ping', function () {
			if (puzzleConfig.debug) console.log('[%s] Ping sent to the client', this.time());
		}.bind(this));
		socket.conn.on('pong', function () {
			if (puzzleConfig.debug) console.log('[%s] Pong received from the client', this.time());
		}.bind(this));

		// https://socket.io/docs/server-api/#socket-conn
		// https://www.npmjs.com/package/engine.io#socket
		socket.conn.on('close', function (reason, desc) {
			if (puzzleConfig.debug) console.log("[%s] Client Closed: %s", this.time(), reason);
		}.bind(this));
		socket.conn.on('error', function (error) {
			if (puzzleConfig.debug) console.log("[%s] Error: %s", this.time(), error);
		}.bind(this));
		socket.conn.on('flush', function (writeBuffer) {
			if (puzzleConfig.debug) console.log("[%s] write buffer is being flushed", this.time());
		}.bind(this));
		socket.conn.on('drain', function () {
			if (puzzleConfig.debug) console.log("[%s] write buffer is drained", this.time());
		}.bind(this));
		// https://github.com/socketio/engine.io/blob/master/lib/socket.js#L91
		socket.conn.on('packet', function (packet) {
			if (puzzleConfig.debug) console.log("[%s] packet received. type: %s, data: %s", this.time(), packet.type, packet.data);
		}.bind(this));
		socket.conn.on('packetCreate', function (packet) {
			if (puzzleConfig.debug) console.log("[%s] packet about to be sent. type: %s, data: %s", this.time(), packet.type, packet.data);
		}.bind(this));

		// sending the client-init package back to the new client
		let tcPackage:TopiChatPackage = {
			clientIdReciever: clientId,
			clientIdSender: TopiChatClientIDs.Server,
			timestamp: this.getTimestamp(),
			eventName: TopiChatSystemEvents.ClientInit,
			payload: {
				eventName: 'default',
				payload: {
					origin: '@colabo-topichat/b-core',
					text: 'Welcome to the topichat service!'
				}
			}
		};
		socket.emit(TopiChatSystemEvents.ClientInit, tcPackage);


		// register all plugins on the new socket with all events that they are interested in
		// so the core TopiChat component (`this.dispatchEvent`) will be triggered when a message arrives
		// and then it will be propagated further
		for(let eventName in this.eventsByPlugins){
			socket.on(eventName, this.dispatchEvent.bind(this, eventName, socket));
		}
	}

	/**
	 * **dispatchEvent** is the bottom (core) dispatcher that is triggered when any new message arrives
	 * it will propagate the message further to plugins through their registered callbacks
	 * @param eventName the name of the event
	 * @param socket the socket over which the event arrived
	 * @param tcPackage the package payload of the event
 	*/
	dispatchEvent(eventName: string, socket:socketio.Socket, tcPackage: TopiChatPackage) {
		console.log('[TopiChat:dispatchEvent] socket.id: %s', socket.id);
		// resolve the client ID of the sender (based on the socket id)
		let clientIdSender:string = this.socketIdToClientId[socket.id];
		console.log('[TopiChat:dispatchEvent] clientIdSender [%s] eventName: %s, tcPackage:%s', clientIdSender, eventName, JSON.stringify(tcPackage));

		// get all plugins that are interested in the event
		let eventByPlugins = this.eventsByPlugins[eventName];
		// extract the package payload from the topiChat payload
		let pluginPayload: TopiChatPluginPackage = tcPackage.payload;
		for(let id in eventByPlugins){
			let pluginOptions:TopiChatPlugin = eventByPlugins[id];
			let pluginName = pluginOptions.name;

			console.log('\t dispatching to plugin: %s', pluginName);
			// get the plugin's callback and
			let pluginCallback:PluginDispatchedEventCallback = pluginOptions.events[eventName];
			// call it with all data
			pluginCallback(eventName, pluginPayload, clientIdSender, tcPackage);
		}
	}

	/**
	 * **Emit** method sends package / message to the receiver(s)
	 * @param eventName the name of the event that the message is sent for
	 * @param pluginPayload the payload coming from the topichat plugin that sent the message on behalf of the higher protocol (topichat plugin's application)
	 * @param clientIdSender id of the client on whose behalf the message is sent
	 * @param onlyToSender are we sending the message only to sender or we are broadcasting it
	 */
	emit(eventName: string, pluginPayload: TopiChatPluginPackage, clientIdSender?:string, onlyToSender:boolean=false) {
		let tcPackage:TopiChatPackage = {
			// if the sender is not specified, then the `server` is the sender
			clientIdSender: clientIdSender ? 
				clientIdSender : TopiChatClientIDs.Server,
			// the message is broadcasted to everyone
			clientIdReciever: TopiChatClientIDs.Broadcast,
			// current time
			timestamp: this.getTimestamp(),
			eventName: eventName,
			payload: pluginPayload
		};
		console.log('[TopiChat:emit] emitting event (%s) with message: %s', eventName, JSON.stringify(tcPackage));
		// TODO: support option for demanding broadcasting to everyone, even the sender
		// this.io.emit(eventName, tcPackage); // to everyone

		// we are not broadcasting to everyone, but ...
		if(clientIdSender){
			// get the socket of the message sender
			let socketSender:socketio.Socket = this.clientIdToSocket[clientIdSender];
			if (socketSender) {
				// we send only to sender, through its own socket
				if (onlyToSender) {
					console.log('\t only to sender'); // socket owner
					socketSender.emit(eventName, tcPackage);
				// we send to everyone, except sender, identified by its socket
				} else {
					console.log('\t to everyone, except socket owner');
					socketSender.broadcast.emit(eventName, tcPackage);
				}
			} else {
				console.error("Error: We couldn't match sender to its socket. For the 'clientIdSender:%s' the this.clientIdToSocket[clientIdSender] returns null", clientIdSender);
			}
		// we are broadcasting the message to all clients/sockets
		}else{
			console.log('\t to everyone');
			this.io.emit(eventName, tcPackage);
		}
		// socketSender.emit(eventName, tcPackage);
	};

	/**
	 * The **sendSingle** method is similar to the **emit** method but it sends only to one client (receiver)
	 * 
	 * **TODO** unite these two methods in a single method?
	 * @param eventName the name of the event that the message is sent for
	 * @param pluginPayload the payload coming from the topichat plugin that sent the message on behalf of the higher protocol (topichat plugin's application)
	 * @param clientIdSender id of the client on whose behalf the message is sent
	 * @param clientIdReceiver id of the client to whom the message should be sent
	 */
	sendSingle(eventName: string, pluginPayload: TopiChatPluginPackage, clientIdSender, clientIdReceiver) {
		let tcPackage:TopiChatPackage = {
			clientIdSender: clientIdSender,
			clientIdReciever: clientIdReceiver,
			timestamp: this.getTimestamp(),,
			eventName: eventName,
			payload: pluginPayload,
		};
		console.log('[TopiChat:emit] emitting event (%s) with message: %s', eventName, JSON.stringify(tcPackage));

		// resolve the socket from the client ID
		let socketReceiver = this.clientIdToSocket[clientIdReceiver];
		if (socketReceiver){
			socketReceiver.emit(eventName, tcPackage); // to clientIdReceiver only
		}else{
			console.error("Error for the 'clientIdReceiver:%s' the this.clientIdToSocket[clientIdReceiver] returns null", clientIdReceiver);
		}
	};

	/**
	 * **clientEcho** is an event handler for the client echo event (`TopiChatSystemEvents.ClientEcho`)
	 * @param eventName the event name that triggered the message (`TopiChatSystemEvents.ClientEcho` in this case)
	 * @param tcPayload the package that is sent
	 * @param clientIdSender 
	 */
	clientEcho(eventName: string, tcPayload: TopiChatPluginPackage, clientIdSender:string) {
		console.log('[TopiChat:clientEcho] event (%s), clientEcho message from clientIdSender [%s] received: %s', eventName, clientIdSender, JSON.stringify(tcPayload));
		let tcPluginPayload: any = tcPayload.payload;

		let tcPackage:TopiChatPackage = {
			clientIdSender: TopiChatClientIDs.Server,
			clientIdReciever: clientIdSender,
			timestamp: this.getTimestamp(),
			eventName: TopiChatSystemEvents.ClientEcho,
			payload: {
				eventName: 'default',
				payload: {
					text: "from server: " + tcPluginPayload.text,
					receivedText: tcPluginPayload.text					
				}
			}
		};
		let socket = this.clientIdToSocket[clientIdSender];
		socket.emit(TopiChatSystemEvents.ClientEcho, tcPackage);
	}

	/**
	 * The **registerPlugin** method registers plugins into topichat.
	 * 
	 * @param pluginOptions describes all aspects of the plugin we want to register, like name, events we want to listen, 
	 * wanted behavior of the underlying (core) topichat component
	 */
	registerPlugin(pluginOptions:TopiChatPlugin) {
		let pluginName:string = pluginOptions.name;
		console.log('[TopiChat:registerPlugin] Registering plugin: %s', pluginName);
		// place the plugin in the `plugins` dictionary
		this.plugins[pluginName] = pluginOptions;

		// iterate through the all events plugin is interested in
		// and register them into the `eventByPlugins` 
		// where each event contains the array of plugins (pluginOptions) listening to the event
		for(let eventName in pluginOptions.events){
			// if the dictionary key is missing, create it
			if(!(eventName in this.eventsByPlugins)){
				this.eventsByPlugins[eventName] = [];
				console.log("[TopiChat:registerPlugin] Registering event: '%s' for the first time", eventName);
			}
			console.log('[TopiChat:registerPlugin] Registering event: %s', eventName);
			let eventByPlugins = this.eventsByPlugins[eventName];
			// push it into the array corresponding to the event
			eventByPlugins.push(pluginOptions);
		}
	};

	// TBD
	unregisterPlugin(pluginName:string) {
		console.log('[TopiChat:unregisterPlugin] Unregistering plugin: %s', pluginName);
	};

	// TBD
	disconnect(socket) {
		let clientId:string = this.socketIdToClientId[socket.id];
		console.log('[TopiChat:handleClientConnection:disconnect] client [%s] disconnected', clientId);

		// TODO: should we remove or keep as "zombie"?
		// this.socketIdToClientId[socket.id] = clientId;
		// this.clientIdToSocket[clientId] = socket;
	};
}