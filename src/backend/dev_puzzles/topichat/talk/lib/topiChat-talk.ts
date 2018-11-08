const MODULE_NAME:string = "@colabo-topichat/b-talk";

import { TopiChat, TopiChatPlugin, TopiChatPackage, TopiChatPluginPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatTalk] Should we save chat? saveTalkToMap = ", puzzleConfig.saveTalkToMap);
console.log("[TopiChatTalk] mapId = ", puzzleConfig.mapId);

enum TopiChatTalkPorts{
    System = 'tc:talk-system',
	Defualt = 'tc:talk-default'
}
enum TopiChatTalkSystemPorts {
    Init = 'system:init'
}
enum TopiChatTalkDefaultPorts {
    Chat = 'default:chat'
}

export interface TopiChatTalkPayload {
    from: {
        name: string; // whoAmI.dataContent.firstName
        iAmId: string;
    };
    content: {
        text: string;
    };
}

import { KNode } from '@colabo-knalledge/b-core';

enum KNodesTopiChatTalkTypes {
    ChatMsg = "topiChat.talk.chatMsg"
}

const KNodeModule = require("@colabo-knalledge/b-core/lib/modules/kNode");

export class TopiChatTalk{
    /**
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

        pluginOptions.events[TopiChatTalkPorts.Defualt] 
		= this.defaultMessage.bind(this);

        // 'tc:user-connected': this.userConnected.bind(this),
        // 'tc:user-disconnected': this.userConnected.bind(this),

        this.topiChat.registerPlugin(pluginOptions);
    };

    userConnected(){

    };

    userDisconnected(){

    };

    defaultMessage(port: string, talkPackage: TopiChatPluginPackage, clientIdSender:string, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalk:clientChatMessage] event (%s), message received: %s', port, JSON.stringify(talkPackage));
        let talkPort = talkPackage.port;
        let talkPayload: TopiChatTalkPayload = talkPackage.payload;

        let iAmId:string = tcPackage.iAmIdSender || puzzleConfig.defaultIAmId;
        let chatNode:KNode = new KNode();
        chatNode.name = talkPayload.content.text;
        chatNode.mapId = puzzleConfig.mapId;
        chatNode.iAmId = iAmId;
        chatNode.type = KNodesTopiChatTalkTypes.ChatMsg;
        let chatNodeServer:any = chatNode.toServerCopy();
        KNodeModule._create(chatNodeServer, function(){
            if(puzzleConfig.emitMessages){
        		console.log('[TopiChatTalk:clientChatMessage] emitting message');
                this.topiChat.emit(port, talkPackage, clientIdSender);
            }else{
        		console.log('[TopiChatTalk:clientChatMessage] we are NOT emitting message');
            }
        }.bind(this));
		// let socketSender = this.clientIdToSocket[clientIdSender];
		// socketSender.broadcast.emit(port, tcPackage); // to everyone except socket owner
		// this.io.emit('tc:chat-message', payload); // to everyone
		// socket.broadcast.emit('tc:chat-message', payload); // to everyone except socket owner
	};

    realtimeMsg(port, talkPackage, clientId, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalk] event (%s), realtime talk message received from client [%s] : %s', port, clientId, JSON.stringify(talkPackage));
        this.topiChat.emit(port, talkPackage, clientId);
    };
}