(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('topiChatDirectives', ['Config'])
	.directive('topichatChat', ['$rootScope', 'TopiChatService',
		function($rootScope, TopiChatService){

		// http://docs.angularjs.org/guide/directive
		console.log("[knalledgeMap] loading directive");

		return {
			restrict: 'EA',
			scope: {
				mapData: "=",
				mapConfig: "=",
				nodeSelected: "&"
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/topiChat/partials/topichat-chat.tpl.html',
			link: function ($scope, $element) {
				var msgEl = $element.find('.new_message .message');
				var msgsEl = $element.find('.messages');

				var msgReceived = function(eventName, msg){
					writeToMsgList(msg);
				};

				var writeToMsgList = function(msg){
					msgsEl.append($('<li>').text(msg));
				};

				// topiChatSocket.on('tc:chat-message', msgReceived);

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
				TopiChatService.registerPlugin(chatPluginOptions);

				$scope.clientInfo = TopiChatService.clientInfo;

				$scope.msgSend = function(){
					var msg = msgEl.html();
					// socket.emit('tc:chat-message', msg);
					// topiChatSocket.emit('tc:chat-message', msg);
					TopiChatService.emit('tc:chat-message', msg);
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
