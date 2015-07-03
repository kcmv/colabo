(function () { // This prcomponents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var collaboPluginsServices = angular.module('collaboPluginsServices', ['ngResource', 'Config']);

collaboPluginsServices.provider('CollaboPluginsService', function CollaboPluginsServiceProvider(){
	// privateData: "privatno",
	var _isActive = true;
	var _plugins = {};
	var _apis = {};
	var _componentsByPlugins = {};
	var _references = {};
	var _referencesByPlugins = {};

	this.setActive = function(isActive){
		_isActive = isActive;
	};

	var _registerPlugin = function(pluginOptions) {
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
			// distribute reference immediatelly if reference provider has already provide it
			_distributeReferences(referenceName);
		}
	};

	var _distributeReferences = function(referenceName){
		var items = _references[referenceName];
		if(!items) return;
		var referenceByPlugins = _referencesByPlugins[referenceName];
		if (!referenceByPlugins) return;
		for(var i=0; i<referenceByPlugins.length; i++){
			var pluginOptions = referenceByPlugins[i];
			var pluginReferences = pluginOptions.references[referenceName];
			console.log("[CollaboPluginsService::_distributeReferences] providing references to the plugin '%s'", pluginOptions.name);
			if(!pluginReferences){
				console.error("[CollaboPluginsService::_distributeReferences] missing reference '%s' for the plugin '%s' that registered for that reference?!", referenceName, pluginOptions.name);
				continue;
			}
			for(var itemName in pluginReferences.items){
				if(!(itemName in items)){
					console.error("[CollaboPluginsService::_distributeReferences] plugin '%s' asked for the item '%s' that references provider '%s' doesn't provide?!", pluginOptions.name, itemName, referenceName);
					continue;
				}
				pluginReferences.items[itemName] = items[itemName];
			}
			pluginReferences.resolved = true;
			if(pluginReferences.callback) pluginReferences.callback();
		}
	};

	var _provideReferences = function(referenceName, items){
		console.log("[CollaboPluginsService::provideReferences] providing references from the reference provided '%s'", referenceName);
		_references[referenceName] = items;

		_distributeReferences(referenceName);
	};

	var _provideApi = function(apiName, api){
		console.log("[CollaboPluginsService::provideReferences] providing api from the api provider: '%s'", apiName);
		_apis[apiName] = api;
	};

	this.provideReferences = _provideReferences;
	this.registerPlugin = _registerPlugin;
	this.provideApi = _provideApi;

	this.$get = ['$rootScope', 'ENV', /*'$q', */
	function($rootScope, ENV /*$q */) {
		// var that = this;

		var provider = {
			init: function(){
				if(!_isActive) return;
			},

			getPlugin: function(pluginName){

			},

			registerPlugin: _registerPlugin,

			// reference provider provides references (with referenceName) for others to retrieve them
			provideReferences: _provideReferences,

			// api provider provides api (with apiName name) to be registered with the collaboplugins service and available for others to use it
			provideApi: _provideApi,

			// api consumers can ask for particular api
			getApi: function(apiName){
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