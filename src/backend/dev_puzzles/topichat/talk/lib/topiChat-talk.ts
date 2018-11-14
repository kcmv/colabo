const MODULE_NAME:string = "@colabo-topichat/b-talk";

import { TopiChat, TopiChatPlugin, TopiChatPackage, TopiChatPluginPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatTalk] Should we save chat? saveTalkToMap = ", puzzleConfig.saveTalkToMap);
console.log("[TopiChatTalk] mapId = ", puzzleConfig.mapId);

enum TopiChatTalkEvents{
    System = 'tc:talk-system',
	Defualt = 'tc:talk-default'
}

enum TopiChatTalkSystemEvents {
    Init = 'system:init'
}
enum TopiChatTalkDefaultEvents {
    Chat = 'default:chat'
}

export interface TopiChatTalkPayload {
    from: {
        name: string; // whoAmI.dataContent.firstName
        iAmId: string;
    };
    content: {
        text: string;
        debugText: string;
        delivered?: boolean;
        uuid?: string;
    };
}

import { KNode } from '@colabo-knalledge/b-core';
import { isRegExp } from 'util';

enum KNodesTopiChatTalkTypes {
    ChatMsg = "topiChat.talk.chatMsg"
}

const KNodeModule = require("@colabo-knalledge/b-core/lib/modules/kNode");

export class TopiChatTalk{
    /**
     * @name TopiChatTalk
     * @constructor
     * @param {string}	roomName The name of the room
     * @param {string}	eventName that TopiChatTalk will listen on
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

        pluginOptions.events[TopiChatTalkEvents.System] 
		= this.systemMessage.bind(this);

        pluginOptions.events[TopiChatTalkEvents.Defualt]
            = this.defaultMessage.bind(this);

        // 'tc:user-connected': this.userConnected.bind(this),
        // 'tc:user-disconnected': this.userConnected.bind(this),

        this.topiChat.registerPlugin(pluginOptions);
    };

    userConnected(){

    };

    userDisconnected(){

    };

    systemMessage(eventName: string, talkPackage: TopiChatPluginPackage, clientIdSender: string, tcPackage: TopiChatPackage) {
        console.log('[TopiChatTalk:systemMessage] event (%s), message received: %s', eventName, JSON.stringify(talkPackage));
        let talkEvent = talkPackage.eventName;
        let talkPayload: TopiChatTalkPayload = talkPackage.payload;

        // sending the init package back to the new talk client
        let tcPackageReplay: TopiChatPluginPackage = {
            eventName: TopiChatTalkSystemEvents.Init,
            payload: {
                origin: "@colabo-topichat/b-talk",
                text: "Welcome to the Talk Plugin",
                receivedText: talkPayload.content.text
            }
        }
        this.topiChat.emit(eventName, tcPackageReplay, tcPackage.clientIdSender, true);
    };

    defaultMessage(eventName: string, talkPackage: TopiChatPluginPackage, clientIdSender:string, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalk:defaultMessage] event (%s), message received: %s', eventName, JSON.stringify(talkPackage));
        let talkEvent = talkPackage.eventName;
        let talkPayload: TopiChatTalkPayload = talkPackage.payload;

        if (puzzleConfig.saveTalkToMap){
            let iAmId: string = tcPackage.iAmIdSender || puzzleConfig.defaultIAmId;
            let chatNode: KNode = new KNode();
            chatNode.name = talkPayload.content.text;
            chatNode.mapId = puzzleConfig.mapId;
            chatNode.iAmId = iAmId;
            chatNode.type = KNodesTopiChatTalkTypes.ChatMsg;
            let chatNodeServer: any = chatNode.toServerCopy();
            KNodeModule._create(chatNodeServer, null, function (kNode: KNode) {
                if (puzzleConfig.emitMessages) {
                    console.log("[TopiChatTalk:defaultMessage] forwarding the message to all except sender, talkPackage: ", JSON.stringify(talkPackage));
                    this.topiChat.emit(eventName, talkPackage, clientIdSender);
                } else {
                    console.log('[TopiChatTalk:defaultMessage] we are NOT emitting message');
                }

                // sending the confirmation package back to the talk client
                let tcPackageReplay: TopiChatPluginPackage = {
                    eventName: TopiChatTalkDefaultEvents.Chat,
                    payload: {
                        origin: "@colabo-topichat/b-talk",
                        text: "We saved your talk message in the KnAllEdgeStorage",
                        receivedText: talkPayload.content.text,
                        _id: kNode._id,
                        // reference to the sending tcPackage
                        uuid: talkPayload.content.uuid
                    }
                }
                console.log("[TopiChatTalk:defaultMessage] seding confirmation back to sender, tcPackageReplay: ", JSON.stringify(tcPackageReplay));
                this.topiChat.emit(eventName, tcPackageReplay, tcPackage.clientIdSender, true);
            }.bind(this));            
        }else{
            if (puzzleConfig.emitMessages) {
                console.log("[TopiChatTalk:defaultMessage] forwarding the message to all except sender, talkPackage: ", JSON.stringify(talkPackage));
                this.topiChat.emit(eventName, talkPackage, clientIdSender);
            } else {
                console.log('[TopiChatTalk:defaultMessage] we are NOT emitting message');
            }
            
            // sending the confirmation package back to the talk client
            let tcPackageReplay: TopiChatPluginPackage = {
                eventName: TopiChatTalkDefaultEvents.Chat,
                payload: {
                    origin: "@colabo-topichat/b-talk",
                    text: "We saved your talk message in the KnAllEdgeStorage",
                    receivedText: talkPayload.content.text,
                    // reference to the sending tcPackage
                    uuid: talkPayload.content.uuid
                }
            }
            console.log("[TopiChatTalk:defaultMessage] seding confirmation back to sender, tcPackageReplay: ", JSON.stringify(tcPackageReplay));
            this.topiChat.emit(eventName, tcPackageReplay, tcPackage.clientIdSender, true);
        }
		// let socketSender = this.clientIdToSocket[clientIdSender];
		// socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// this.io.emit('tc:chat-message', payload); // to everyone
		// socket.broadcast.emit('tc:chat-message', payload); // to everyone except socket owner
    };

    // realtimeMsg(eventName, talkPackage, clientId, tcPackage:TopiChatPackage) {
    //     console.log('[TopiChatTalk] event (%s), realtime talk message received from client [%s] : %s', eventName, clientId, JSON.stringify(talkPackage));
    //     this.topiChat.emit(eventName, talkPackage, clientId);
    // };
}