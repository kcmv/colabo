var MODULE_NAME = "KnAllEdge";

import {TopiChat, TopiChatPlugin, TopiChatPackage} from '@colabo-topiChat/b-core';

/**
 * This is the main class, the entry point to TopiChat-KnAllEdge plugin. To use it, you just need to import `@colabo-topiChat/b-knalledge`:
 *
 * ```ts
 * var topiChatKnAllEdge = require('`@colabo-topiChat/b-knalledge`');
 * ```
 */

export class TopiChatKnAllEdge{
    /**
     * Instantiate topiChat with name of the room and port
     *
     * #### Example usage
     *
     * ```ts
     * var topiChat = new TopiChatKnAllEdge(topiChat);
     *
     * ```
     *
     * @name TopiChatKnAllEdge
     * @constructor
     * @param {String}	roomName The name of the room
     * @param {Integer}	port number that TopiChatKnAllEdge will listen on
     */
    constructor(protected topiChat:TopiChat, protected options?:any) {
        options = options || {};
        this.topiChat = topiChat;
        this.options = options;
        console.log('TopiChatKnAllEdge injected in the TopiChat room:%s', this.topiChat.getRoomName());
        var pluginOptions:TopiChatPlugin = {
            name: MODULE_NAME,
            events: {
                'tc:user-connected': this.userConnected.bind(this),
                'tc:user-disconnected': this.userConnected.bind(this),
                // 'tc:chat-message': this.chatMessage.bind(this),
                'kn:realtime': this.realtimeMsg.bind(this)
            }
        };
        this.topiChat.registerPlugin(pluginOptions);
    };

    userConnected(){

    };

    userDisconnected(){

    };

    // chatMessage(eventName, msg, clientId, tcPackage) {
    //     console.log('[TopiChatKnAllEdge] event (%s), message received: %s', eventName, JSON.stringify(msg));
    // };

    realtimeMsg(eventName, msg, clientId, tcPackage) {
        console.log('[TopiChatKnAllEdge] event (%s), realtime knalledge message received from client [%s] : %s', eventName, clientId, JSON.stringify(msg));
        this.topiChat.emit(eventName, msg, clientId);
    };
}