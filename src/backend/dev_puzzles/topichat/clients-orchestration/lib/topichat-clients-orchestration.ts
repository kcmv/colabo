const MODULE_NAME: string = "@colabo-topichat/b-clients-orchestration";

import {TopiChat, TopiChatPlugin, TopiChatPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatClientOrchestrator] Should we save chat? saveTalkToMap = ", puzzleConfig.saveTalkToMap);
console.log("[TopiChatClientOrchestrator] mapId = ", puzzleConfig.mapId);

import {KNode} from '@colabo-knalledge/b-core';

enum KNodesTopiChatClientOrchestratorTypes{
    ChatMsg = "topiChat.client-orchestrator.chatMsg"
}

const KNodeModule = require("@colabo-knalledge/b-core/lib/modules/kNode");

enum TopiChatClientOrchestratorEvents{
	ChatMessage = 'tc:client-orchestrator-message'
}

export class TopiChatClientOrchestrator{
    /**
     * Instantiate topiChat with name of the room and port
     *
     * #### Example usage
     *
     * ```ts
     * var topiChat = new TopiChatClientOrchestrator(topiChat);
     *
     * ```
     *
     * @name TopiChatClientOrchestrator
     * @constructor
     * @param {String}	roomName The name of the room
     * @param {Integer}	port number that TopiChatClientOrchestrator will listen on
     */
    constructor(protected topiChat:TopiChat, protected options?:any) {
        options = options || {};
        this.topiChat = topiChat;
        this.options = options;
        console.log('TopiChatClientOrchestrator injected in the TopiChat room:%s', this.topiChat.getRoomName());
        var pluginOptions:TopiChatPlugin = {
            name: MODULE_NAME,
            events: {
            }
        };

        pluginOptions.events[TopiChatClientOrchestratorEvents.ChatMessage] 
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
		console.log('[TopiChatClientOrchestrator:clientChatMessage] event (%s), message received: %s', eventName, JSON.stringify(msg));

        let iAmId:string = tcPackage.iAmIdSender || puzzleConfig.defaultIAmId;
        let chatNode:KNode = new KNode();
        chatNode.name = msg.content.text;
        chatNode.mapId = puzzleConfig.mapId;
        chatNode.iAmId = iAmId;
        chatNode.type = KNodesTopiChatClientOrchestratorTypes.ChatMsg;
        let chatNodeServer:any = chatNode.toServerCopy();
        KNodeModule._create(chatNodeServer, function(){
            if(puzzleConfig.emitMessages){
        		console.log('[TopiChatClientOrchestrator:clientChatMessage] emitting message');
    		    this.topiChat.emit(eventName, msg, clientIdSender);
            }else{
        		console.log('[TopiChatClientOrchestrator:clientChatMessage] we are NOT emitting message');
            }
        }.bind(this));
		// let socketSender = this.clientIdToSocket[clientIdSender];
		// socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// this.io.emit('tc:chat-message', msg); // to everyone
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
	};

    realtimeMsg(eventName, msg, clientId, tcPackage:TopiChatPackage) {
        console.log('[TopiChatClientOrchestrator] event (%s), realtime talk message received from client [%s] : %s', eventName, clientId, JSON.stringify(msg));
        this.topiChat.emit(eventName, msg, clientId);
    };
}