/** a set of topichat system events */
export enum TopiChatSystemEvents{
	ClientInit = 'tc:client-init',
	ClientEcho = 'tc:client-echo'
}

/** recognized standardized client ids */
export enum TopiChatClientIDs{
	Server = "server",
	Broadcast = "broadcast"
}

/** a dictionary of events and their corresponding callbacks */
export interface EventsCallbacks{
	[eventName: string]: PluginDispatchedEventCallback
}

export interface PluginDispatchedEventCallback{
	(eventName: string, talkPackage: TopiChatPluginPackage, clientIdSender:string, tcPackage:TopiChatPackage):void
};

/** description of the topichat plugin with the plugin name, set of events it is interested in, how the topiChat core should behave, etc */
export interface TopiChatPlugin{
	/** plugin name */
	name: string;
	/** dictionary of events */
	events: EventsCallbacks
}

/** a dictionary of plugins
with the key representing the plugin name
and entry poing presenting plugin description */
export interface TopiChatPlugins{
	[pluginName: string]: TopiChatPlugin
}

/** provides mapping between event name and the list of relevant topichat plugins
 (usually plugins that are registered for that event) */
export interface TopiChatEvents{
	[eventName: string]: Array<TopiChatPlugin>
}

/** package description of topichat packages (messages) */
export interface TopiChatPackage {

	/** generated client id of a sender */
	clientIdSender: string;
	/** an id (RIMA.IAm) of a user on which behalf the message is sent
	it is usually the id of the user that is logged in on the client fronted app
	from which the topichat message is sent
	 */
	iAmIdSender?: string;
	/** generated client id of receiver */

	clientIdReciever: string;
	/** an id (RIMA.IAm) of a user whom the message is addressed to
	it is usually the id of the user that is logged in on the client fronted app
	to whom the topichat message is sent to
	 */
    iAmIdReciever?: string;
    /** time the message is generated */

    /** the name of the event that triggered the message.
     * It is the same value as the event name that was placed in the emit method of the socket.io library */
	eventName: string;

	/** message timestamp, in seconds (TODO? probable return into miliseconds) */
	timestamp: number;

	/** The content sent by the message.
     * Its format is described by "higher" protocol, in other words, topichat plugins
     */
	payload: TopiChatPluginPackage;
}

/** 
 * **NOTE**: This part of the package is still not widely evaluated, and accepted. It is a draft for delivery guaranteed messages
*/
export interface TopiChatPackage {
	/** Unique package id, every time a new package is sent it will have different, unique packageUuid */
	packageUuid?:string;
	/** Unique message id (contained in the message). Every time a new message is sent, it will have different, payloadUuid 
	 * however, if the message is resent, as part of guaranteed delivery schema, it will be resent with 
	 * same payloadUuid, but new packageUuid
	*/
	payloadUuid?:string;
}

/** 
 * **NOTE**: This part of the package is still not widely evaluated, and accepted. It is a draft for order guaranteed messages
*/
export interface TopiChatPackage {
	/** This is a unique ordered id of the payload/message that can be used for guaranteed message order */
	payloadCount?:number;
}

/** Package description of the topichat plugin protocol (that sits on the top of the topichat protocol) and it is the payload of the topichat protocol package */
export interface TopiChatPluginPackage {
	/** an eventName that users of the transport plugins are registering to */
	eventName: string;
    /** The content sent by the message.
     * Its format is described by "higher" protocol, in other words, topichat plugins' applications
     */
	payload: any;
}

/** **TopiChatMessagesWithDeliveryContextPull** describes pull with messages */
export interface TopiChatMessagesWithDeliveryContextPull {
	/** the pull name */
	name:string,
	/** should we keep the message after delivering it or we discard it  */
	shouldBeKeptAfterDelivering: boolean,
	/** messages in the pull */
	messages: {
		[payloadUuid:string]:TopiChatMessageWithDeliveryContext
	}
}

/** **TopiChatMessageWithDeliveryContext** describes the status of a message, is it delivered to all recepients, when, etc */
export interface TopiChatMessageWithDeliveryContext {
	/** is the message delivered to all recepients */
	fullyDelivered:boolean,
	/** the time the message got fully delivered to all recepients */
	fullyDeliveredTimestamp:string,
	/** when the message was tried to be delivered to all neccessary recepients */
	lastDeliveryAttemptTimestamp: string,
	deliveredClients: {},
	/** package of the original message */
	tcPackage: TopiChatPackage;
}

/** **TopiChatMessageDeliveryToClientStatus** covers delivery report of a message to particular client */
export interface TopiChatMessageDeliveryToClientStatus{
	/** the id of client the messages is/should be delivered to */
	clientId: string,
	/** is message delivered */
	delivered: boolean,
	/** time the message is delivered to receiver */
	timestamp: string
}

/** interface for topichat service to offer plugins registering possibility 
 * Each plugin will see the topichat service through this interface and access it
*/
export interface TopiChatRegisteringPlugin{
    registerPlugin(pluginOptions:TopiChatPlugin):void;
    getRoomName():string;
    emit(eventName: string, pluginPayload: TopiChatPluginPackage, clientIdSender?:string, onlyToSender?:boolean);
}

/*******************************
 * Hooks related specs
 ******************************/

/** interface for topichat service to offer hooks registering possibility 
 * Each hook will see the topichat service through this interface and access it
*/
export interface TopiChatRegisteringHook{
    registerHook(pluginOptions:TopiChatPlugin):void;
    getRoomName():string;
}

export enum TopiChatHookEvents{
    PackageBeforeSent = "package-before-sent",
    PackageAfterSent = "package-after-sent",
    PackageReceived = "package-received"
}