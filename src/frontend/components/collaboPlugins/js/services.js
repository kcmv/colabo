(function () { // This prcomponents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var bukvikApp=angular.module('bukvikApp');
bukvikApp.config(["TopiChatServiceProvider", function(TopiChatServiceProvider) {
  TopiChatServiceProvider.setActive(false);
}]);

var collaboPluginsServices = angular.module('collaboPluginsServices', ['ngResource', 'Config']);

collaboPluginsServices.provider('CollaboPluginsService', function CollaboPluginsServiceProvider(){
	// privateData: "privatno",
	var _isActive = true;
	var _plugins = {};
	var _componentsByPlugins = {};
	
	this.setActive = function(isActive){
		_isActive = isActive;
	};

	this.registerPlugin = function(pluginOptions) {
		if(!_isActive) return;
		var pluginName = pluginOptions.name;
		console.log('[CollaboPluginsService:registerPlugin] Registering plugin: %s', pluginName);
		_plugins[pluginName] = pluginOptions;
		for(var componentName in pluginOptions.components){
			if(!(componentName in _componentsByPlugins)){
				_componentsByPlugins[componentName] = [];
			}
			var componentByPlugins = _componentsByPlugins[componentName];
			componentByPlugins.push(pluginOptions);
		}
	};

	this.$get = ['$rootScope', 'ENV', /*'$q', */
	function($rootScope, ENV /*$q */) {
		// var that = this;

		var provider = {
			init: function(){
				if(!_isActive) return;
			},

			getPlugin: function(pluginName){

			},

			getPluginContent: function(pluginName){
				
			}

		};

		provider.init();

		return provider;
	}];
});


}()); // end of 'use strict';