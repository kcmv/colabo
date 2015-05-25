(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var QUEUE = 
//false;
true;

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var notifyServices = angular.module('notifyServices', ['ngResource', 'Config']);

/**
* 	factory 'WhoAmIService'
*/

notifyServices.factory('WhoAmIService', ['$resource', '$q', 'ENV', 'KnalledgeMapQueue', function($resource, $q, ENV, KnalledgeMapQueue){
	console.log("[WhoAmIService] server backend: %s", ENV.server.backend);
	// creationId is parameter that will be replaced with real value during the service call from controller
	var url = ENV.server.backend + '/whoAmIs/:type/:searchParam/:searchParam2.json';
	var resource = $resource(url, {}, {
		// extending the query action
		// method has to be defined
		// we are setting creationId as a pre-bound parameter. in that way url for the query action is equal to: data/creations/creations.json
		// we also need to set isArray to true, since that is the main difference with get action that also uses GET method
		getPlain: {method:'GET', params:{type:'one', searchParam:''}, isArray:false,
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				// console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[WhoAmIService] accessId: %s", serverResponse.accessId);
				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		queryPlain: {method:'GET', params:{type:'', searchParam:''}, isArray:true, 
			transformResponse: function(serverResponseNonParsed, headersGetter){ /*jshint unused:false*/
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[WhoAmIService] accessId: %s", serverResponse.accessId);
				return serverResponse.data;
			}else{
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		createPlain: {method:'POST', params:{}/*{type:'', searchParam: '', extension:""}*/, 
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
			var serverResponse;
			if(ENV.server.parseResponse){
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				//console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
				console.log("[ng-WhoAmIService::createPlain] accessId: %s", serverResponse.accessId);
				var data = serverResponse.data;
				console.log("ng-[WhoAmIService::createPlain] data: %s", JSON.stringify(data));
				return data;
			}else{
				//console.log("ENV.server.parseResponse = false");
				serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
				serverResponse = JSON.parse(serverResponseNonParsed);
				return serverResponse;
			}
		}},
		
		updatePlain: {method:'PUT', params:{type:'one', searchParam:''},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[WhoAmIService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;					
				}
			}
		},
		
		destroyPlain: {method:'DELETE', params:{type:'one'},
			transformResponse: function(serverResponseNonParsed/*, headersGetter*/){
				var serverResponse;
				if(ENV.server.parseResponse){
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					//console.log("[WhoAmIService] serverResponse: %s", JSON.stringify(serverResponse));
					console.log("[WhoAmIService:create] accessId: %s", serverResponse.accessId);
					var data = serverResponse.data;
					return data;
				}else{
					serverResponseNonParsed = removeJsonProtected(ENV, serverResponseNonParsed);
					serverResponse = JSON.parse(serverResponseNonParsed);
					return serverResponse;					
				}
			}
		}
	});

	resource.RESOURCE_TYPE = 'WhoAmI';

	resource.getById = function(id, callback)
	{
		var whoAmI = this.getPlain({ searchParam:id, type:'one' }, callback);
		return whoAmI;
	};
	
	resource.getByIds = function(whoAmIsIds, callback){ //TODO: fix not to return all, but only those in the whoAmIsIds list
		var whoAmIs = this.queryPlain({ searchParam:whoAmIsIds, type:'in_list'},
			function(whoAmIsFromServer){
				for(var id=0; id<whoAmIsFromServer.length; id++){
					var whoAmI = knalledge.WhoAmI.whoAmIFactory(whoAmIsFromServer[id]);
					whoAmI.state = knalledge.WhoAmI.STATE_SYNCED;
					whoAmIsFromServer[id] = whoAmI;
				}
				if(callback) callback(whoAmIsFromServer);
		});
		return whoAmIs;
	};
	
	resource.create = function(whoAmI, callback)
	{
		console.log("resource.create");
		
		if(QUEUE){
			whoAmI.$promise = null;
			whoAmI.$resolved = false;

			whoAmI.$promise = $q(function(resolve, reject) {
				KnalledgeMapQueue.execute({data: whoAmI, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
			});
		}
		else{
			var whoAmIForServer = whoAmI.toServerCopy();
			//we return whoAmI:whoAmI, because 'whoAmI' is of type 'Resource'  
			var whoAmI = this.createPlain({}, whoAmIForServer, function(whoAmIFromServer){
				whoAmI.$resolved = whoAmI.$resolved;
				whoAmI.overrideFromServer(whoAmIFromServer);
				if(callback) callback(whoAmI);
			});
			
			//createPlain manages promises for its returning value, in our case 'whoAmI', so we need to  set its promise to the value we return
			whoAmI.$promise = whoAmI.$promise;
			whoAmI.$resolved = whoAmI.$resolved;
			
			if(whoAmI.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously 
				whoAmI.overrideFromServer(whoAmI);
			}
		}
		//we return this value to caller as a dirty one, and then set its value to whoAmIFromServer when upper callback is called
		//TODO: a problem may occur if promise is resolved BEFORE callback is called 
		return whoAmI;
	};
	
	resource.update = function(whoAmI, callback)
	{
		console.log("resource.update");
		if(whoAmI.state == knalledge.WhoAmI.STATE_LOCAL){//TODO: fix it by going throgh queue 
			window.alert("Please, wait while entity is being saved, before updating it:\n"+whoAmI.name);
			return null;
		}
		var id = whoAmI._id;
		var whoAmIForServer = whoAmI.toServerCopy(); //TODO: move it to transformRequest ?
		if(QUEUE && false){
			KnalledgeMapQueue.execute({data: whoAmI, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "update"});
			return this.updatePlain({searchParam:id, type:'one'}, whoAmIForServer, callback); //TODO: does it return whoAmI so we should fix it like in create?
		}
		else{
			return this.updatePlain({searchParam:id, type:'one'}, whoAmIForServer, callback); //TODO: does it return whoAmI so we should fix it like in create?
		}
	};
	
	resource.destroy = function(id, callback)
	{
		return this.destroyPlain({searchParam:id, type:'one'}, callback);
	};
	
	resource.execute = function(request){ //example:: request = {data: whoAmI, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}};
		// var whoAmI;
		switch(request.method){
		case 'create':
			//window.alert('create skipped ;)'); break;
			var whoAmIForServer = request.data.toServerCopy();
			var whoAmIReturn = request.data;
			var callback = request.callback;
			
			var whoAmI = resource.createPlain({}, whoAmIForServer, function(whoAmIFromServer){
				whoAmIReturn.$resolved = whoAmI.$resolved;
				whoAmIReturn.overrideFromServer(whoAmIFromServer);
				request.processing.RESOLVE(whoAmIReturn);//whoAmIReturn.resolve()
				if(callback) callback(whoAmIReturn);
				KnalledgeMapQueue.executed(request);
			});
			
			//createPlain manages promises for its returning value, in our case 'whoAmI', so we need to  set its promise to the value we return
			whoAmIReturn.$promise = whoAmI.$promise;
			whoAmIReturn.$resolved = whoAmI.$resolved;
			
			if(whoAmI.$resolved){// for the case promise was resolved immediatelly (in synchonous manner) instead synchronously 
				whoAmIReturn.overrideFromServer(whoAmI);
			}
			break;
		case 'update':
			this.update;
			break;
		}
	}
	
	/* checks if request can be sent to server */
	resource.check = function(request){
		return true;
	}
	
	//KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});

	return resource;
	
}]);

/**
* 	factory 'NotificationService'
*/

notifyServices.provider('NotifyService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV /*, $rootScope*/) {
		var provider = {
			notifications: [
				{
					entity_id: "",
					entity_name: "Event",
					iAmId_orig: "",
					iAmId_dest: "",
					message: "Саша и Синиша требају да спавају!",
					type: "",
					what: "",
					notifyed: false
				},
				{
					entity_id: "",
					entity_name: null,
					iAmId_orig: "",
					iAmId_dest: "",
					message: "Semantic-web is so cool but hard",
					type: "",
					what: "semantic-web",
					notifyed: false
				},
				{
					entity_id: "",
					entity_name: "The 21st Century Enlightenment",
					iAmId_orig: "",
					iAmId_dest: "",
					message: "prof. Laszlo wants to discuss this topic",
					type: "",
					what: "",
					notifyed: false
				},
				{
					entity_id: "",
					entity_name: null,
					iAmId_orig: "",
					iAmId_dest: "",
					message: "CollaboScience invites prof. Sangüesa, based on his expertise in \“creativity dynamics\"",
					type: "",
					what: "creativity-dynamics",
					notifyed: false
				}
			],
			init: function(){
			},
				
			loadNotificationsFromList: function(usersIds, callback){
				var that = this;
				var notifications = WhoAmIService.getByIds(usersIds,
					function(notificationsFromServer){
						that.notifications = notificationsFromServer;
						//that.selectedWhoAmI = (that.notifications && that.notifications.length) ? that.notifications[0] : null; //TODO: set it to logged-in user
						if(callback){callback();}
					});
				return notifications;
			},

			getNotifications: function(){
				return this.notifications;
			},

			getNotificationForEntityId: function(entityId){
				for(var i in this.notifications){
					if(this.notifications[i]._id == id){
						return this.notifications[i];
					}
				}
				return null;
			}
		};
		provider.init();
		return provider;
	}]
});

notifyServices.provider('NotifyNodeService', {
	// privateData: "privatno",
	$get: ['NotifyService', /*'$rootScope', */
	function(NotifyService /*, $rootScope*/) {
		var provider = {
			init: function(){
			},

			nodeHtmlEnter: function(nodeHtmlEnter){
				// .filter(function(d) { return d.kNode.dataContent && d.kNode.dataContent.image; })
				nodeHtmlEnter.append("div")
					.attr("class", "notification")
					.on("click", function(d){
						d3.select(this).remove();
						// d3.select(this).style("display", "none");
					})
			},
				
			nodeHtmlUpdate: function(nodeHtmlUpdate){
				nodeHtmlUpdate.select(".notification")
					.style("display", function(d){
						var notifications = NotifyService.getNotifications();
						var notificationsRelevant = [];
						for(var notificationId=0; notificationId<notifications.length; notificationId++){
							var notification = notifications[notificationId];
							var relevant = false;
							if(notification.notifyed) continue;

							if(notification.entity_id == d.kNode._id) relevant = true;
							if(notification.entity_name == d.kNode.name) relevant = true;
							if((d.kNode.dataContent && d.kNode.dataContent.rima && d.kNode.dataContent.rima.whats)){
								for(var whatId in d.kNode.dataContent.rima.whats){
									var what = d.kNode.dataContent.rima.whats[whatId];
									if(notification.what == what.name) relevant = true;
								}
							}
							if(relevant) notificationsRelevant.push(notification);
						}
						return notificationsRelevant.length > 0  ? "block" : "none"; //TODO: unefective!! double finding notifications
					})
					.html(function(d){
						var notifications = NotifyService.getNotifications();
						var notificationsRelevant = [];
						for(var notificationId=0; notificationId<notifications.length; notificationId++){
							var notification = notifications[notificationId];
							var relevant = false;

							if(notification.entity_id === d.kNode._id) relevant = true;
							if(notification.entity_name === d.kNode.name) relevant = true;
							if((d.kNode.dataContent && d.kNode.dataContent.rima && d.kNode.dataContent.rima.whats)){
								for(var whatId in d.kNode.dataContent.rima.whats){
									var what = d.kNode.dataContent.rima.whats[whatId];
									if(notification.what === what.name) relevant = true;
								}
							}
							if(relevant) notificationsRelevant.push(notification);
						}
						var label = "";
						if(notificationsRelevant.length > 0){
							var notification = notificationsRelevant[0];
							label = notification.message;
						}
						return label;
					})
					.style("opacity", 1e-6);

				var nodeHtmlUpdateTransition = nodeHtmlUpdate.select(".notification").transition().delay(500).duration(500)
					.style("opacity", 0.8);
			},

			nodeHtmlExit: function(nodeHtmlExit){
				nodeHtmlExit.select(".notification")
					.on("click", null);
			}
		};
		provider.init();
		return provider;
	}]
});

}()); // end of 'use strict';