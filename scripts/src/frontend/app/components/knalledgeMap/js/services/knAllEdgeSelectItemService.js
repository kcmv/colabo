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
* @class KnAllEdgeSelectItemService
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnAllEdgeSelectItemService', {
	$get: ['$compile', /*'$q', 'ENV', '$rootScope', */
	function($compile /*$q , ENV, $rootScope*/) {

		// privateData: "privatno",

		var map, $scope, $element;
		var provider = {
			itemsDescs: [],
			itemType: null,

			_init: function(){
			},

			init: function(_map, _$scope, _$element){
				map = _map;
				$scope = _$scope;
				$element = _$element;
			},

			setItemsDescs: function(itemsDescs){
				this.itemsDescs = itemsDescs;
			},

			getItemsDescs: function(){
				return this.itemsDescs;
			},

			getItemsDescsByName: function(nameSubStr){
				nameSubStr = nameSubStr.toLowerCase();
				var returnedItems = [];
				switch(this.itemType){
					case "kNode":
						for(var i in this.itemsDescs){
							var item = this.itemsDescs[i];
							if(item.name.toLowerCase().indexOf(nameSubStr) > -1){
								returnedItems.push(item);
							}
						}
						break;
					case "vkNode":
						for(var i in this.itemsDescs){
							var item = this.itemsDescs[i];
							if(item.kNode.name.toLowerCase().indexOf(nameSubStr) > -1){
								returnedItems.push(item);
							}
						}
						break;
				}
				return returnedItems;
			},

			getItemsDescsByDataContent: function(search){
				search = search.toLowerCase();
				var returnedItems = [];
				switch(this.itemType){
					case "kNode":
						for(var i in this.itemsDescs){
							var item = this.itemsDescs[i];
							if(item.dataContent && item.dataContent.property && item.dataContent.property.toLowerCase().indexOf(search) > -1){
								returnedItems.push(item);
							}
						}
						break;
					case "vkNode":
						for(var i in this.itemsDescs){
							var item = this.itemsDescs[i];
							if(item.kNode.dataContent && item.kNode.dataContent.property && item.kNode.dataContent.property.toLowerCase().indexOf(search) > -1){
								returnedItems.push(item);
							}
						}
						break;
				}
				return returnedItems;
			},

			openSelectItem: function(items, labels, callback, itemType){
				console.log("[KnAllEdgeSelectItemService] selecting Item out of %d items", items.length);
				this.itemsDescs = items;
				this.itemType = (typeof itemType == 'undefined') ? 'kNodes' : itemType;

				var directiveScope = $scope.$new(); // $new is not super necessary
				// create popup directive
				var directiveLink = $compile("<div knalledge_map_select_item labels='labels' class='knalledge_map_select_item'></div>");
				// link HTML containing the directive
				var directiveElement = directiveLink(directiveScope);
				$element.append(directiveElement);

				// directiveScope.mapEntity = mapEntity;
				directiveScope.labels = labels;
				directiveScope.shouldSubmitOnSelection = true;

				directiveScope.selectingCanceled = function(){
					console.log("[KnAllEdgeSelectItemService:openSelectItem] selectingCanceled");
				}.bind(this);

				directiveScope.selectingSubmited = function(item){
					try {
						console.log("[KnAllEdgeSelectItemService:openSelectItem] Added entity to addingInEntity: %s", JSON.stringify(item));
					}
					catch(err) {
						console.log("[KnAllEdgeSelectItemService:openSelectItem] Added entity to addingInEntity with name: %s", JSON.stringify(item.name));
					}

					if(typeof callback === 'function') callback(item);
				}.bind(this);
			}
		};

		provider._init();

		return provider;
	}]
})

}()); // end of 'use strict';
