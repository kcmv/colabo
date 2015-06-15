(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('collaboPluginsDirectives', ['Config'])
	.directive('collaboPluginsList', ['$rootScope', 'CollaboPluginsService',
		function($rootScope, CollaboPluginsService){

		// http://docs.angularjs.org/guide/directive

		return {
			restrict: 'EA',
			scope: {
				mapData: "=",
				mapConfig: "=",
				nodeSelected: "&"
			},
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/collaboPlugins/partials/plugins-list.tpl.html',
			link: function ($scope, $element) {
				var msgEl = $element.find('.new_message .message');
				var msgsEl = $element.find('.messages');

				var msgReceived = function(eventName, msg){
					writeToMsgList(msg);
				};

				var writeToMsgList = function(msg){
					msgsEl.append($('<li>').text(msg));
				};

				// collaboPluginsSocket.on('tc:chat-message', msgReceived);

				// socket.on('tc:chat-message', function(msg){
				// 	msgsEl.append($('<li>').text(msg));
				// });

				// TODO: Replace with angular
				msgEl.keypress(function (e) {
					if (e.which == 13) {
						$scope.msgSend();
						return false;	
					}
				});

				// registering chat plugin
				var chatPluginOptions = {
					name: "chat",
					events: {
						'tc:chat-message': msgReceived.bind(this)				
					}
				};
				CollaboPluginsService.registerPlugin(chatPluginOptions);

				$scope.clientInfo = CollaboPluginsService.clientInfo;

				$scope.msgSend = function(){
					var msg = msgEl.html();
					// socket.emit('tc:chat-message', msg);
					// collaboPluginsSocket.emit('tc:chat-message', msg);
					CollaboPluginsService.emit('tc:chat-message', msg);
					writeToMsgList(msg);
					msgEl.html('');
					return false;
				};
			},

			controller: function ( $scope, $element) {

			}
    	};
	}])
;

}()); // end of 'use strict';
