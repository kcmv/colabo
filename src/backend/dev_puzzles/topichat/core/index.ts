const MODULE_NAME: string = '@colabo-topichat/b-core';

let Http = require('http');
import * as express from "express";
import * as socketio from "socket.io";

enum TopiChatSystemEvents{
	ClientInit = 'tc:client-init',
	ClientEcho = 'tc:client-echo'
}

enum TopiChatClientIDs{
	Server = "server",
	Broadcast = "broadcast"
}

export interface TopiChatPlugin{
	name: string;
	events: {[events: string]: Function}
}

export interface TopiChatPlugins{
	[pluginName: string]: TopiChatPlugin
}

export interface TopiChatEvents{
	[eventName: string]: Array<TopiChatPlugin>
}

export interface TopiChatPluginPackage {
	port: string; // a port that users of the transport plugins are registering to
	payload: any;
}
export interface TopiChatPackage {
	clientIdSender: string;
	iAmIdSender?: string;
	clientIdReciever: string;
	iAmIdReciever?: string;
	timestamp: number; // TODO: make ie everywhere available
	port: string; // the same value as the port/event name we are listening for / sending to in socket.io
	payload: TopiChatPluginPackage;
}

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatCore] Should we debug: ", puzzleConfig.debug);

/* 
SOCKETS
http://localhost:8060/index.html
*/


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
	protected plugins:TopiChatPlugins;
	protected eventsByPlugins:TopiChatEvents;
	protected socketIdToClientId:any;
	protected clientIdToSocket:any;

	/**
	* Instantiate topiChat with name of the room and port
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

	getTimestamp():number {
		return Math.floor(new Date().getTime()/1000);
	}

	time() {
		return new Date().toLocaleTimeString();
	}

	generateUniqueClientId():string {
		let _id:number = this.ClientID++;
		let id:string = "" + _id + "_" + this.getTimestamp();
		return id;
	}

	handleClientConnection(socket) {
		let clientId:string = this.generateUniqueClientId();
		console.log('[TopiChat:handleClientConnection] a new client [%s] connected', clientId);
		console.log('[TopiChat:handleClientConnection] typeof socket.id', typeof socket.id);

		// booking new connection
		this.socketIdToClientId[socket.id] = clientId;
		this.clientIdToSocket[clientId] = socket;
		socket.on('disconnect', this.disconnect.bind(this, socket));

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

		// sending the client-init package back to new client
		let tcPackage:TopiChatPackage = {
			clientIdReciever: clientId,
			clientIdSender: TopiChatClientIDs.Server,
			timestamp: Math.floor(new Date().getTime() / 1000),
			port: TopiChatSystemEvents.ClientInit,
			payload: {
				port: 'default',
				payload: {}
			}
		};
		socket.emit(TopiChatSystemEvents.ClientInit, tcPackage);


		for(let eventName in this.eventsByPlugins){
			socket.on(eventName, this.dispatchEvent.bind(this, eventName, socket));
		}

		// TODO: should not be necessary (we are already registered through systemTopiChatPlugin)
		// socket.on(eventName, TopiChat.prototype.clientChatMessage.bind(this));
	}

	dispatchEvent(eventName:string, socket, tcPackage) {
		console.log('[TopiChat:dispatchEvent] socket.id: %s', socket.id);
		let clientIdSender:string = this.socketIdToClientId[socket.id];
		console.log('[TopiChat:dispatchEvent] clientIdSender [%s] eventName: %s, tcPackage:%s', clientIdSender, eventName, JSON.stringify(tcPackage));
		let eventByPlugins = this.eventsByPlugins[eventName];
		let msg = tcPackage.msg;
		for(let id in eventByPlugins){
			let pluginOptions = eventByPlugins[id];
			let pluginName = pluginOptions.name;

			console.log('\t dispatching to plugin: %s', pluginName);
			let pluginCallback = pluginOptions.events[eventName];
			pluginCallback(eventName, msg, clientIdSender, tcPackage);
		}
	}

	emit(eventName: string, payload: TopiChatPluginPackage, clientIdSender?:string) {
		let tcPackage:TopiChatPackage = {
			clientIdSender: clientIdSender ? 
				clientIdSender : TopiChatClientIDs.Server,
			clientIdReciever: TopiChatClientIDs.Broadcast,
			timestamp: Math.floor(new Date().getTime() / 1000),
			port: eventName,
			payload: payload
		};
		console.log('[TopiChat:emit] emitting event (%s) with message: %s', eventName, JSON.stringify(tcPackage));
		// TODO: support option for demanding broadcasting to everyone, even the sender
		// this.io.emit(eventName, tcPackage); // to everyone

		if(clientIdSender){
			let socketSender = this.clientIdToSocket[clientIdSender];
			socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		}else{
			this.io.emit(eventName, tcPackage); // to everyone
		}
		// socketSender.emit(eventName, tcPackage);
	};

	sendSingle(eventName: string, payload: TopiChatPluginPackage, clientIdSender, clientIdReceiver) {
		let tcPackage:TopiChatPackage = {
			clientIdSender: clientIdSender,
			clientIdReciever: clientIdReceiver,
			timestamp: Math.floor(new Date().getTime() / 1000),
			port: eventName,
			payload: payload,
		};
		console.log('[TopiChat:emit] emitting event (%s) with message: %s', eventName, JSON.stringify(tcPackage));
		// TODO: support option for demanding broadcasting to everyone, even the sender
		// this.io.emit(eventName, tcPackage); // to everyone

		let socketReceiver = this.clientIdToSocket[clientIdReceiver];
		socketReceiver.emit(eventName, tcPackage); // to clientIdReceiver only
	};

	clientEcho(eventName:string, msg:any, clientIdSender) {
		console.log('[TopiChat:clientEcho] event (%s), clientEcho message from clientIdSender [%s] received: %s', eventName, clientIdSender, JSON.stringify(msg));

		let tcPackage:TopiChatPackage = {
			clientIdSender: TopiChatClientIDs.Server,
			clientIdReciever: clientIdSender,
			timestamp: Math.floor(new Date().getTime() / 1000),
			port: TopiChatSystemEvents.ClientEcho,
			payload: {
				port: 'default',
				payload: {
					text: "from server: " + msg.text,
					receivedText: msg.text					
				}
			}
		};
		let socket = this.clientIdToSocket[clientIdSender];
		socket.emit(TopiChatSystemEvents.ClientEcho, tcPackage);
	}

	registerPlugin(pluginOptions:TopiChatPlugin) {
		let pluginName:string = pluginOptions.name;
		console.log('[TopiChat:registerPlugin] Registering plugin: %s', pluginName);
		this.plugins[pluginName] = pluginOptions;
		for(let eventName in pluginOptions.events){
			if(!(eventName in this.eventsByPlugins)){
				this.eventsByPlugins[eventName] = [];
				console.log("[TopiChat:registerPlugin] Registering event: '%s' for the first time", eventName);
			}
			console.log('[TopiChat:registerPlugin] Registering event: %s', eventName);
			let eventByPlugins = this.eventsByPlugins[eventName];
			eventByPlugins.push(pluginOptions);
		}
	};

	// TODO
	unregisterPlugin(pluginName:string) {
		console.log('[TopiChat:unregisterPlugin] Unregistering plugin: %s', pluginName);
	};

	// TODO
	disconnect(socket) {
		let clientId:string = this.socketIdToClientId[socket.id];
		console.log('[TopiChat:handleClientConnection:disconnect] client [%s] disconnected', clientId);

		// TODO: should we remove or keep as "zombie"?
		// this.socketIdToClientId[socket.id] = clientId;
		// this.clientIdToSocket[clientId] = socket;
	};
}