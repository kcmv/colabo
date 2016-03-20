export class TopiChatService {
    plugins:any = {};
    eventsByPlugins:any = {};
    clientInfo:any = {
        clientId: null
    };

    private _isActive:boolean = true;
    private _socket:any;
    private _sfOptions:any;

    // dependencies
    private socketFactory;
    private $rootScope;
    private ENV;

    constructor(socketFactory, $rootScope, ENV) {
        console.log("[TopiChatService] ENV: ", ENV);
        this.socketFactory = socketFactory;
        this.$rootScope = $rootScope;
        this.ENV = ENV;

        // a bit dirty (pointless)
        this.init();
    };

    init() {
        if(!this._isActive) return;

        this._sfOptions = {
            url: this.ENV.server.topichat
        };
        this._socket = this.socketFactory(this._sfOptions);
        // this._socket.forward('broadcast');

        // registering chat plugin
        var systemPluginOptions:any = {
            name: "system",
            events: {
                'tc:client-init': this.clientInit.bind(this)
            }
        };

        this.registerPlugin(systemPluginOptions);
        var msg:any = {
            timestamp: Math.floor(new Date())
        };
        this.emit('tc:client-hello', msg);
    };

    clientInit(eventName, msg, tcPackage) {
        console.log('[TopiChatService:clientInit] Client id: %s', tcPackage.clientId);
        this.clientInfo.clientId = tcPackage.clientId;
    };

    emit(eventName, msg) {
        var tcPackage = {
            clientId: this.clientInfo.clientId,
            msg: msg
        };
        this._socket.emit(eventName, tcPackage);
    };

    registerPlugin(pluginOptions) {
        if(!this._isActive) return;
        var pluginName = pluginOptions.name;
        console.log('[TopiChatService:registerPlugin] Registering plugin: %s', pluginName);
        this.plugins[pluginName] = pluginOptions;
        for(var eventName in pluginOptions.events) {
            if(!(eventName in this.eventsByPlugins)) {
                this.eventsByPlugins[eventName] = [];
                this.registerNewEventType(eventName);
            }
            var eventByPlugins = this.eventsByPlugins[eventName];
            eventByPlugins.push(pluginOptions);
        }
    };

    getPlugins() {
        if(!this._isActive) return undefined;
        return this.plugins;
    };

    registerNewEventType(eventName) {
        console.log("[TopiChatService:registerNewEventType] Registering eventName '%s' for the first time", eventName);
        // for(var eventName in this.eventsByPlugins){
            this._socket.on(eventName, this.dispatchEvent.bind(this, eventName));
        // }
    };

    dispatchEvent(eventName, tcPackage) {
        console.log('[TopiChatService:dispatchEvent] eventName: %s, tcPackage:%s', eventName, JSON.stringify(tcPackage));
        var eventByPlugins = this.eventsByPlugins[eventName];
        for(var id in eventByPlugins) {
            var pluginOptions = eventByPlugins[id];
            var pluginName = pluginOptions.name;

            console.log('\t dispatching to plugin: %s', pluginName);
            var pluginCallback = pluginOptions.events[eventName];
            pluginCallback(eventName, tcPackage.msg, tcPackage);
        }
    };
}
