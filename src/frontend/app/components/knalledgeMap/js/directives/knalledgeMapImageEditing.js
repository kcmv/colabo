(function() { // This prevents problems when concatenating scripts that aren't strict.
	'use strict';

	/**
	 * the namespace for core services for the KnAllEdge system
	 * @namespace knalledge.knalledgeMap.knalledgeMapDirectives
	 */

   angular.module('knalledgeMapDirectives')

	 .directive('knalledgeMapImageEditing', [function() {
		 return {
			 restrict: 'AE',
			 // ng-if directive: http://docs.angularjs.org/api/ng.directive:ngIf
			 // expression: http://docs.angularjs.org/guide/expression
			 templateUrl: 'components/knalledgeMap/partials/knalledgeMap-imageEditing.tpl.html',
			 controller: function($scope, $element) {
				 $scope.title = "Create Image for node";
				 if (!('image' in $scope)) {
					 $scope.image = {
						 url: "http://upload.wikimedia.org/wikipedia/commons/e/e9/Meister_von_Mileseva_001.jpg",
						 width: 200,
						 height: 262
					 };
					 $scope.image = {
						 url: "http://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg",
						 width: 200,
						 height: 268
					 };
				 }

				 $scope.cancelled = function() {
					 //console.log("Canceled");
					 $element.remove();
				 };

				 $scope.submitted = function() {
					 console.log("Submitted: %s", JSON.stringify($scope.image));
					 $scope.addedImage($scope.image);
					 $element.remove();
				 };

				 // http://stackoverflow.com/questions/11442712/javascript-function-to-return-width-height-of-remote-image-from-url
				 var getImageMeta = function(url, callback) {
					 var img = new Image();
					 img.src = url;
					 img.onload = function() {
						 callback(this.width, this.height);
					 }
					 img.onerror = function() {
						 callback();
					 }
				 };

				 $scope.urlChanged = function() {
					 getImageMeta(
						 $scope.image.url,
						 function(width, height) {
							 $scope.$apply(function() {
								 // alert(width + 'px ' + height + 'px');
								 $scope.image.width = width;
								 $scope.image.height = height;
							 });
						 }
					 );
				 }

				 var placeEntities = function( /*entities, direction*/ ) {

				 };

				 placeEntities($element);
				 $scope.entityClicked = function(entity, event, childScope) {
					 console.log("[mcmMapSelectSubEntity] entityClicked: %s, %s, %s", JSON.stringify(entity), event, childScope);
				 };
			 }
		 };
	 }])

}()); // end of 'use strict';
