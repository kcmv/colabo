(function() { // This prevents problems when concatenating scripts that aren't strict.
	'use strict';

	/**
	 * the namespace for core services for the KnAllEdge system
	 * @namespace knalledge.knalledgeMap.knalledgeMapDirectives
	 */

   angular.module('knalledgeMapDirectives')


	 .directive('knalledgeMapList', ['$rootScope', '$injector', '$timeout', 'KnalledgeMapPolicyService', 'KnalledgeMapViewService',
		 /*, '$window', 'KnalledgeNodeService', 'KnalledgeEdgeService', '$q', */
		 function($rootScope, $injector, $timeout, KnalledgeMapPolicyService, KnalledgeMapViewService /*, $window, KnalledgeNodeService, KnalledgeEdgeService, $q*/ ) {
			 return {
				 restrict: 'AE',
				 // crashes here
				 // https://toddmotto.com/directive-to-directive-communication-with-require/
				 // http://stackoverflow.com/questions/15672709/how-to-require-a-controller-in-an-angularjs-directive
				 // https://demisx.github.io/angularjs/directives/2014/11/25/angular-directive-require-property-options.html
				 // http://websystique.com/angularjs/angularjs-custom-directives-controllers-require-option-guide/
				 // https://docs.angularjs.org/guide/directive
				 //  require: 'simplemde',
				 scope: {},
				 // ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
				 // expression: http://docs.angularjs.org/guide/expression
				 templateUrl: 'components/knalledgeMap/partials/knalledgeMap-list.tpl.html',
				 link: function($scope, $element, $attrs, simplemde) {
					 // http://docs.angularjs.org/guide/directive
					 var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');
					 var knalledgePropertyChangedEvent = "knalledgePropertyChangedEvent";
					 GlobalEmitterServicesArray.register(knalledgePropertyChangedEvent);

					 var knalledgePropertyChangedFinishedEvent = "knalledgePropertyChangedFinishedEvent";
					 GlobalEmitterServicesArray.register(knalledgePropertyChangedFinishedEvent);

					 var changeKnalledgePropertyEvent = "changeKnalledgePropertyEvent";
					 GlobalEmitterServicesArray.register(changeKnalledgePropertyEvent);

					 /*
					 var simplemdeInstance = simplemde.get(); // => SimpleMDE instance
					 // simplemde.rerenderPreview();
					 // https://codemirror.net/doc/manual.html#events
					 simplemdeInstance.codemirror.on("blur", function(){
						 console.log(simplemdeInstance.value());
					 });
					 */

					 $scope.nodeContent = {
						 htmlProperty: "",
						 editing: false
					 };

					 // TODO: try to react on loosing focus on the editor
					 // as a moment of storing node properties
					 $timeout(function() {
						 // http://stackoverflow.com/questions/21700364/javascript-adding-click-event-listener-to-class
						 var simplemdeInstance = document.querySelector(".knalledge-edit");

						 if(simplemdeInstance){
							 simplemdeInstance.addEventListener('blur', function(event) {
								 console.log("simplemdeInstance left");
							 });
						 }
					 }, 500);

					 $scope.policyConfig = KnalledgeMapPolicyService.provider.config;
					 $scope.viewConfig = KnalledgeMapViewService.provider.config;

					 $scope.enableEditing = function(enable) {
						 if(typeof enable === 'undefined') enable = true;
						 if($scope.nodeContent.editing && !enable){
							 $scope.nodeContent.htmlProperty = marked($scope.nodeContent.property);

							 GlobalEmitterServicesArray.get(knalledgePropertyChangedFinishedEvent).broadcast('knalledgeMapList', $scope.nodeContent);
						 }
						 $scope.nodeContent.editing = enable;
					 };

					 $scope.simpleMdeOptions = {
						 spellChecker: false
					 };

					 $scope.propertyChanged = function() {
						 switch($scope.viewConfig.editors.defaultType){
							 case 'text/markdown':
								 $scope.nodeContent.propertyType = 'text/markdown';
								 break;

							 case 'text/html':
							 default:
								 $scope.nodeContent.propertyType = 'text/html';
								 $scope.nodeContent.property = $scope.nodeContent.htmlProperty;
								 break;
						 }
						 console.info("[knalledgeMapList:propertyChanged] $scope.nodeContent.property: %s", $scope.nodeContent.property);
						 //console.log("result:" + JSON.stringify(result));
						 GlobalEmitterServicesArray.get(knalledgePropertyChangedEvent).broadcast('knalledgeMapList', $scope.nodeContent);
					 };

					 // notification on node or its content changed
					 GlobalEmitterServicesArray.get(changeKnalledgePropertyEvent).subscribe('knalledgeMapList', function(nodeContent) {
						 //console.warn('nodeContent.node:'+nodeContent.node);
						 console.info("[knalledgeMapList] [on:%s] nodeContent.node: %s (%s), property: %s", changeKnalledgePropertyEvent, (nodeContent.node ? nodeContent.node.id : null),
							 (nodeContent.node ? nodeContent.node.kNode._id : null), nodeContent.property);
						 $scope.nodeContent.editing = false;
						 $scope.nodeContent.node = nodeContent.node;
						 $scope.nodeContent.property = nodeContent.property;
						 $scope.nodeContent.htmlProperty = nodeContent.property;
						 $scope.nodeContent.propertyType = nodeContent.propertyType;
						 marked.setOptions({
							 gfm: true // this should be true by default
						 });
						 switch(nodeContent.propertyType){
							 case 'text/markdown':
								 $scope.nodeContent.htmlProperty = marked(nodeContent.property);
								 break;

							 case 'text/html':
							 default:
								 $scope.nodeContent.htmlProperty = nodeContent.property;
								 $scope.nodeContent.property = nodeContent.property ?
									 toMarkdown(nodeContent.property, {
										 gfm: true
									 }) : "";
								 $scope.nodeContent.propertyType = 'text/markdown';
								 break;
						 }
					 });
				 }
			 };
		 }
	 ])

   }()); // end of 'use strict';
