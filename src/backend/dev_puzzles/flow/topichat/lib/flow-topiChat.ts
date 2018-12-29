const MODULE_NAME:string = "@colabo-flow/b-topichat";

import {TopiChat, TopiChatPlugin, TopiChatPackage} from '@colabo-topichat/b-core';

import {GetPuzzle} from '@colabo-utils/i-config';

let puzzleConfig:any = GetPuzzle(MODULE_NAME);
console.log("[ColaboFlowTopiChat] Should we save chat? saveFlowInteractionToMap = ", puzzleConfig.saveFlowInteractionToMap);
console.log("[ColaboFlowTopiChat] mapId = ", puzzleConfig.mapId);

import {KNode} from '@colabo-knalledge/b-core';

enum KNodesColaboFlowTopiChatTypes{
    Action = "colaboflow.action"
}

import { KNodeModule } from "@colabo-knalledge/b-core";

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
    Action = 'tc:colaboflow:action',
    ActionResponse = 'tc:colaboflow:action_response'
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
            .then(result => console.log(chalk.blue.bold("[ColaboFlowTopiChat] connect finished with result: "), result));
        this.connResult
            .catch(error => console.log(chalk.red.bold("[ColaboFlowTopiChat] connect finished with error: "), error));

        console.log('ColaboFlowTopiChat injected in the TopiChat room:%s', this.topiChat.getRoomName());
        var pluginOptions:TopiChatPlugin = {
            name: MODULE_NAME,
            events: {
            }
        };

        pluginOptions.events[ColaboFlowTopiChatEvents.Action] 
		= this.onActionMessage.bind(this);

        this.topiChat.registerPlugin(pluginOptions);
    };

    sendResponseMessage(action: any, params: any, result: any) {
        var msgResponse: any = {
            meta: {
                timestamp: Math.floor(new Date().getTime() / 1000)
            },
            from: {
                name: "Colabo.Space",
                iAmId: "5ba74d9ac1534c5ab492e30f"// this.rimaAAAService.getUserId()
            },
            content: null
        };

        let content = {
            action: action,
            params: params,
            result: result
        };
        msgResponse.content = content;
        console.log("\t sending '%s' response back to the client", ColaboFlowTopiChatEvents.ActionResponse)
        // TODO
        // should be only to sender (this.topiChat.sendSingle), but it is safer
        // as client might break and client ID can change?! ...
        this.topiChat.emit(ColaboFlowTopiChatEvents.ActionResponse, msgResponse);
    }

    onActionMessage(eventName:string, msg:any, clientIdSender, tcPackage:TopiChatPackage) {
		console.log('[ColaboFlowTopiChat:onActionMessage] event (%s), message received: %s', eventName, JSON.stringify(msg));

        let action: string = msg.content.action;
        let params: string = msg.content.params;

        if (puzzleConfig.mockupQueueAccess){
            console.log('\t: mocking up queue request, and sending back direcly to client');
            // TODO: this is wrong, all the way from similarity service, I guess
            let result = "get_sims_for_user:{'mapId': '5b96619b86f3cc8057216a03', 'iAmId': '5be55e18bee0f4d21b5f367b', 'roundId': 1}";
            this.sendResponseMessage(action, params, result);
        }else{

            // TODO: we want to be able to recieve results even on crash of backend
            // so we want to be able to catch result by new started backend
            // therefore we have manually created queue for results
            // but (TODO), we still do not use it

            // TODO fix this
            // avoid rat race
            // await this.connResult;

            console.log('\t: contacting queue broker (RabbitMQ) throufh the ColaboFlow Service');
            let sendMsgResult = this.cfService.sendMessage(action, params);
            
            sendMsgResult
                .then((result: any) => {
                    console.log(chalk.blue.bold("ColaboFlow action (%s) finished with result: "), action, result);
                    
                    this.sendResponseMessage(action, params, result);

                })
                .catch(error => console.log(chalk.red.bold("ColaboFlow action (%s) finished with error: "), action, error));
        }
        
        // return sendMsgResult;

        // TODO: saving to DB
        // let iAmId:string = tcPackage.iAmIdSender || puzzleConfig.defaultIAmId;
        // let chatNode:KNode = new KNode();
        // chatNode.name = msg.content.text;
        // chatNode.mapId = puzzleConfig.mapId;
        // chatNode.iAmId = iAmId;
        // chatNode.type = KNodesColaboFlowTopiChatTypes.Action;
        // let chatNodeServer:any = chatNode.toServerCopy();
        // KNodeModule._create(chatNodeServer, function(){
        //     if(puzzleConfig.emitMessages){
        // 		console.log('[ColaboFlowTopiChat:clientChatMessage] emitting message');
    	// 	    this.topiChat.emit(eventName, msg, clientIdSender);
        //     }else{
        // 		console.log('[ColaboFlowTopiChat:clientChatMessage] we are NOT emitting message');
        //     }
        // }.bind(this));
	};
}