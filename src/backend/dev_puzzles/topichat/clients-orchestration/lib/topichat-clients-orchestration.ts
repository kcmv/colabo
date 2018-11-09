const MODULE_NAME: string = "@colabo-topichat/b-clients-orchestration";

import { TopiChat, TopiChatPlugin, TopiChatPackage, TopiChatPluginPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[TopiChatClientsOrchestration] Should we save chat? saveTalkToMap = ", puzzleConfig.saveTalkToMap);
console.log("[TopiChatClientsOrchestration] mapId = ", puzzleConfig.mapId);

enum TopiChatClientsOrchestrationEvents {
    System = 'tc:cl-orch-system',
    Defualt = 'tc:cl-orch-default'
}

enum TopiChatClientsOrchestrationSystemEvents {
    Init = 'system:init'
}
enum TopiChatClientsOrchestrationDefaultEvents {
    Chat = 'default:chat',
    ChatReport = 'default:chat-report',
    Notification = 'default:notification'
}

export interface TopiChatClientsOrchestrationPayload {
    from: {
        name: string; // whoAmI.dataContent.firstName
        iAmId: string;
    };
    content: {
        text: string;
        debugText: string;
    };
}

import {KNode} from '@colabo-knalledge/b-core';

enum KNodesTopiChatClientsOrchestrationTypes{
    OrchestrationMsg = "topiChat.client-orchestrator.orchestratorMsg"
}

const KNodeModule = require("@colabo-knalledge/b-core/lib/modules/kNode");

enum TopiChatClientsOrchestrationEvents{
	ChatMessage = 'tc:client-orchestrator-message'
}

export class TopiChatClientsOrchestration{
    /**
     * Instantiate topiChat with name of the room and port
     *
     * #### Example usage
     *
     * ```ts
     * var topiChat = new TopiChatClientsOrchestration(topiChat);
     *
     * ```
     *
     * @name TopiChatClientsOrchestration
     * @constructor
     * @param {String}	roomName The name of the room
     * @param {Integer}	port number that TopiChatClientsOrchestration will listen on
     */
    constructor(protected topiChat:TopiChat, protected options?:any) {
        options = options || {};
        this.topiChat = topiChat;
        this.options = options;
        console.log('TopiChatClientsOrchestration injected in the TopiChat room:%s', this.topiChat.getRoomName());
        var pluginOptions:TopiChatPlugin = {
            name: MODULE_NAME,
            events: {
            }
        };

        pluginOptions.events[TopiChatClientsOrchestrationEvents.System]
            = this.systemMessage.bind(this);

        pluginOptions.events[TopiChatClientsOrchestrationEvents.Defualt]
            = this.defaultMessage.bind(this);

        // 'tc:user-connected': this.userConnected.bind(this),
        // 'tc:user-disconnected': this.userConnected.bind(this),

        this.topiChat.registerPlugin(pluginOptions);
    };

    userConnected(){

    };

    userDisconnected(){

    };

    systemMessage(eventName: string, cOrchestrationPackage: TopiChatPluginPackage, clientIdSender: string, tcPackage: TopiChatPackage) {
        console.log('[TopiChatClientsOrchestration:systemMessage] event (%s), message received: %s', eventName, JSON.stringify(cOrchestrationPackage));
        let cOrchestrationEvent = cOrchestrationPackage.eventName;
        let cOrchestrationPayload: TopiChatClientsOrchestrationPayload = cOrchestrationPackage.payload;

        // sending the init package back to the new cOrchestration client
        let tcPackageReplay: TopiChatPluginPackage = {
            eventName: TopiChatClientsOrchestrationSystemEvents.Init,
            payload: {
                origin: "@colabo-topichat/b-clients-orchestration",
                text: "Welcome to the ClientsOrchestration Plugin",
                receivedText: cOrchestrationPayload.content.text
            }
        }
        this.topiChat.emit(eventName, tcPackageReplay, tcPackage.clientIdSender, true);
    };

    defaultMessage(eventName: string, cOrchestrationPackage: TopiChatPluginPackage, clientIdSender: string, tcPackage: TopiChatPackage) {
        console.log('[TopiChatClientsOrchestration:defaultMessage] event (%s), message received: %s', eventName, JSON.stringify(cOrchestrationPackage));
        let cOrchestrationEvent = cOrchestrationPackage.eventName;
        let cOrchestrationPayload: TopiChatClientsOrchestrationPayload = cOrchestrationPackage.payload;

        if (puzzleConfig.saveTalkToMap) {
            let iAmId: string = tcPackage.iAmIdSender || puzzleConfig.defaultIAmId;
            let chatNode: KNode = new KNode();
            chatNode.name = cOrchestrationPayload.content.text;
            chatNode.mapId = puzzleConfig.mapId;
            chatNode.iAmId = iAmId;
            chatNode.type = KNodesTopiChatClientsOrchestrationTypes.OrchestrationMsg;
            let chatNodeServer: any = chatNode.toServerCopy();
            KNodeModule._create(chatNodeServer, null, function (kNode: KNode) {
                if (puzzleConfig.emitMessages) {
                    console.log("[TopiChatClientsOrchestration:defaultMessage] forwarding the message to all except sender, cOrchestrationPackage: ", JSON.stringify(cOrchestrationPackage));
                    this.topiChat.emit(eventName, cOrchestrationPackage, clientIdSender);
                } else {
                    console.log('[TopiChatClientsOrchestration:defaultMessage] we are NOT emitting message');
                }

                // sending the init package back to the new talk client
                let tcPackageReplay: TopiChatPluginPackage = {
                    eventName: TopiChatClientsOrchestrationDefaultEvents.ChatReport,
                    payload: {
                        origin: "@colabo-topichat/b-clients-orchestration",
                        text: "We saved your talk message in the KnAllEdgeStorage",
                        receivedText: cOrchestrationPayload.content.text,
                        _id: kNode._id
                    }
                }
                console.log("[TopiChatClientsOrchestration:defaultMessage] seding back to sender, tcPackageReplay: ", JSON.stringify(tcPackageReplay));
                this.topiChat.emit(eventName, tcPackageReplay, tcPackage.clientIdSender, true);
            }.bind(this));
        }else{
            if (puzzleConfig.emitMessages) {
                console.log("[TopiChatClientsOrchestration:defaultMessage] forwarding the message to all except sender, cOrchestrationPackage: ", JSON.stringify(cOrchestrationPackage));
                this.topiChat.emit(eventName, cOrchestrationPackage, clientIdSender);
            } else {
                console.log('[TopiChatClientsOrchestration:defaultMessage] we are NOT emitting message');
            }
        }
        // let socketSender = this.clientIdToSocket[clientIdSender];
        // socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
        // this.io.emit('tc:chat-message', payload); // to everyone
        // socket.broadcast.emit('tc:chat-message', payload); // to everyone except socket owner
    };
}