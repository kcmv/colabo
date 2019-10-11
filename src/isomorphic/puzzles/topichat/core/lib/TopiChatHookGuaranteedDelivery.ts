const MODULE_NAME:string = "@colabo-topichat/i-core";

import {TopiChatRegisteringHook, TopiChatHookEvents, TopiChatPlugin} from '..';

export class TopiChatHookGuaranteedDelivery{
	protected messageRetransmitionTimer:number;

    /**
     * @name TopiChatHookGuaranteedDelivery
     * @constructor
     * @param {string}	roomName The name of the room
     * @param {string}	eventName that TopiChatHookGuaranteedDelivery will listen on
     */
    constructor(protected topiChat:TopiChatRegisteringHook, protected options?:any) {
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
        pluginOptions.events[TopiChatHookEvents.PackageSent] 
            = this.packageSent.bind(this);

        // registering to listen for the `TopiChatTalkEvents.Defualt` event
        pluginOptions.events[TopiChatHookEvents.PackageReceived]
            = this.packageReceived.bind(this);

        // 'tc:user-connected': this.userConnected.bind(this),
        // 'tc:user-disconnected': this.userConnected.bind(this),

        this.topiChat.registerHook(pluginOptions);

		this.messageRetransmitionTimer = setInterval(this.messageRetransmitionCallback.bind(this));
    };

    dispose(){
        clearInterval(this.messageRetransmitionTimer);
    }

    packageSent(){

    }

    packageReceived(){

    }

    messageRetransmitionCallback(){

	}
}