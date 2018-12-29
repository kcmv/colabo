const MODULE_NAME:string = "@colabo-topichat/b-talk";

import {TopiChat, TopiChatPlugin, TopiChatPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatTalk] Should we save chat? saveTalkToMap = ", puzzleConfig.saveTalkToMap);
console.log("[TopiChatTalk] mapId = ", puzzleConfig.mapId);

import {KNode} from '@colabo-knalledge/b-core';

enum KNodesTopiChatTalkTypes{
    ChatMsg = "topiChat.talk.chatMsg"
}

import { KNodeModule } from "@colabo-knalledge/b-core";

/**
 * This is the main class, the entry point to TopiChat-Talk plugin. To use it, you just need to import `@colabo-topichat/b-talk`:
 *
 * ```ts
 * var topiChatTalk = require('@colabo-topichat/b-talk');
 * ```
 */

enum TopiChatTalkEvents{
	ChatMessage = 'tc:chat-message'
}

export class TopiChatTalk{
    /**
     * Instantiate topiChat with name of the room and port
     *
     * #### Example usage
     *
     * ```ts
     * var topiChat = new TopiChatTalk(topiChat);
     *
     * ```
     *
     * @name TopiChatTalk
     * @constructor
     * @param {String}	roomName The name of the room
     * @param {Integer}	port number that TopiChatTalk will listen on
     */
    constructor(protected topiChat:TopiChat, protected options?:any) {
        options = options || {};
        this.topiChat = topiChat;
        this.options = options;
        console.log('TopiChatTalk injected in the TopiChat room:%s', this.topiChat.getRoomName());
        var pluginOptions:TopiChatPlugin = {
            name: MODULE_NAME,
            events: {
            }
        };

        pluginOptions.events[TopiChatTalkEvents.ChatMessage] 
		= this.chatMessage.bind(this);

        // 'tc:user-connected': this.userConnected.bind(this),
        // 'tc:user-disconnected': this.userConnected.bind(this),

        this.topiChat.registerPlugin(pluginOptions);
    };

    userConnected(){

    };

    userDisconnected(){

    };

	chatMessage(eventName:string, msg, clientIdSender, tcPackage:TopiChatPackage) {
		console.log('[TopiChatTalk:clientChatMessage] event (%s), message received: %s', eventName, JSON.stringify(msg));

        let chatNode:KNode = new KNode();
        chatNode.name = msg.content.text;
        chatNode.mapId = puzzleConfig.mapId;
        chatNode.iAmId = puzzleConfig.iAmId;
        chatNode.type = KNodesTopiChatTalkTypes.ChatMsg;
        let chatNodeServer:any = chatNode.toServerCopy();
        KNodeModule._create(chatNodeServer, function(){
    		this.topiChat.emit(eventName, msg, clientIdSender);
        }.bind(this));
		// let socketSender = this.clientIdToSocket[clientIdSender];
		// socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// this.io.emit('tc:chat-message', msg); // to everyone
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
	};

    realtimeMsg(eventName, msg, clientId, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalk] event (%s), realtime talk message received from client [%s] : %s', eventName, clientId, JSON.stringify(msg));
        this.topiChat.emit(eventName, msg, clientId);
    };
}