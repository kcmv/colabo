# BROADCASTING

**IMPORTANT**: In order to practice/test collaboration we need to enable it (Tools > Moderator: on, Presenter: on)

**IMPORTANT**: Code that is responding to the changes in policy happening in other clients (method  `realTimeMapStylingChanged` in the `knalledgeMap` directive in file `components/knalledgeMap/js/directives.js`) is excluding local broadcasting (`config.broadcasting.enabled`) if another client is broadcasting.

```js
case 'policyConfig.broadcasting.enabled':
    if(msg.value){ // Highlander: There can be only one!
        KnalledgeMapPolicyService.provider.config.broadcasting.enabled = false;
    }
    break;
```

TODO: At the client startup (which is basically switching on) we should broadcast the `config.broadcasting.enabled` to disable other clients.

## TopiChatService

registered in `components/topiChat/topiChatService.ts`

TopiChatService is part of the `topiChat` component. It uses underlying communication layer to provide real time messaging. Currently it uses `socket.io` library with tendency to migrate to another one or to support multiple providers.

The service supports plugins that can be registered with info (name, ...) and set of events they consume, either send or receive messages through them.

For every event that plugin reported interest the service will register the plugin's interest and any time message arrives through that event it will be dispatched to all interested plugins.

NOTE: underlying real-time layer requires knowledge of every event TopiChatService is interested in in order to propagete messages/packages up to TopiChatService. Therefore TopiChatService registeres every new event interest received from plugin to the underlying provider.

**TODO**: should we rename events into pipes or streams?

**Hiererachy**:
+ Plugins with events of interest
+ TopiChatService with list of plugins and events
+ Underlying real-time provider (currently socket.io) with list of events

## Reports/Sniffing

Directive `topichat-reports` provides insight in registered plugins, events, and messages that are passing through the topiChat system.

NOTE: system can register path to the topichat report:

```js
.when('/topichat-report', {
    templateUrl: 'components/topiChat/partials/report-index.tpl.html'
})
```

and provide access to users.

## TopiChat Plugin: KnAllEdgeRealTimeService

+ registered in: `components/knalledgeMap/services.js`
+ topiChat plugin:
    + name: `knalledgeRealTimeService`
    + events:
        + `kn:realtime`

KnAllEdgeRealTimeService registers plugin with TopiChatService and uses event `kn:realtime` for communication.

KnAllEdgeRealTimeService mimics TopiChatService behaviour but on KnAllEdge related space. It also provides registering different plugins and emitting and receiving messages.

KnAllEdge (real-time) plugins are registered throuh call to `KnAllEdgeRealTimeService.registerPlugin`

## KnAllEdge Plugin: mapView

+ registered in: `knalledgeMapDirectives` (`components/knalledgeMap/js/directives.js`) > knalledgeMap
+ knalledgeRealTime plugin:
    + name: `mapView`
    + events:
        + `map-styling-change`
        + `map-viewspec-change`

## KnAllEdge Plugin: mapLayout

+ registered in: `MapLayoutTree` (`js/knalledge/mapLayoutTree.js`)
+ knalledgeRealTime plugin:
    + name: `mapLayout`
    + events:
        + `node-selected`

### Emmiting the `node-selected` event

Event is emitted on the node change inside the `MapLayout.prototype.clickNode` (MapLayout is the super class of the MapLayoutTree class). It happens any time user changes node (either clicking or with keyboard navigation (`js/interaction/keyboard.js`)).

```js
// realtime distribution
if(this.knAllEdgeRealTimeService && !doNotBroadcast){ 	// do not broadcast back :)
	this.knAllEdgeRealTimeService.emit(MapLayout.KnRealTimeNodeSelectedEventName, d.kNode._id);
}
```

### Responding to the `node-selected` event

Listener is registered in MapLayoutTree:

```js
mapLayoutPluginOptions.events[MapLayoutTree.KnRealTimeNodeSelectedEventName] = this.realTimeNodeSelected.bind(this);
```

and the method is implemented in the super class: `MapLayout.prototype.realTimeNodeSelected`. It basically translates the event into an appropriate call for the `MapLayout.prototype.clickNode` method and then calls it.

## KnAllEdge Plugin: KnalledgeMapVOsService

+ registered in: `KnalledgeMapVOsService` (`components/knalledgeMap/js/services.js`) > knalledgeMap
+ knalledgeRealTime plugin:
    + name: `KnalledgeMapVOsService`
    + events (nodes):
        + `node-created`
        + `node-updated`
        + `node-deleted`
        + `nodes-deleted`
    + events (edges):
        + `edge-created`
        + `edge-updated`
        + `edge-deleted`
        + `edges-deleted`


### Usage - emitting

KnalledgeNodeService service for example emits the `node-created` event inside the `resource.execute` method for the case `request.method == 'create'`:

```js
// realtime distribution
if(KnAllEdgeRealTimeService){
    KnAllEdgeRealTimeService.emit(KnRealTimeNodeCreatedEventName, kNodeReturn.toServerCopy());
}
```

### Usage - receiving

KnalledgeNodeService receives all of the messages through all events and dispatches them to all interested parties in the KnaAllEdge ecosystem. It uses GlobalEmitterServicesArray Pub/Sub service to achieve that. Similarly all interested parties registered through the same pub/sub service to receive messages.

After the `KnalledgeMapVOsService` plugin receives event from the knalledgeRealTime service, it handles and transforms message and broadcasts it through the GlobalEmitterServicesArray:


```js
if(shouldBroadcast){
    GlobalEmitterServicesArray.register(eventName);
    GlobalEmitterServicesArray.get(eventName).broadcast('KnalledgeMapVOsService', changes);
}
```

The broadcasted name of the event it uses to broadcast is the same as the knalledgeRealTime name with addiional `-to-visual` sufix which makes provides the following: `node-created` -> `node-created-to-visual`.

Later, this particular event is subscribed in the `knalledgeMap` directive  (`components/knalledgeMap/js/directives.js`) for:

```js
var KnRealTimeNodeCreatedEventName = "node-created-to-visual";
GlobalEmitterServicesArray.register(KnRealTimeNodeCreatedEventName);
```

Finally we are responding to it:
```js
GlobalEmitterServicesArray.get(KnRealTimeNodeCreatedEventName).subscribe('knalledgeMap', knalledgeMap.processExternalChangesInMap.bind(knalledgeMap));
```

which calls `knalledge.Map.prototype.processExternalChangesInMap` method.

TODO: 'node-deleted', ... responses are still not implemented although it is being emitted:

```js
KnAllEdgeRealTimeService.emit(KnRealTimeNodeDeletedEventName, id);
```

in the `destroy` method of the `KnalledgeNodeService` service.

## GlobalEmitterServicesArray - Global Pub/Sub services in KnAllEdge system

+ GlobalEmitterServicesArray: `components/collaboPlugins/globalEmitterServicesArray.ts`
+ GlobalEmitterService: `components/collaboPlugins/globalEmitterService.ts`

After KnAllEdge migrated from ng1 to ng2 (hybrid state at the moment) we have created standard pub/sub mechanism that is developed on the top of the Angular 2 `EventEmitter`.

KnAllEdge provides `GlobalEmitterServicesArray` service that relies on `GlobalEmitterService` to provide a named set of events. This means that a producer can `register` particular named event and then `broadcast` through that event, while a consumer can `subscribe` to the same named event and listen for messages broadcasted.

# Debugging scenario

## Disabling broadcasting of the Presenter switch

We wanted to disable broadcasting of the **Presenter switch** (`policyConfig.broadcasting.enabled`).

We went to the template with the switch: `components/knalledgeMap/partials/tools.tpl.html` and found:

```html
<md-switch class="md-primary" aria-label="Presenter" [(checked)]="policyConfig.broadcasting.enabled" (checkedChange)="viewConfigChanged('policyConfig.broadcasting.enabled', policyConfig.broadcasting.enabled)">Presenter</md-switch>
```

in the component class ``

we have found function `viewConfigChanged`:

```js
viewConfigChanged:Function = function(path, value){
    // alert("[viewConfigChanged] " + path + ":" + value);
    let msg = {
        path: path,
        value: value
    };

    this.globalEmitterServicesArray.get(this.mapStylingChangedEventName).broadcast('KnalledgeMapTools', msg);
};
```

so in the same class, we have found the name of the event `mapStylingChangedEvent`:
```js
export class KnalledgeMapTools {
    mapStylingChangedEventName:string = "mapStylingChangedEvent";
```

Now we can search in the `app` folder for any occurence of the `mapStylingChangedEvent` event to see who is listening for it. We find only one place where we are listening for the event, and it is in the `knalledgeMap` directive in file `components/knalledgeMap/js/directives.js`.

```js
var mapStylingChangedEventName = "mapStylingChangedEvent";
GlobalEmitterServicesArray.get(mapStylingChangedEventName).subscribe('knalledgeMap', function(msg) {
    setData(model);
    console.log("[knalledgeMap.controller::$on] event: %s", mapStylingChangedEventName);
    knalledgeMap.update();
    // realtime distribution
    if(KnAllEdgeRealTimeService && msg.path != "policyConfig.broadcasting.enabled"){ //TODO: check this?!
        KnAllEdgeRealTimeService.emit(KnRealTimeMapStylingChangedEventName, msg);
    }
});
```

So we see that `map-styling-change` event (the value of var KnRealTimeMapStylingChangedEventName) is emitted through the KnAllEdgeRealTimeService service.

Just next to it we have a code for receiving the event (coming from other client)
```js
// realtime listener registration
if(KnAllEdgeRealTimeService){
    var realTimeMapStylingChanged = function(eventName, msg){
        switch(msg.path){
            case 'config.nodes.showImages':
                knalledgeMapViewService.provider.config.nodes.showImages = msg.value;
                break;
            case 'config.nodes.showTypes':
                knalledgeMapViewService.provider.config.nodes.showTypes = msg.value;
                break;
            case 'config.edges.showNames':
                knalledgeMapViewService.provider.config.edges.showNames = msg.value;
                break;
            case 'config.edges.showTypes':
                knalledgeMapViewService.provider.config.edges.showTypes = msg.value;
                break;
        }
        knalledgeMap.update();
    };

    // ...
    var mapViewPluginOptions = {
        name: "mapView",
        events: {
        }
    };
    mapViewPluginOptions.events[KnRealTimeMapStylingChangedEventName] = realTimeMapStylingChanged.bind(this);
    KnAllEdgeRealTimeService.registerPlugin(mapViewPluginOptions);
}
```

# TODO

## Move all registrations from directives into services

In this way we will be able to listen before directive is placed in active view, and we would be able to track them in `topichat-report` even if we are not on the particular page

+ `tc:chat-message`
+

# BROADCAST participants

should broadcast be sent or received is controlled by specific switches in
```js
KnalledgeMapPolicyService. config: {
            broadcasting: {
              enabled: false, //broaadcasting toward receviers
              receiveNavigation: true, //going through map (changing selected nodes), ...
              receiveStructural: true, //knawledge management (creation, delete, ....)
              receiveVisualization: true, //changes in view settings (showIMages, showNodes, limit range of visible nodes, IBIS, etc)
              receiveBehaviours: true, //receive changes in behaviours/modes (broadcasting, etc)
          }
```

**TODO**: we should probably introduce an independent `BroadcastingManager`

+ **Structural changes** in map
  + sent by and received (`externalChangesInMap`) by `KnalledgeMapVOsService`<BR/>
  + Controlled by `receiveStructural`
  + _Events_:
    + `node-created`
    + `node-updated`
    + `node-deleted`
+ **Navigations**
  + Controlled by `receiveNavigation`
  + sent by ?.
  + Received by `MapLayout.prototype.realTimeNodeSelected`
  + _Events_:
    +  `MapLayout.KnRealTimeNodeSelectedEventName = "node-selected"`
+ **Visualization** changes (changes in Display)
  + Controlled by `receiveVisualization`
  + sent and received by `knalledgeMap` directive
  + _Events_:
    +  `map-viewspec-change`<BR/>
    (specific visual settings are differentiated by msg.path)<BR/>
    `var KnRealTimeMapViewSpecChangedEventName = "map-viewspec-change";`
# EXAMPLE
+ at the **broadcaster client**, in the `service`, when specific action is done locally (and on server), we call `KnAllEdgeRealTimeService` to emit it to receivers:
```js
KnAllEdgeRealTimeService.emit(KnRealTimeNodeCreatedEventName, kNodeReturn.toServerCopy());
```
+ at the **receiver client**, in the same `service` we have registered appropriate function (in our case `externalChangesInMap` from the same service) to handle the event received by `KnAllEdgeRealTimeService`
```js
KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeCreatedEventName] = provider.externalChangesInMap.bind(provider);
KnalledgeMapVOsServicePluginOptions.events[KnRealTimeNodeDeletedEventName] = provider.externalChangesInMap.bind(provider);
```
+ specific steps:
  + **'create Node' broadcasting**
    + we create new kNode based on the received on in `msg` and we add that node in the `service`'s `this.nodesById` and we put that node in `changes.nodes` array
  + **'delete Node' broadcasting**
    + we delete kNode from the `service`'s `this.nodesById` found by the received `msg._id` and we put that node in `changes.nodes` array
+ at the end of the receiver function (`externalChangesInMap`) we broadcast appropriate intra-client event (e.g. `node-created-to-visual` or `node-deleted-to-visual`) by using `GlobalEmitterServicesArray` and sending `changes` to receiver (which in this case are upper layers (of the same **receiver client**) that care for visual representation of structural changes)
```js
GlobalEmitterServicesArray.register(eventName);
GlobalEmitterServicesArray.get(eventName).broadcast('KnalledgeMapVOsService', changes);
```
+ `knalledgeMap directive`, registers the receiver of the **intra-client event** (event not broadcasted to other client but between components of the same client) broadcasted in the previous step:
```js
var KnRealTimeNodeCreatedEventName = "node-created-to-visual";
GlobalEmitterServicesArray.register(KnRealTimeNodeCreatedEventName);
...
GlobalEmitterServicesArray.get(KnRealTimeNodeCreatedEventName).subscribe('knalledgeMap', knalledgeMap.processExternalChangesInMap.bind(knalledgeMap));
```
(`knalledgeMap` is instance of `Map` class, so its method `processExternalChangesInMap` will receive it)
+ based on that, `Map.processExternalChangesInMap` method receives event and calls
`MapStructure.processSyncedData(changes)`
+ `MapStructure.processSyncedData(changes)` goes through `changes` and for each node and edge in it, if it's a newly created one, it creates new VkNode/VkEdge and adds them to `MapStructure`'s lists `nodesById` and `edgesById`. If it's only updated one, it fills it with the new content
+

# Libraries support

## Socket.io

### reliability

+ http://stackoverflow.com/questions/20685208/websocket-transport-reliability-socket-io-data-loss-during-reconnection
+ http://stackoverflow.com/questions/11732837/socket-io-confirmed-delivery
+ https://github.com/share/ShareJS/issues/375
+ https://github.com/capriza/socketgd
+ http://stackoverflow.com/questions/15410267/does-socket-io-garantee-that-broadcasted-events-are-received-in-order-client-sid
+ http://stackoverflow.com/questions/14933868/message-ordering-in-socket-io
