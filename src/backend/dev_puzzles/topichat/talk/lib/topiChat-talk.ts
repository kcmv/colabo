const MODULE_NAME:string = "@colabo-topichat/b-talk";

import { TopiChat, TopiChatPlugin, TopiChatPackage, TopiChatPluginPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatTalk] Should we save chat? saveTalkToMap = ", puzzleConfig.saveTalkToMap);
console.log("[TopiChatTalk] mapId = ", puzzleConfig.mapId);

/** Events supported by the Talk plugin */
enum TopiChatTalkEvents{
    System = 'tc:talk-system',
	Defualt = 'tc:talk-default'
}

/** the system events our plugin is interested in */
enum TopiChatTalkSystemEvents {
    Init = 'system:init'
}

/** the default events our plugin is interested in */
enum TopiChatTalkDefaultEvents {
    Chat = 'default:chat'
}

/** the payload that the talk plugin will tunnel through the topichat messaging support */
export interface TopiChatTalkPayload {
    /** more detailed info on the sender */
    from: {
        /** name of the sender */
        name: string; // whoAmI.dataContent.firstName
        /** iAm id of the sender */
        iAmId: string;
    };
    /** the content of the text/talk message */
    content: {
        /** the text of the message */
        text: string;
        /** the debug text of the message */
        debugText: string;
        /** is the message delivered, not used at the moment */
        delivered?: boolean;
        /** unique ID of the message */
        uuid?: string;
    };
}

import { KNode } from '@colabo-knalledge/b-core';
import { isRegExp } from 'util';

enum KNodesTopiChatTalkTypes {
    ChatMsg = "topiChat.talk.chatMsg"
}

import { KNodeModule } from "@colabo-knalledge/b-core";

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

        // registering our plugin as a topiChat plugin
        console.log('TopiChatTalk injected in the TopiChat room:%s', this.topiChat.getRoomName());
        var pluginOptions:TopiChatPlugin = {
            name: MODULE_NAME,
            events: {
            }
        };

        // registering to listen for the `TopiChatTalkEvents.System` event
        pluginOptions.events[TopiChatTalkEvents.System] 
    		= this.systemMessage.bind(this);

        // registering to listen for the `TopiChatTalkEvents.Defualt` event
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

    /**
     * The **systemMessage** method responds to the `TopiChatTalkEvents.System` message that gets send to our system
     * @param eventName the `TopiChatTalkEvents.System` in this case
     * @param talkPackage the topichat paylaoad of the message
     * @param clientIdSender id of the sender
     * @param tcPackage the full topichat package of the message
     */
    systemMessage(eventName: string, talkPackage: TopiChatPluginPackage, clientIdSender: string, tcPackage: TopiChatPackage) {
        console.log('[TopiChatTalk:systemMessage] event (%s), message received: %s', eventName, JSON.stringify(talkPackage));
        // let talkEvent = talkPackage.eventName;
        // get the talk plugin payload
        let talkPayload: TopiChatTalkPayload = talkPackage.payload;

        // sending the init package back to the new talk client
        let tcPackageReplay: TopiChatPluginPackage = {
            eventName: TopiChatTalkSystemEvents.Init,
            payload: {
                origin: MODULE_NAME,
                text: "Welcome to the Talk Plugin",
                receivedText: talkPayload.content.text
            }
        }
        this.topiChat.emit(eventName, tcPackageReplay, tcPackage.clientIdSender, true);
    };

    /**
     * The **defaultMessage** method receives default messages from the underlying topichat layer
     * @param eventName 
     * @param talkPackage 
     * @param clientIdSender 
     * @param tcPackage 
     */
    defaultMessage(eventName: string, talkPackage: TopiChatPluginPackage, clientIdSender:string, tcPackage:TopiChatPackage) {
        console.log('[TopiChatTalk:defaultMessage] event (%s), message received: %s', eventName, JSON.stringify(talkPackage));
        let talkEvent = talkPackage.eventName;
        let talkPayload: TopiChatTalkPayload = talkPackage.payload;

        let payLoadText:string;
        let debugText:string;

        // should we save the message to the knalledge map?
        if (puzzleConfig.saveTalkToMap){
            let iAmId: string = tcPackage.iAmIdSender || puzzleConfig.defaultIAmId;
            let chatNode: KNode = new KNode();
            chatNode.name = talkPayload.content.text;
            chatNode.mapId = puzzleConfig.mapId;
            chatNode.iAmId = iAmId;
            chatNode.type = KNodesTopiChatTalkTypes.ChatMsg;
            let chatNodeServer: any = chatNode.toServerCopy();
            KNodeModule._create(chatNodeServer, null, function (kNode: KNode) {
                console.log("[TopiChatTalk:defaultMessage:KNodeModule._create] chatNodeServer saved: ", JSON.stringify(chatNodeServer));

                if (puzzleConfig.emitMessages) {
                    payLoadText = "We saved and forwarded your message";
                } else {
                    payLoadText = "We saved your message";
                }

                debugText = "seding confirmation back to sender";
                sendTheResponseBack();
            }.bind(this));            
        }else{
            sendTheResponseBack();
        }

        // we need to have this in a separate function as one control flow (saving to the knalledge map) is asynchronious, while the other one is not
        function sendTheResponseBack(){
            if (puzzleConfig.emitMessages) {
                console.log("[TopiChatTalk:defaultMessage] forwarding the message to all except sender, talkPackage: ", JSON.stringify(talkPackage));
                this.topiChat.emit(eventName, talkPackage, clientIdSender);
                payLoadText = "We forwarded your message";
            } else {
                console.log('[TopiChatTalk:defaultMessage] we are NOT emitting message');
                payLoadText = "We received your message, but didn't forward";
            }
            
            // sending the confirmation package back to the talk client
            let tcPackageReplay: TopiChatPluginPackage = {
                eventName: TopiChatTalkDefaultEvents.Chat,
                payload: {
                    origin: MODULE_NAME,
                    text: payLoadText,
                    receivedText: talkPayload.content.text,
                    // reference to the sending tcPackage
                    uuid: talkPayload.content.uuid
                }
            }
            debugText = "seding confirmation back to sender";
            console.log("[TopiChatTalk:defaultMessage] %s, tcPackageReplay: ", debugText, JSON.stringify(tcPackageReplay));
            this.topiChat.emit(eventName, tcPackageReplay, tcPackage.clientIdSender, true);
    
            // let socketSender = this.clientIdToSocket[clientIdSender];
            // socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
            // this.io.emit('tc:chat-message', payload); // to everyone
            // socket.broadcast.emit('tc:chat-message', payload); // to everyone except socket owner    
        }
    };

    // realtimeMsg(eventName, talkPackage, clientId, tcPackage:TopiChatPackage) {
    //     console.log('[TopiChatTalk] event (%s), realtime talk message received from client [%s] : %s', eventName, clientId, JSON.stringify(talkPackage));
    //     this.topiChat.emit(eventName, talkPackage, clientId);
    // };
}