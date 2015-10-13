(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('ontovDirectives', ['Config'])
	.directive('ontovSearch', ['$rootScope', '$q', 'OntovService',
		function($rootScope, $q, OntovService){
		console.log("[ontovSearch] loading directive");
		return {
			restrict: 'AE',
			scope: {
				'readonly': '=',
				'node': "="
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/ontov/partials/ontov-search.tpl.html',
			controller: function ( $scope, $element) {
				$scope.bindings = {
				};

				$scope.nodesByIdNo = 0;
				$scope.edgesByIdNo = 0;
				var mapStructure = null;
				var mapUpdate = null;

				var mapReferencePromise = OntovService.getReference('map').$promise;
				var mapApiPromise = OntovService.getApi('map').$promise;
				var items = $q.all({reference: mapReferencePromise, api: mapApiPromise}).then(function(promiseResults){
					mapStructure = promiseResults.reference.items.mapStructure;
					mapUpdate = promiseResults.api.items.update;

					$scope.$watch(function(){
						return Object.keys(mapStructure.nodesById).length;
					}, function(){
						$scope.nodesByIdNo = Object.keys(mapStructure.nodesById).length;
					}, true);

					$scope.$watch(function(){
						return Object.keys(mapStructure.edgesById).length;
					}, function(){
						$scope.edgesByIdNo = Object.keys(mapStructure.edgesById).length;
					}, false);
				});

				$scope.reduceDepth = function(){
					// mapStructure.edgesById = {};
					console.log("Cutting");
					for(var edgeId in mapStructure.edgesById){
						var vkEdge = mapStructure.edgesById[edgeId];
						if(vkEdge.kEdge.sourceId == mapStructure.rootNode.kNode._id) continue;

						// 1. delete all non-root edges
						// delete mapStructure.edgesById[edgeId];

						// 2. make invisible all non-root edges
						// vkEdge.visible = false;

						// 3. make invisible all non-root-connected nodes
						// mapStructure.getVKNodeByKId(vkEdge.kEdge.targetId)
						// 	.visible = false;
					}
					// alert("Cutting");
					mapUpdate();
				};
			}
    	};
	}])

}()); // end of 'use strict';
