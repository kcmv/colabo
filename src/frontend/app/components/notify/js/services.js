/**
* the namespace for the notify part of the KnAllEdge system
* @namespace knalledge.notify
*/


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
* the namespace for core services for the Notify system
* @namespace knalledge.notify.notifyServices
*/

/**
* Service that retrieves and provides notifications
* @class NotifyService
* @memberof knalledge.notify.notifyServices
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
						//that.setActiveUser((that.notifications && that.notifications.length) ? that.notifications[0] : null); //TODO: set it to logged-in user
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

/**
* Service that is a plugin into knalledge.MapVisualization
* @class NotifyNodeService
* @memberof knalledge.notify.notifyServices
*/
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
