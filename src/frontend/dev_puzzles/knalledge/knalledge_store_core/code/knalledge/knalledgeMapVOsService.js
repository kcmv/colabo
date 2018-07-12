/**
* the namespace for the knalledgeMap part of the KnAllEdge system
* @namespace knalledge.knalledgeMap
*/

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var Plugins = window.Config.Plugins;

var knalledgeMapServices = angular.module('knalledgeMapServices');

/**
Contains the content of the map
@memberof knalledge.knalledgeMap.knalledgeMapServices
@typedef {Object} MapData
@property {Object} properties - map properties
@property {string} properties.rootNodeId - id of the root node of the map
@property {Array.<knalledge.KNode>} nodes - an array of nodes
@property {Array.<knalledge.KEdge>} edges - an array of edges
*/

/**
Contains the changes happened in the currently active map
@memberof knalledge.knalledgeMap.knalledgeMapServices
@typedef {Object} MapChanges
@property {Array.<knalledge.KNode>} nodes - array of changed nodes
@property {Array.<knalledge.KEdge>} nodes - array of changed edges
*/

/**
Contains the changes (together with the event name) happened in the currently active map
@memberof knalledge.knalledgeMap.knalledgeMapServices
@typedef {Object} MapChangesWithEvent
@property {knalledge.knalledgeMap.knalledgeMapServices.MapChanges} changes - array of changed nodes
@property {string} event - an event that happened as an source of the changes.
**NOTE**: This parameter is not present from the beginning but injected at the higher layers
*/

/**
* @class KnalledgeMapVOsService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnalledgeMapVOsService', {
// service config data
$configData: {},

// init service
$init: function(configData){
	this.$configData = configData;
},

// get (instantiate) service
$get: ['$q', '$rootScope', '$window', '$injector', 'injector', 'Plugins', 'KnalledgeNodeService', 'KnalledgeEdgeService', 'KnalledgeMapService',
'CollaboPluginsService', 'KnalledgeMapViewService', 'KnalledgeMapPolicyService', 'KnAllEdgeRealTimeService',

/**
* @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
* @constructor
* @param  {utils.Injector} Injector
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeNodeService} * @param  {config} Plugins
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeNodeService} KnalledgeNodeService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeEdgeService} KnalledgeEdgeService
* @param  {knalledge.knalledgeMap.knalledgeMapServices..KnalledgeMapService}  KnalledgeMapService
* @param  {knalledge.collaboPluginsServices.CollaboPluginsService} CollaboPluginsService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapViewService} KnalledgeMapViewService
* @param  {knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapPolicyService} KnalledgeMapPolicyService
*/
function($q, $rootScope, $window, $injector, injector, Plugins, KnalledgeNodeService, KnalledgeEdgeService, KnalledgeMapService,
	CollaboPluginsService, KnalledgeMapViewService, KnalledgeMapPolicyService, KnAllEdgeRealTimeService) {

		// var that = this;
		try{
			// * @param  {knalledge.knalledgeMap.knalledgeMapServices.KnAllEdgeRealTimeService} KnAllEdgeRealTimeService
			var KnAllEdgeRealTimeService = Plugins.puzzles.knalledgeMap.config.knAllEdgeRealTimeService.available ?
				$injector.get('KnAllEdgeRealTimeService') : null;
		}catch(err){
			console.warn(err);
		}
		try{
			// * @param  {rima.rimaServices.RimaService}  RimaService
			var RimaService = Plugins.puzzles.rima.config.rimaService.available ?
				$injector.get('RimaService') : null;
		}catch(err){
			console.warn(err);
		}
		var GlobalEmittersArrayService = $injector.get('GlobalEmittersArrayService');

		try{
			// * @param {knalledge.collaboPluginsServices.CollaboGrammarService} CollaboGrammarService
			var CollaboGrammarService = Plugins.puzzles.collaboGrammar.config.collaboGrammarService.available ?
				$injector.get('CollaboGrammarService') : null;
		}catch(err){
			console.warn(err);
		}

		injector.addPath("collaboPlugins.CollaboGrammarService", CollaboGrammarService);

		var provider = {
			/**
			 * The id of the currently loaded map
			 * @type {string}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			//mapId: "552678e69ad190a642ad461c", // map id
			map: new knalledge.KMap(),
			/**
			 * The id of root node of the currently loaded map
			 * @type {string}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			rootNodeId: "55268521fb9a901e442172f9", // root node id in the map
			/**
			 * The root node of the currently loaded map
			 * @type {knalledge.KNode}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			rootNode: null,
			/**
			 * Hash array of nodes in the currently loaded map
			 * The key in the hash array is the id of the node
			 * @type {Array.<string, knalledge.KNode>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			nodesById: {},
			/**
			 * Hash array of edges in the currently loaded map
			 * The key in the hash array is the id of the edge
			 * @type {Array.<string, knalledge.KEdge>}
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 */
			edgesById: {},
			/**
			 * Map properties
			 * @type {Object}
			 */
			properties: {},
			// TODO: remove RimaService
			mapStructure: new knalledge.MapStructure(RimaService, KnalledgeMapViewService, KnalledgeMapPolicyService, Plugins, CollaboGrammarService),
			// TODO: remove, not used any more?!
			lastVOUpdateTime: null,

			//list of all `actionType`-s that are differential instead over all object
			differentialActions: (function(){
				var obj = {};
				obj[knalledge.KNode.UPDATE_TYPE_VOTE] =1;
				obj[knalledge.KNode.UPDATE_NODE_NAME] =1;
				obj[knalledge.MapStructure.UPDATE_NODE_TYPE] =1;
				obj[knalledge.MapStructure.UPDATE_NODE_CREATOR] =1;
				obj[knalledge.MapStructure.UPDATE_NODE_VISUAL_OPEN] =1;
				obj[knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING] =1;
				obj[puzzles.changes.Actions.UPDATE_NODE_DECORATION] =1;

				return obj;
			})(),

			configData: this.$configData,

			serviceId: new Date(),

			/**
				called by KnAllEdgeRealTimeService when a broadcasted message regarding changes in the map (nodes, edges) structure is received from another client

			 * Callback function called from KnAllEdgeRealTimeService
			 * when change broadcated events (like `node-created`, etc)
			 * are broadcasted.
			 *
			 * It wraps changes into a unified structure `changes` that is published
			 * (through the GlobalEmittersArrayService) to upper interested layers translated into events (like `node-created-to-visual`)
			 * @function externalChangesInMap
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {string} eventName - event name that is sent by other client
			 * @param  {Object} msg

			 * OLD COMMENT?: Chnages that are broadcasted from the presented
			 * OLD COMMENT?: @type {knalledge.knalledgeMap.knalledgeMapServices.MapChanges}
			 */
			externalChangesInMap: function(eventName, msg){
				console.log("externalChangesInMap(%s,%s)",eventName, JSON.stringify(msg));
				if(!KnalledgeMapPolicyService.provider.config.broadcasting.receiveStructural) return; //this could be at KnAllEdgeRealTimeService but it should not differentiate (know about) different types of messages on upper layer (e.g. structural vs navigation)
				var changes = {nodes:[], edges:[]};
				var shouldBroadcast = true;
				var ToVisualMsg = "-to-visual";
				var change = msg; //puzzles.changes.Change

				switch(eventName){
					case Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeCreatedEventName:
						kNode = knalledge.KNode.nodeFactory(change.value);
						this.nodesById[kNode._id] = kNode;
						kNode.state = knalledge.KNode.STATE_SYNCED;
						var eventName = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeCreatedEventName + ToVisualMsg;
						changes.nodes.push({node:kNode,	actionType: null});
					break;
					case Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName:
							// var msg = {
							// 	id: nodeFromServer._id,
							// 	actionType: actionType,
							// 	data: nodeFromServer,
							// 	actionTime: nodeFromServer.updatedAt
							// }
						var kNode = this.nodesById[change.reference];
						if(typeof kNode === 'undefined'){
							console.error("externalChangesInMap:Node update received for a node that we don't have");
							this.nodesById[change.reference] = knalledge.KNode.nodeFactory(change.value);
						}

						//`actionType` is a differential, and under `else` we cover thost that work over all object:
						switch (change.action) {
							case knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING:
								var whatId = change.value.dataContent.rima.whats._id;
								//console.log('whatId: ', whatId);
								var whats = kNode.dataContent.rima.whats;
								for(var i=0; i<whats.length; i++){
									if(whats[i]._id === whatId){
										whats.splice(i, 1);
									}
								}
							break;
							case knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING:
								if (!kNode.dataContent) {
									kNode.dataContent = { rima : { whats : [] } };
								} else {
										if (!kNode.dataContent.rima) {
											kNode.dataContent.rima = { whats : [] };
										} else {
											if (!kNode.dataContent.rima.whats) { kNode.dataContent.rima.whats = []; }
										}
								}
								kNode.dataContent.rima.whats.push(change.value.dataContent.rima.whats[0]);
							break;
							default:
								if(this.differentialActions[change.action]){
									//delete change.data.
									deepAssign(kNode, change.value); //patching
									kNode.updatedAt = Date(msg.updatedAt); //tiempo existe en change.value tambien, pero los ambos son de tipo 'string'
								}
								else{
									kNode.fill(change.value);
								}
						}

						if(change.action === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING || change.action === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING){
							this.broadcastWhatsChange(kNode, change.action, (change.action === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING ? change.value.dataContent.rima.whats[0] : change.value.dataContent.rima.whats));
						}

						kNode.state = knalledge.KNode.STATE_SYNCED;
						var eventName = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName + ToVisualMsg;
						//changes.nodes.push(kNode);
						changes.nodes.push({node:kNode,	actionType: change.action});
					break;
					case Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName:
						if(this.nodesById.hasOwnProperty(change.reference)){
							var kNode = this.nodesById[change.reference];
							changes.nodes.push({node:kNode,	actionType: null});
							delete this.nodesById[change.reference];
							var eventName = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName + ToVisualMsg;
						}
						else{
							console.error("externalChangesInMap: trying to delete a Node that we don't have");
							shouldBroadcast = false; //TODO: check if this is the right approach
						}
					break;

					case Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeCreatedEventName:
						kEdge = knalledge.KEdge.edgeFactory(msg);
						this.edgesById[kEdge._id] = kEdge;
						kEdge.state = knalledge.KEdge.STATE_SYNCED;
						var eventName = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeCreatedEventName + ToVisualMsg;
						changes.edges.push({edge:kEdge,	actionType: null});
					break;
					case Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName:
						var kEdge = this.edgesById[change.reference];
						if(typeof kEdge === 'undefined'){
							console.error("externalChangesInMap:Edge update received for a edge that we don't have");
							this.edgesById[change.reference] = knalledge.KEdge.edgeFactory(change.value);
						}
						kEdge.fill(change.value);
						kEdge.state = knalledge.KEdge.STATE_SYNCED;
						var eventName = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName + ToVisualMsg;
						changes.edges.push({edge:kEdge,	actionType: change.action});
					break;
					case Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeDeletedEventName:
						if(this.edgesById.hasOwnProperty(msg._id)){
							var kEdge = this.edgesById[msg._id];
							changes.edges.push({edge:kEdge,	actionType: msg.actionType});
							delete this.edgesById[msg._id];
							var eventName = Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeDeletedEventName + ToVisualMsg;
						}
						else{
							console.error("externalChangesInMap: trying to delete an Edge that we don't have");
							shouldBroadcast = false; //TODO: check if this is the right approach
						}
					break;
				}
				if(shouldBroadcast){
					GlobalEmittersArrayService.register(eventName);
					GlobalEmittersArrayService.get(eventName).broadcast('KnalledgeMapVOsService', {'changes':changes,'event':eventName});
				}

					// for(id=0; id<changesFromServer.nodes.length; id++){
					// 	newChanges = true;

					// 	var changesKNode = changesFromServer.nodes[id];
					// 	var kNode = KnalledgeMapVOsService.getNodeById(changesKNode._id);
					// 	if(!kNode){ //create
					// 		kNode = knalledge.KNode.nodeFactory(changesKNode);
					// 		KnalledgeMapVOsService.nodesById[kNode._id] = kNode;
					// 	}else{ //update
					// 		// TODO: is this ok?
					// 		kNode.fill(changesKNode);
					// 	}
					// 	// we need to replace with our own version of the kNode, so upper levels (like vkNode) stays in the sync
					// 	changesFromServer.nodes[id] = kNode;

					// 	// TODO: why this, and is it for both creating and updating
					// 	kNode.state = knalledge.KNode.STATE_SYNCED;

					// 	if(kNode.updatedAt.getTime() <= this.lastChange.getTime()){
					// 		console.error("received node with same or earlier date '%d' as this.lastChange (%d)", kNode.updatedAt.getTime(), this.lastChange.getTime());
					// 		//console.log("node date '%s' vs this.lastChange (%s)", kNode.updatedAt, this.lastChange);
					// 	}
					// 	// else{
					// 	// 	console.warn("received node date '%s' vs this.lastChange (%s)", kNode.updatedAt.getTime(), this.lastChange.getTime());
					// 	// }
					// }

					// for(id=0; id<changesFromServer.edges.length; id++){
					// 	newChanges = true;

					// 	var changesKEdge = changesFromServer.edges[id];
					// 	var kEdge = KnalledgeMapVOsService.getEdgeById(changesKEdge._id);
					// 	if(!kEdge){
					// 		kEdge = knalledge.KEdge.edgeFactory(changesKEdge);
					// 		KnalledgeMapVOsService.nodesById[kEdge._id] = kEdge;
					// 	}else{
					// 		// TODO: is this ok?
					// 		kEdge.fill(changesKEdge);
					// 	}

					// 	// TODO: why this, and is it for both creating and updating
					// 	kEdge.state = knalledge.KEdge.STATE_SYNCED;
					// 	// we need to replace with our own version of the kEdge, so upper levels (like vkEdge) stays in the sync
					// 	changesFromServer.edges[id] = kEdge;
					// }
			},

			broadcastWhatsChange: function(kNode, action, what){
				var rimaWhatsChangedEvent = "rimaWhatsChangedEvent";
				GlobalEmittersArrayService.register(rimaWhatsChangedEvent);
				GlobalEmittersArrayService.get(rimaWhatsChangedEvent).broadcast('mapService', {node:kNode, actionType:action, change:what});
			},

			getNodesList: function(){
				var nodesList = [];
				for(var i in this.nodesById){
					nodesList.push(this.nodesById[i]);
				}
				return nodesList;
			},

			hasChildren: function(d){
				for(var i in this.edgesById){
					if(this.edgesById[i].sourceId == d._id){
						return true;
					}
				}
				return false;
			},

			getEdge: function(sourceId, targetId){
				// that.privateData;
				for(var i in this.edgesById){
					if(this.edgesById[i].sourceId == sourceId && this.edgesById[i].targetId == targetId){
						return this.edgesById[i];
					}
				}
				return null;
			},

			// collapses children of the provided node
			collapse: function(d) {
				d.isOpen = false;
			},

			// toggle children of the provided node
			toggle: function(d) {
				d.isOpen = !d.isOpen;
			},

			getNodeById: function(kId) {
				for(var i in this.nodesById){
					var node = this.nodesById[i];
					if(node._id == kId) {
						return node;
					}
				}
				return null;
			},

			getEdgeById: function(kId) {
				for(var i in this.edgesById){
					var edge = this.edgesById[i];
					if(edge._id == kId) {
						return edge;
					}
				}
				return null;
			},

			createNode: function(kNode, kNodeType) {
				if (kNode && kNode.type && typeof kNodeType == 'undefined') kNodeType = kNode.type;

				var nodeCreated = function(nodeFromServer) {
					console.log("[KnalledgeMapVOsService] nodeCreated");// + JSON.stringify(nodeFromServer));
					// var edgeUpdatedNodeRef = function(edgeFromServer){
					// 	console.log("[KnalledgeMapVOsService] edgeUpdatedNodeRef" + JSON.stringify(edgeFromServer));
					// };

					// updating all references to node on fronted with server-created id:
					// var oldId = newNode._id;
					delete this.nodesById[localNodeId];//		this.nodesById.splice(oldId, 1);
					this.nodesById[nodeFromServer._id] = newNode; //TODO: we should set it to 'nodeFromServer'?! But we should synchronize also local changes from 'newNode' happen in meantime
					// newNode._id = nodeFromServer._id; //TODO: same as above
					// newNode.fill(nodeFromServer);

					//fixing edges:: sourceId & targetId:
					for(var i in this.edgesById){
						var changed = false;
						var edge = this.edgesById[i];
						if(edge.sourceId == localNodeId){edge.sourceId = nodeFromServer._id; changed = true;}
						if(edge.targetId == localNodeId){edge.targetId = nodeFromServer._id; changed = true;}
						if(changed){window.edgeNTest = edge;}//TODO:remove this
						//TODO: check should we do here something, after KnalledgeMapQueue logic is used etc:
						/* but so far we are commenting this because we won't update edge. Instead createEdge will be blocked (by promise, until this createNode is finished) in:
						 * 		// Add new node:
						 *		KeyboardJS.on("tab", function(){
						 *  so
						if(changed){
							//TODO: should we clone it or call vanilla object creation:
							KnalledgeEdgeService.update(edge, edgeUpdatedNodeRef.bind(this)); //saving changes in edges's node refs to server
						}
						*/
					}
				};

				console.log("[KnalledgeMapVOsService] createNode");

				// var maxId = -1;
				// for(var i in this.nodesById){
				// 	if(maxId < this.nodesById[i]._id){
				// 		maxId = this.nodesById[i]._id;
				// 	}
				// }

				var newNode = kNode;
				if(typeof newNode === 'undefined' || newNode === null){
					newNode = new knalledge.KNode();
				}
				if(!newNode.iAmId){
					//TODO: this is already done in caller (mapStructure), so maybe it should go under upper if.
					//and we could add there another steps done in caller (like decoration)
					newNode.iAmId = RimaService ? RimaService.getActiveUserId() :
					Plugins.puzzles.rima.config.rimaService.ANONYMOUS_USER_ID;
				}
				if(typeof kNodeType === 'undefined' || kNodeType === null){
					kNodeType = knalledge.KNode.TYPE_KNOWLEDGE; //TODO: check about this
				}

				newNode.type = kNodeType;

				var localNodeId = newNode._id;// = maxId+1;
				if(!('mapId' in newNode) || !newNode.mapId) {newNode.mapId = (this.map && this.map.state !== knalledge.KMap.STATE_LOCAL) ? this.map._id : null;} //'575ffc2cfe15024a16d456c6';}

				newNode = KnalledgeNodeService.create(newNode, nodeCreated.bind(this)); //saving on server service.
				this.nodesById[localNodeId] = newNode;
				return newNode;
			},

			updateNode: function(node, actionType, patch, callback) {
				if(patch){ //other way is to check if actionType is in the list of differential ones
					switch(actionType){
						case knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING: //needs to be treaten separatelly because deepAssign cannot handle with arrays elements changes
						//this 	`case` is not needed actually right now, because what is deleted already in rima component/directive in method `itemRemove` (but actions are idempotent)
							var whatId = patch.dataContent.rima.whats._id;
							//console.log('whatId: ', whatId);
							var whats = node.dataContent.rima.whats;
							for(var i=0; i<whats.length; i++){
								if(whats[i]._id === whatId){
									whats.splice(i, 1);
								}
							}
						break;
						case knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING: //needs to be treaten separatelly because deepAssign cannot handle with arrays elements changes
							node.dataContent.rima.whats.push(patch.dataContent.rima.whats[0]);
						break;
						default:
							deepAssign(node, patch); //patching
					}
				}
				var that = this;
				return KnalledgeNodeService.update(node, actionType, patch,
					function(nodeFromServer){
						var localNode = that.nodesById[nodeFromServer._id];
						if(patch){//if we had a differential update and not whole one
							if(localNode.updatedAt < nodeFromServer.updatedAt){
								//TODO: warn that ealier update has come after the later one
								localNode.updatedAt = nodeFromServer.updatedAt;
							}
						}else{
							that.nodesById[nodeFromServer._id].overrideFromServer(nodeFromServer);
						}
						if(actionType === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_DELETING || actionType === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING){
							that.broadcastWhatsChange(node, actionType, (actionType === knalledge.KNode.DATA_CONTENT_RIMA_WHATS_ADDING ? patch.dataContent.rima.whats[0] : patch.dataContent.rima.whats));
						}
						if(callback){callback(that.nodesById[nodeFromServer._id]);}
					}); //updating on server service
			},

			getMap: function(){
				return this.map;
			},

			getMapId: function(){
				if(this.map){
					return this.map._id;
				}else{
					return null;
				}
			},

			addParticipantToMap(userId, callback){
				this.map.participants.push(userId);
				KnalledgeMapService.update(this.map, function(){
					if(typeof callback === 'function') callback();
				});
			},

			deleteNode: function(node) {
				var result = KnalledgeNodeService.destroy(node._id); //deleteNode on server service
				delete this.nodesById[node._id]; //TODO: see if we should do it only upon server deleting success
				return result;
			},

			/**
			expects already created VOs!
			*/
			createNodeWithEdge: function(sourcekNode, kEdge, targetkNode, edgeType, callback) {
				var createEdgeAndNodesCallback = function(kEdgeFromServer){
					console.log("createEdgeAndNodesCallback");
					if(callback){callback(kEdgeFromServer);}
				};
				//sourcekNode = this.createNode(sourcekNode);
				targetkNode = this.createNode(targetkNode);
				kEdge.sourceId = sourcekNode._id;
				kEdge.targetId = targetkNode._id;
				if(typeof edgeType == 'undefined'){
					edgeType = kEdge.type;
				}
	//		newNode.kNode.$promise.then(function(kNodeFromServer){ // TODO: we should remove this promise when we implement KnalledgeMapQueue that will solve these kind of dependencies
	//			console.log("KeyboardJS.on('tab': in promised fn after createNode");
				kEdge = this.createEdgeBetweenNodes(sourcekNode, targetkNode, kEdge, edgeType, callback);
				kEdge.$promise.then(createEdgeAndNodesCallback);
				return kEdge;
			},

			deleteEdge: function(kEdge, callback) {
				//delete in edgesById (kEdge):
				delete this.edgesById[kEdge._id];
				var result = KnalledgeEdgeService.destroy(kEdge._id, callback); //TODO: handle a case when the edge is not deleted sucessfully
				return result;
			},


			/**
			 * deleteEdgesConnectedTo
			 * @param  {knalledge.KNode} node - node which incoming edges should be deleted
			 * @return {[type]}      [description]
			 */
			deleteEdgesConnectedTo: function(node) {
				var result = KnalledgeEdgeService.deleteConnectedTo(node._id); //TODO: handle a case when the edge is not deleted sucessfully
				//delete edgesById (kEdge):
				for(var i in this.edgesById){
					var edge = this.edgesById[i];
					if(edge.sourceId == node._id || edge.targetId == node._id){
						delete this.edgesById[i];
					}
				}
				return result;
			},

			relinkNode: function (relinkingNode, newParent, callback) {
				var parents = this.getParentNodes(relinkingNode);
				var parentId = parents[0]._id; //TODO: by this we are always relinking first parent (when we wil have more parents, this wil need to be resSendJsonProtected)
				var relinkingEdge = this.getEdge(parentId, relinkingNode._id);
				if(relinkingEdge){
					if(relinkingEdge.targetId != newParent._id){
						relinkingEdge.sourceId = newParent._id;
						this.updateEdge(relinkingEdge, "UPDATE_RELINK_EDGE", function(success, error){
							callback(success, error);
						});
					}
					else{
							callback(false,'TARGET_EQ_SOURCE');
					}
				}
				else{
					callback(false,'NO_EDGE');
				}

			},

			createEdge: function(kEdge, callback) {
				var edgeCreated = function(edgeFromServer) {
					// not able to log: circular
					// console.log("[KnalledgeMapVOsService::createEdge] edgeCreated" + JSON.stringify(edgeFromServer));

					// updating all references to edge on fronted with server-created id:
					// var oldId = newEdge._id;
					delete this.edgesById[localEdgeId];//		this.nodesById.splice(oldId, 1);
					this.edgesById[edgeFromServer._id] = kEdge; //TODO: we should set it to 'edgeFromServer'?! But we should synchronize also local changes from 'newEdge' happen in meantime
					// newEdge._id = edgeFromServer._id; //TODO: same as above
					// newEdge.fill(edgeFromServer);
					if(callback) callback(edgeFromServer);
				};

				if(!('mapId' in kEdge) || !kEdge.mapId) kEdge.mapId = this.map._id;
				window.edgeETest = kEdge;//TODO:remove this
				var localEdgeId = kEdge._id;
				kEdge = KnalledgeEdgeService.create(kEdge, edgeCreated.bind(this));

				this.edgesById[localEdgeId] = kEdge;
				return kEdge;
			},

			createEdgeBetweenNodes: function(sourceNode, targetNode, kEdge, kEdgeType, callback) {
				console.log("[KnalledgeMapVOsService] createEdge");
				// var maxId = -1;
				// for(var i in this.edgesById){
				// 	if(maxId < this.edgesById[i]._id){
				// 		maxId = this.edgesById[i]._id;
				// 	}
				// }


				var newEdge = kEdge;
				if(typeof newEdge === 'undefined' || newEdge === null){
					newEdge = new knalledge.KEdge();
				}
				newEdge.iAmId = RimaService ? RimaService.getActiveUserId() :
				Plugins.puzzles.rima.config.rimaService.ANONYMOUS_USER_ID;
				if(typeof kEdgeType === 'undefined' || kEdgeType === null){
					kEdgeType = knalledge.KEdge.TYPE_KNOWLEDGE; //TODO: check about this
				}

				newEdge.type = kEdgeType;

				newEdge.sourceId = sourceNode._id;
				newEdge.targetId = targetNode._id;

				newEdge = this.createEdge(newEdge, callback);

				//preparing and saving on server service:
				// var edgeCloned = newEdge.toServerCopy();

				//TODO: check should we do here something, after KnalledgeMapQueue logic is used etc:
				/* this was used when createEdge request is sent to server without waiting for target node to be created.
				 * now must remove it, because by this nodeCreated will find edges connected to it and update their links over localID to new server-created-Id
				 *
				if(sourceNode.state == knalledge.KNode.STATE_LOCAL) //TODO: not working till state is not set for resources retreived from server
				{
					delete edgeCloned.sourceId; // this is still not set to server Id
				}
				if(targetNode.state == knalledge.KNode.STATE_LOCAL)
				{
					delete edgeCloned.targetId; // this is still not set to server Id
				}
				*/

				return newEdge;
			},

			updateEdge: function(kEdge, updateType, callback){
				return KnalledgeEdgeService.update(kEdge, updateType, callback); //updating on server service
			},

			/**
			 * Loads and processes map based on the KMap object
			 * It publishes the `modelLoadedEvent` event after the process is finished
			 * @function loadAndProcessData
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {knalledge.KMap} map - map object
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.MapData}
			 */
			loadAndProcessData: function(kMap, callback){
				var that = this;
				if(typeof kMap !== 'undefined'){
					this.map = kMap;
					this.rootNodeId = kMap.rootNodeId;
					if(KnAllEdgeRealTimeService){
						KnAllEdgeRealTimeService.setSessionId('mapId', this.map._id);
						KnAllEdgeRealTimeService.setMapId(this.map._id);
					}
				}
				/**
				 * Map data
				 * @type  {knalledge.knalledgeMap.knalledgeMapServices.MapData}
				 */
				var result = this.loadData(kMap);
				result.$promise.then(function(results){
					console.log("[KnalledgeMapVOsService::loadData] nodesEdgesReceived");

					//TODO: remove this - used for syncing with changes, done by other users - but now we have migated to  KnAllEdgeRealTimeService
					that.lastVOUpdateTime = new Date(0); //"Beginning of time :) 'Thu Jan 01 1970 01:00:00 GMT+0100 (CET)' "

					var i;
					var nodes = results[0];
					var edges = results[1];
					for(i=0; i<nodes.length; i++){
						result.map.nodes.push(nodes[i]);
						if(nodes[i].updatedAt > that.lastVOUpdateTime){
							that.lastVOUpdateTime = nodes[i].updatedAt;
						}
					}
					for(i=0; i<edges.length; i++){
						result.map.edges.push(edges[i]);
						if(edges[i].updatedAt > that.lastVOUpdateTime){
							that.lastVOUpdateTime = edges[i].updatedAt;
						}
					}

					that.processData(result);

					that.mapStructure.init(that);
					that.mapStructure.processData(result);

					// Add active user to the map
					// ToDo: this is
					if(RimaService){
						var activeUserId = RimaService.getActiveUserId();
						if(activeUserId &&
							kMap.participants.indexOf(activeUserId) === -1
						){ // add it if not found among participants
							that.addParticipantToMap(activeUserId,callback);
						}else{
							if(typeof callback === 'function') callback();
						}
					}else{
						if(typeof callback === 'function') callback();
					}

					var modelLoadedEventName = "modelLoadedEvent";
					//console.log("result:" + JSON.stringify(result));
					GlobalEmittersArrayService.register(modelLoadedEventName);
					GlobalEmittersArrayService.get(modelLoadedEventName).broadcast('KnalledgeMapVOsService', result);

					if(that.configData.broadcastMapUsers){
						var whoIamIdsUpdatedEventName = "whoIamIdsUpdatedEvent";
						GlobalEmittersArrayService.register(whoIamIdsUpdatedEventName);
						GlobalEmittersArrayService.get(whoIamIdsUpdatedEventName).broadcast('KnalledgeMapVOsService', kMap.participants);
					}
				});
				return result;
			},

			/**
			 * Loads data associated with the map (represented with the KMap object)
			 * @function loadData
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {knalledge.KMap} map - Map data object
			 * @param  {boolean} [setAsDefaultMap] - should it set to internal params (true),
			 * or just load the map (false/undefined)
			 * @return {knalledge.knalledgeMap.knalledgeMapServices.MapData} map - map data
			 */
			loadData: function(map, setAsDefaultMap){
				var that = this;

				if(setAsDefaultMap && typeof map !== 'undefined'){
					this.map = map;
					this.rootNodeId = map.rootNodeId;
				}

				if(typeof map == 'undefined'){
					// create default map
					// TODO: should we remove that, doesn't make too much sense anymore
					var mapObj = {
						name: "TNC (Tesla - The Nature of Creativty) (DR Model)",
						createdAt: "2015.03.22.",
						type: "knalledge",
						dataContent: {
                            mcm: {
                                  authors: "S. Rudan, D. Karabeg"
                           }
                       	},
						_id: this.map._id,
						rootNodeId: this.rootNodeId
					};
					map = new knalledge.KMap();
					map.fill(mapObj);
				}
				console.log('loadData:map'+ JSON.stringify(map));

				var result = {
					"properties": map,
					"map": {
						"nodes": [],
						"edges": []
					}
				};

				// var handleReject = function(fail){
				// 	$window.alert("Error loading knalledgeMap: %s", fail);
				// };

				var nodes = KnalledgeNodeService.queryInMap(map._id);
				var edges = KnalledgeEdgeService.queryInMap(map._id);
				//var rimas = KnalledgeEdgeService.queryInMap(that.mapId);

				var promiseAll = $q.all([nodes.$promise, edges.$promise]);
				promiseAll.then(function(results){
					result.$resolved = true;
				});

				result.$promise = promiseAll;
				result.$resolved = false;
				return result;
			},

			getLastVOUpdateTime: function() {
				return this.lastVOUpdateTime;
			},

			/**
			 * Processes map data and populates internal structure in the service
			 * @function processData
			 * @memberof knalledge.knalledgeMap.knalledgeMapServices.KnalledgeMapVOsService#
			 * @param  {knalledge.knalledgeMap.knalledgeMapServices.MapData} mapData - map data
			 */
			processData: function(mapData) {
				this.properties = mapData.map.properties;
				var i=0;
				var kNode = null;
				var kEdge = null;
				for(i=0; i<mapData.map.nodes.length; i++){
					kNode = mapData.map.nodes[i];
					if(!("isOpen" in kNode)){
						kNode.isOpen = false;
					}
					this.nodesById[kNode._id] = kNode;
				}

				for(i=0; i<mapData.map.edges.length; i++){
					kEdge = mapData.map.edges[i];
					this.edgesById[kEdge._id] = kEdge;
				}

				this.rootNode = this.nodesById[mapData.properties.rootNodeId];
			},

			getChildrenEdgeTypes: function(kNode){
				var children = {};
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.sourceId == kNode._id){
						if(kEdge.type in children){
							children[kEdge.type] += 1;
						}else{
							children[kEdge.type] = 1;
						}
					}
				}
				return children;
			},

			getNodesOfType: function(kNodeType){
				var nodes = [];
				for(var j in this.nodesById){
					var kNode = this.nodesById[j];
					if(kNode.type == kNodeType){
						nodes.push(kNode);
					}
				}
				return nodes;
			},

			getChildrenEdges: function(kNode, edgeType){
				var children = [];
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.sourceId == kNode._id && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
						children.push(kEdge);
					}
				}
				return children;
			},

			getChildrenNodes: function(kNode, edgeType){
				var children = [];
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.sourceId == kNode._id && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
						for(var j in this.nodesById){
							var kNodeChild = this.nodesById[j];
							if(kNodeChild._id == kEdge.targetId){
								children.push(kNodeChild);
							}
						}
					}
				}
				return children;
			},

			getParentNodes: function(kNode, edgeType){
				var parents = [];
				for(var i in this.edgesById){
					var kEdge = this.edgesById[i];
					if(kEdge.targetId == kNode._id && ((typeof edgeType === 'undefined') || kEdge.type == edgeType)){
						for(var j in this.nodesById){
							var kNodeParent = this.nodesById[j];
							if(kNodeParent._id == kEdge.sourceId){
								parents.push(kNodeParent);
							}
						}
					}
				}
				return parents;
			},

			mapDelete: function(mapId, callback){
				var mapDeleted = function(result,result2){
					console.log('[mapDeleted]; result: ', result,', result2: ', result2);
					if(callback){callback(result);}
				}
				KnalledgeMapService.deleteMapAndContent(mapId, mapDeleted)
			},

			mapDuplicate: function(map, mapNewName, callback){
				console.log('mapDuplicate');
				var mapDuplicated = function(map,result2){
					map.createdAt = new Date(map.createdAt);
					map.updatedAt = new Date(map.updatedAt);
					console.log('[mapDuplicated]; map: ', map,', result2: ', result2);
					if(callback){callback(map);}
				}
				KnalledgeMapService.duplicate(map._id, mapNewName, mapDuplicated);
			},

			mapExport: function(mapId, callback){
				console.log('mapExport');
				var mapExported = function(map,result){
					console.log('[mapExport]; map: ', map,', result: ', result);
					if(callback){callback(map);}
				}
				KnalledgeMapService.export(mapId, mapExported);
			}
		};

		// registering plugin support
		CollaboPluginsService.provideReferences("mapVOsService", {
			name: "mapVOsService",
			items: {
				// nodesById: function(){
				// 	return provider.nodesById;
				// },
				// edgesById: function(){
				// 	return provider.edgesById;
				// }
				nodesById: provider.nodesById,
				edgesById: provider.edgesById
			}
		});
		// this.collaboPluginsService.provideApi("map", {
		// 	name: "map",
		// 	items: {
		// 		/* update(source, callback) */
		// 		update: this.mapVisualization.update.bind(this.mapVisualization)
		// 	}
		// });

		if(KnAllEdgeRealTimeService){
			// realtime listener registration
			var KnalledgeMapVOsServicePluginOptions = {
				name: "KnalledgeMapVOsService",
				events: {
				}
			};
			KnalledgeMapVOsServicePluginOptions.events[Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeCreatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeUpdatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeDeletedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeCreatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeUpdatedEventName] = provider.externalChangesInMap.bind(provider);
			KnalledgeMapVOsServicePluginOptions.events[Plugins.puzzles.knalledgeMap.config.services.KnRealTimeEdgeDeletedEventName] = provider.externalChangesInMap.bind(provider);
			KnAllEdgeRealTimeService.registerPlugin(KnalledgeMapVOsServicePluginOptions);

			// TODO: just for debugging
			window.nodesById = provider.nodesById;//TODO:remove
			window.edgesById = provider.edgesById;//TODO:remove
			return provider;

			// mapLayoutPluginOptions.events[knalledge.MapLayout.Plugins.puzzles.knalledgeMap.config.services.KnRealTimeNodeSelectedEventName] = this.realTimeNodeSelected.bind(this);
			// this.knAllEdgeRealTimeService.registerPlugin(mapLayoutPluginOptions)
		}
		return provider;
	}]
});

}()); // end of 'use strict';
