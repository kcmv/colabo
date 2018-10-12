const MODULE_NAME:string = "@colabo-flow/b-topichat";

import {TopiChat, TopiChatPlugin, TopiChatPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[ColaboFlowTopiChat] Should we save chat? saveFlowInteractionToMap = ", puzzleConfig.saveFlowInteractionToMap);
console.log("[ColaboFlowTopiChat] mapId = ", puzzleConfig.mapId);

import {KNode} from '@colabo-knalledge/b-core';

enum KNodesColaboFlowTopiChatTypes{
    ChatMsg = "topiChat.talk.chatMsg"
}

const KNodeModule = require("@colabo-knalledge/b-core/lib/modules/kNode");

let chalk = require('chalk');

// import {ColaboFlowService} from '.';
import {ColaboFlowService} from '@colabo-flow/b-services';

/**
 * This is the main class, the entry point to TopiChat-Talk plugin. To use it, you just need to import `@colabo-topichat/b-talk`:
 *
 * ```ts
 * var topiChatTalk = require('@colabo-topichat/b-talk');
 * ```
 */

enum ColaboFlowTopiChatEvents{
    Action = 'colaboflow:action',
    ActionResponse = 'colaboflow:action_response'
}

export class ColaboFlowTopiChat{
    /**
     * Instantiate topiChat with name of the room and port
     *
     * #### Example usage
     *
     * ```ts
     * var topiChat = new ColaboFlowTopiChat(topiChat);
     *
     * ```
     *
     * @name ColaboFlowTopiChat
     * @constructor
     * @param {String}	roomName The name of the room
     * @param {Integer}	port number that ColaboFlowTopiChat will listen on
     */
    protected cfService;
    protected connResult:any;

    constructor(protected topiChat:TopiChat, protected options?:any) {
        options = options || {};
        this.topiChat = topiChat;
        this.options = options;
        this.cfService = new ColaboFlowService();
        // Connect
        this.connResult = this.cfService.connect();
        this.connResult
            .then(result => console.log(chalk.blue.bold("[ColaboFlowTopiChat] connect finished with result: "), result))
            .catch(error => console.log(chalk.red.bold("[ColaboFlowTopiChat] connect finished with error: "), error));

        console.log('ColaboFlowTopiChat injected in the TopiChat room:%s', this.topiChat.getRoomName());
        var pluginOptions:TopiChatPlugin = {
            name: MODULE_NAME,
            events: {
            }
        };

        pluginOptions.events[ColaboFlowTopiChatEvents.Action] 
		= this.actionMessage.bind(this);

        // 'tc:user-connected': this.userConnected.bind(this),
        // 'tc:user-disconnected': this.userConnected.bind(this),

        this.topiChat.registerPlugin(pluginOptions);
    };

    userConnected(){

    };

    userDisconnected(){

    };

	actionMessage(eventName:string, msg:any, clientIdSender, tcPackage:TopiChatPackage) {
		console.log('[ColaboFlowTopiChat:actionMessage] event (%s), message received: %s', eventName, JSON.stringify(msg));

        // TODO: we want to be able to recieve results even on crash of backend
        // so we want to be able to catch result by new started backend
        // therefore we have manually created queue for results
        // but (TODO), we still do not use it

        // avoid rat race
        // await this.connResult;

        let action:string = msg.content.action;
        let params:string = msg.content.params;
        let sendMsgResult = this.cfService.sendMessage(action, params);

        var msg:any = {
            meta: {
                timestamp: Math.floor(new Date().getTime() / 1000)
            },
            from: {
                name: "Colabo.Space",
                iAmId: "5ba74d9ac1534c5ab492e30f"// this.rimaAAAService.getUserId()
            },
            content: null
        };

        sendMsgResult
            .then((result:any) => {
                console.log(chalk.blue.bold("ColaboFlow action (%s) finished with result: "), action, result);

                let content = {
                    action: action,
                    params: params,
                    result: result
                };
                msg.content = content;
                // should be only to sender (this.topiChat.sendSingle), but it is safer
                // as client might break and client ID can change?! ...
                this.topiChat.emit(ColaboFlowTopiChatEvents.ActionResponse, msg);
            })
            .catch(error => console.log(chalk.red.bold("ColaboFlow action (%s) finished with error: "), action, error));
        
        // return sendMsgResult;

        // let iAmId:string = tcPackage.iAmIdSender || puzzleConfig.defaultIAmId;
        // let chatNode:KNode = new KNode();
        // chatNode.name = msg.content.text;
        // chatNode.mapId = puzzleConfig.mapId;
        // chatNode.iAmId = iAmId;
        // chatNode.type = KNodesColaboFlowTopiChatTypes.ChatMsg;
        // let chatNodeServer:any = chatNode.toServerCopy();
        // KNodeModule._create(chatNodeServer, function(){
        //     if(puzzleConfig.emitMessages){
        // 		console.log('[ColaboFlowTopiChat:clientChatMessage] emitting message');
    	// 	    this.topiChat.emit(eventName, msg, clientIdSender);
        //     }else{
        // 		console.log('[ColaboFlowTopiChat:clientChatMessage] we are NOT emitting message');
        //     }
        // }.bind(this));

        // let socketSender = this.clientIdToSocket[clientIdSender];
		// socketSender.broadcast.emit(eventName, tcPackage); // to everyone except socket owner
		// this.io.emit('tc:chat-message', msg); // to everyone
		// socket.broadcast.emit('tc:chat-message', msg); // to everyone except socket owner
	};

    realtimeMsg(eventName, msg, clientId, tcPackage:TopiChatPackage) {
        console.log('[ColaboFlowTopiChat] event (%s), realtime talk message received from client [%s] : %s', eventName, clientId, JSON.stringify(msg));
        this.topiChat.emit(eventName, msg, clientId);
    };
}