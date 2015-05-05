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

var rimaUserServices = angular.module('rimaUserServices', ['ngResource', 'Config']);

rimaUserServices.provider('RimaUsersService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV', /*'$rootScope', */
	function($q, ENV/*, $rootScope*/) {
		var items = [
			// {
			// 	_id: 0,
			// 	name: "Unknown",
			// 	user: "unknown"
			// },
			{
				_id: 5,
				name: "Sasha",
				user: "Sasha"
			},
			{
				_id: 1,
				name: "Anna",
				user: "Anna"
			},
			{
				_id: 2,
				name: "Scott",
				user: "Scott"
			},
			{
				_id: 3,
				name: "Eunseo",
				user: "Eunseo"
			},
			{
				_id: 4,
				name: "Laura",
				user: "Laura"
			},
			{
				_id: 8,
				name: "Chuck",
				user: "Chuck"
			},
			{
				_id: 6,
				name: "Martin",
				user: "Martin"
			},
			{
				_id: 7,
				name: "Ilya",
				user: "Ilya"
			}
		];

		var selectedItem = (items && items.length) ? items[0] : null;

		// var that = this;
		return {
			getUsers: function(){
				return items;
			},

			getUserById: function(id){
				var item = null
				for(var i in items){
					if(items[i]._id == id){
						item = items[i];
					}
				}
				return item;
			},

			selectActiveUser: function(item){
				selectedItem = item;
			},

			getActiveUser: function(){
				return selectedItem;
			},

			getActiveUserId: function(){
				return selectedItem ? selectedItem._id : undefined;
			},

			getMaxUserNum: function(){
				var gridMaxNum = 0;
				var items = this.items();
				for(var i in items){
					var grid = items[i];
					var gridId = parseInt(grid.name.substring(2));
					if(gridId > gridMaxNum){
						gridMaxNum = gridId;
					}
				}
				return gridMaxNum;
			},

			getUsersByName: function(nameSubStr){
				var returnedGrids = [];
				var items = this.items();
				for(var i in items){
					var grid = items[i];
					if(grid.name.indexOf(nameSubStr) > -1){
						returnedGrids.push(grid);
					}
				}
				return returnedGrids;
			}
		};
	}]
});

}()); // end of 'use strict';