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
        scope: {},
        templateUrl: 'components/knalledgeMap/partials/knalledgeMap-list.tpl.html',
        link: function($scope, $element, $attrs, simplemde) {
          var GlobalEmitterServicesArray = $injector.get('GlobalEmitterServicesArray');

          // notofication to external world that node property is changed and still in the editing mode
          var knalledgePropertyChangedEvent = "knalledgePropertyChangedEvent";
          GlobalEmitterServicesArray.register(knalledgePropertyChangedEvent);

          // notofication to external world that node property is changed and finished editing
          var knalledgePropertyChangedFinishedEvent = "knalledgePropertyChangedFinishedEvent";
          GlobalEmitterServicesArray.register(knalledgePropertyChangedFinishedEvent);

          // notification from external world that node property is changed and has to be updated
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

            if (simplemdeInstance) {
              simplemdeInstance.addEventListener('blur', function(event) {
                console.log("simplemdeInstance left");
              });
            }
          }, 500);

          $scope.policyConfig = KnalledgeMapPolicyService.provider.config;
          $scope.viewConfig = KnalledgeMapViewService.provider.config;

          $scope.enableEditing = function(enable) {
            if (typeof enable === 'undefined') enable = true;
            if ($scope.nodeContent.editing && !enable) {
              var markedOptions = {};
              if (marked.nodeEditor && marked.nodeEditor.renderer)
                markedOptions.renderer = marked.nodeEditor.renderer;
              $scope.nodeContent.htmlProperty = marked($scope.nodeContent.property, markedOptions);

              if ($scope.nodeContent.node) {
                GlobalEmitterServicesArray.get(knalledgePropertyChangedFinishedEvent).broadcast('knalledgeMapList', $scope.nodeContent);
              }
            }
            $scope.nodeContent.editing = enable;
          };

          $scope.simpleMdeOptions = {
            spellChecker: false
          };

          $scope.propertyChanged = function() {
            switch ($scope.viewConfig.editors.defaultType) {
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

            if ($scope.nodeContent.editing && $scope.nodeContent && $scope.nodeContent.node) {
              GlobalEmitterServicesArray.get(knalledgePropertyChangedFinishedEvent).broadcast('knalledgeMapList', $scope.nodeContent);
            }

            //console.warn('nodeContent.node:'+nodeContent.node);
            console.info("[knalledgeMapList] [on:%s] nodeContent.node: %s (%s), property: %s", changeKnalledgePropertyEvent, (nodeContent.node ? nodeContent.node.id : null),
              (nodeContent.node ? nodeContent.node.kNode._id : null), nodeContent.property);
            $scope.nodeContent.editing = false;
            $scope.nodeContent.node = nodeContent.node;
            $scope.nodeContent.property = nodeContent.property;
            $scope.nodeContent.htmlProperty = nodeContent.property;
            $scope.nodeContent.propertyType = nodeContent.propertyType;
            switch (nodeContent.propertyType) {
              case 'text/markdown':
                var markedOptions = {};
                if (marked.nodeEditor && marked.nodeEditor.renderer)
                  markedOptions.renderer = marked.nodeEditor.renderer;

                $scope.nodeContent.htmlProperty = marked(nodeContent.property,
									markedOptions
								);
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
