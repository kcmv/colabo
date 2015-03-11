(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

angular.module('knalledgeMapDirectives', [])
	.directive('knalledgeMap', ['$timeout', '$document', function($timeout, $document){


		// http://docs.angularjs.org/guide/directive
		console.log("[knalledgeMap] loading directive");
		return {
			restrict: 'E',
			scope: {
				'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap.tpl.html',
			controller: function ( $scope, $element ) {
				$scope.config = {
					showMap: true
				};

				var mapCanvas = null;
				var knalledgeMapList = [];
				var edgeMapList = [];
				var knalledgeViewList = [];
				// var edgeViewList = [];
				var map = null;
				var knalledgeMapInitialize = function() {
					var checkMapCanvas = function(){
						mapCanvas = $document.find('#map-canvas');
						// TODO: #map-canvas object is created if $scope.config.showMap is set to true which is happening in this current code iteration
						// so it is still not processed and rendered in DOM, therefore we need to sleep and wait for the next iteration
						// solution to avoid this could be to put setting $scope.config.showMap in compile/link function, but only if it is not too early to make decission then
						
						if(!mapCanvas || mapCanvas.length <= 0){
							$timeout(checkMapCanvas, 10);
						}else{
							var mapCanvasObj = $element.find('#map-canvas').eq(0);
							//alert(mapCanvasObj.width());
							mapCanvasObj.height($($document).height() * 0.5);
							//alert(mapCanvasObj.height());

							map = d3.select("#map-canvas").append("svg");
							placeKnalledges(knalledgeMapList, edgeMapList);
						}
					};
					checkMapCanvas();
				};

				var position = 1;
				var placeKnalledge = function(knalledgeView, delay){
					console.log(knalledgeView, delay);
					if(!map || !knalledgeView) return;

					map
						.append("circle")
							.attr("r", 10)
							.attr("fill", "red")
							.attr("cx", 30 * position)
							.attr("cy", 20 * position);
					map
						.append("text")
							.attr("x", 10 + 30*position)
							.attr("y", 20*position)
							.text(knalledgeView.name)
							.attr("font-family", "sans-serif")
							.attr("font-size", "20px")
							.attr("fill", "gray");
					position++;
				};

				// var placeEdge = function(edgeView, delay){
				// 	// var edges = map.append("line")
				// 	// 	.attr("x1", 5)
				// 	// 	.attr("y1", 5)
				// 	// 	.attr("x2", 50)
				// 	// 	.attr("y2", 50)
				// 	// 	.attr("stroke-width", 2)
				// 	// 	.attr("stroke", "black");
				// };

				var placeKnalledges = function(knalledgeMapList, edgeMapList){
					if(!map || !knalledgeMapList || !edgeMapList) return;

					for(var i=0; i<knalledgeMapList.length; i++){
						var node = knalledgeMapList[i];
						var knalledgeView = {name: node.name};
						knalledgeViewList.push(knalledgeView);
						var delay = 3000 / knalledgeMapList.length;
						placeKnalledge(knalledgeView, i*delay);	
					}

					// for(var i=0; i<edgeMapList.length; i++){
					// 	var edge = edgeMapList[i];
					// 	var edgeView = {name: edge.name};
					// 	edgeViewList.push(edgeView);
					// 	var delay = 3000 / edgeMapList.length;
					// 	placeEdge(edgeView, i*delay);	
					// }
				};

				//google.maps.event.addDomListener(window, 'load', knalledgeMapInitializeMap);
				knalledgeMapInitialize();

				var eventName = "knalledgeMapList";
				$scope.$on(eventName, function(e, knalledge) {

					knalledgeMapList = knalledge.nodes;
					edgeMapList = knalledge.edges;
					console.log("[knalledgeMap.controller::$on] KnalledgeMap  nodes(len: %d): %s",
						knalledgeMapList.length, JSON.stringify(knalledgeMapList));
					console.log("[knalledgeMap.controller::$on] KnalledgeMap  edges(len: %d): %s",
						edgeMapList.length, JSON.stringify(edgeMapList));
					placeKnalledges(knalledgeMapList, edgeMapList);
				});
    		}	
    	};
	}])
	.directive('knalledgeMapControll', ['$rootScope', '$window', 'KnalledgeMapService', function($rootScope, $window, KnalledgeMapService){
		// http://docs.angularjs.org/guide/directive
		console.log("[knalledgeMapControll] loading directive");
		return {
			restrict: 'E',
			scope: {
				'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: '../components/knalledgeMap/partials/knalledgeMap-controll.tpl.html',
			controller: function ( $scope ) {
				$scope.knalledgeMapFull = KnalledgeMapService.query();
				$scope.knalledgeMapFull.$promise.then(function(result){
					console.log("[knalledgeMapControll] result.knalledgeMap.(nodes.length = %d, edges.length = %d)", 
						result.knalledgeMap.nodes.length, result.knalledgeMap.edges.length);
					console.log("[knalledgeMapControll] $scope.knalledgeMapFull.knalledgeMap.(nodes.length = %d, edges.length = %d)",
						result.knalledgeMap.nodes.length, result.knalledgeMap.edges.length);
					var eventName = "knalledgeMapList";
					$rootScope.$broadcast(eventName, $scope.knalledgeMapFull.knalledgeMap);
				}, function(fail){
					$window.alert("Error loading knalledgeMap: %s", fail);
				});				
    		}	
    	};
	}])
	.directive('knalledgeMapNode', [function(){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'E',
			scope: {
				'sale': '='
				,'isLast': '='
				// default options
				// 	https://github.com/angular/angular.js/issues/3804
				//	http://stackoverflow.com/questions/18784520/angular-directive-with-default-options
				//	https://groups.google.com/forum/#!topic/angular/Wmzp6OU4IRc
				,'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'modules/knalledgeMap/partials/sale-show.tpl.html',
			controller: function ( $scope ) {
				console.log($scope);
    		}
		};
	}])
	.directive('knalledgeMapEdge', [function(){
		// http://docs.angularjs.org/guide/directive
		return {
			restrict: 'E',
			scope: {
				'sale': '='
				,'isLast': '='
				// default options
				// 	https://github.com/angular/angular.js/issues/3804
				//	http://stackoverflow.com/questions/18784520/angular-directive-with-default-options
				//	https://groups.google.com/forum/#!topic/angular/Wmzp6OU4IRc
				,'readonly': '='
			},
			// ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			// expression: http://docs.angularjs.org/guide/expression
			templateUrl: 'modules/knalledgeMap/partials/sale-show.tpl.html',
			controller: function ( $scope) {
				console.log($scope);
    		}
		};
	}])
;

}()); // end of 'use strict';