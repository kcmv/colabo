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
	var _apis = {};
	var _componentsByPlugins = {};
	var _referencesByPlugins = {};
	
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
		for(var referenceName in pluginOptions.references){
			if(!(referenceName in _referencesByPlugins)){
				_referencesByPlugins[referenceName] = [];
			}
			var referenceByPlugins = _referencesByPlugins[referenceName];
			referenceByPlugins.push(pluginOptions);
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

			provideReferences: function(referenceName, items){
				console.log("[CollaboPluginsService::provideReferences] providing references from the reference provided '%s'", referenceName);
				var referenceByPlugins = _referencesByPlugins[referenceName];
				for(var i=0; i<referenceByPlugins.length; i++){
					var pluginOptions = referenceByPlugins[i];
					var pluginReferences = pluginOptions.references[referenceName];
					console.log("[CollaboPluginsService::provideReferences] providing references to the plugin '%s'", pluginOptions.name);
					if(!pluginReferences){
						console.error("[CollaboPluginsService::provideReferences] missing reference '%s' for the plugin '%s' that registered for that reference?!", referenceName, pluginOptions.name);
						continue;
					}
					for(var itemName in pluginReferences.items){
						if(!(itemName in items)){
							console.error("[CollaboPluginsService::provideReferences] plugin '%s' asked for the item '%s' that references provider '%s' doesn't provide?!", pluginOptions.name, itemName, referenceName);
							continue;
						}
						pluginReferences.items[itemName] = items[itemName];
					}
					pluginReferences.resolved = true;
					if(pluginReferences.callback) pluginReferences.callback();
				}
			},

			provideApi: function(apiName, api){
				console.log("[CollaboPluginsService::provideReferences] providing api from the api provider: '%s'", apiName);
				_apis[apiName] = api;
			},


			getApi: function(apiName, api){
				// console.log("[CollaboPluginsService::provideReferences] providing api from the api provider: '%s'", apiName);
				return _apis[apiName];
			},

			getPluginContent: function(pluginName){
				
			}

		};

		provider.init();

		return provider;
	}];
});


}()); // end of 'use strict';