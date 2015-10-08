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

	/*
	_plugins is hash set to the registered system plugins
	each key represents the name of plugin, and value represents plugin options
	*/
	var _plugins = {};

	/*
	_apis are references ("pointers") to system APIs
	exported and provided for use inside of the system plugins 
	*/
	var _apis = {};
	var _apisByPlugins = {};

	/* hash of references of components used by plugins
		each element has a name of component as the key and 
		list of references to pluginOptions that utilize particular component
		_componentsByPlugins = {
			'componentName1': [Object, Object, ...],
			'componentName2': [Object, Object, ...],
			...
		}	
	*/
	var _componentsByPlugins = {};

	/*
	_references are references ("pointers") to system objects, structures, components, ...
	exported and provided for use inside of the system plugins
		_references = {
			referenceName1: {
				{
					itemName1: null,
					itemName2: null,
					...
				}
			},
			referenceName2: {
				...
			},
			...
		}
	*/
	var _references = {};

	/* hash of references ("pointers") of references used by plugins
		each element has a name of component as the key and 
		list of references to pluginOptions that utilize particular component
		_referencesByPlugins = {
			'componentName1': [Object, Object, ...],
			'componentName2': [Object, Object, ...],
			...
		}	
	*/
	var _referencesByPlugins = {};

	this.setActive = function(isActive){
		_isActive = isActive;
	};

	/* It registers plugin with structure
		{
			name: "...",
			components: {
	
			},
			references: {
				referenceName1: {
					items: {
						itemName1: null,
						itemName2: null,
						...
					}
				}
			}
		}
		where:

		* name is the name of the plugin
		* components is the set of
	*/
	var _registerPlugin = function(pluginOptions) {
		if(!_isActive) return;
		var pluginName = pluginOptions.name;
		console.log('[CollaboPluginsService:registerPlugin] Registering plugin: %s', pluginName);
		_plugins[pluginName] = pluginOptions;

		// refer all plugin components into _componentsByPlugins
		for(var componentName in pluginOptions.components){
			if(!(componentName in _componentsByPlugins)){
				_componentsByPlugins[componentName] = [];
			}
			var componentByPlugins = _componentsByPlugins[componentName];
			componentByPlugins.push(pluginOptions);
		}

		// refer all plugin references into _referencesByPlugins
		for(var referenceName in pluginOptions.references){
			if(!(referenceName in _referencesByPlugins)){
				_referencesByPlugins[referenceName] = [];
			}
			var referenceByPlugins = _referencesByPlugins[referenceName];
			referenceByPlugins.push(pluginOptions);
			// distribute reference immediatelly if reference provider has already provided it
			_distributeReferences(referenceName);
		}

		// refer all plugin apis into _apisByPlugins
		for(var apiName in pluginOptions.apis){
			if(!(apiName in _apisByPlugins)){
				_apisByPlugins[apiName] = [];
			}
			var apiByPlugins = _apisByPlugins[apiName];
			apiByPlugins.push(pluginOptions);
			// distribute api immediatelly if api provider has already provided it
			_distributeApis(apiName);
		}
	};

	/*
	At the moment of registering of plugins and their requirements for specific references it is not likely that those references are still not provided to the plugin system yet.
	Therefore we need to support providing them back to plugin when they are ready.
	This function is called with the reference name and that reference will be propagated to all plugins that were asking for it
	*/
	var _distributeReferences = function(referenceName){
		var items = _references[referenceName];
		if(!items) return;
		var referenceByPlugins = _referencesByPlugins[referenceName];
		if (!referenceByPlugins) return;

		// iterate through all plugins that registered for the reference <referenceName>
		for(var i=0; i<referenceByPlugins.length; i++){
			var pluginOptions = referenceByPlugins[i];
			var pluginReference = pluginOptions.references[referenceName];
			console.log("[CollaboPluginsService::_distributeReferences] providing references to the plugin '%s'", pluginOptions.name);
			if(!pluginReference){
				console.error("[CollaboPluginsService::_distributeReferences] missing reference '%s' for the plugin '%s' that registered for that reference?!", referenceName, pluginOptions.name);
				continue;
			}

			// iterate through all items that plugin asked for inside the reference <referenceName>
			for(var itemName in pluginReference.items){
				if(!(itemName in items)){
					console.error("[CollaboPluginsService::_distributeReferences] plugin '%s' asked for the item '%s' that references provider '%s' doesn't provide?!", pluginOptions.name, itemName, referenceName);
					continue;
				}

				// set the proper reference (pointer) to the item inside the reference
				pluginReference.items[itemName] = items[itemName];
			}

			// inform the plugin about $resolved reference
			pluginReference.$resolved = true;
			if(pluginReference.callback) pluginReference.callback();
		}
	};

	/*
	At the moment of registering of plugins and their requirements for specific apis it is not likely that those apis are still not provided to the plugin system yet.
	Therefore we need to support providing them back to plugin when they are ready.
	This function is called with the api name and that api will be propagated to all plugins that were asking for it
	*/
	var _distributeApis = function(apiName){
		var items = _apis[apiName];
		if(!items) return;
		var apiByPlugins = _apisByPlugins[apiName];
		if (!apiByPlugins) return;

		// iterate through all plugins that registered for the api <apiName>
		for(var i=0; i<apiByPlugins.length; i++){
			var pluginOptions = apiByPlugins[i];
			var pluginApi = pluginOptions.apis[apiName];
			console.log("[CollaboPluginsService::_distributeReferences] providing apis to the plugin '%s'", pluginOptions.name);
			if(!pluginApi){
				console.error("[CollaboPluginsService::_distributeReferences] missing api '%s' for the plugin '%s' that registered for that api?!", apiName, pluginOptions.name);
				continue;
			}

			// iterate through all items that plugin asked for inside the api <apiName>
			for(var itemName in pluginApi.items){
				if(!(itemName in items)){
					console.error("[CollaboPluginsService::_distributeReferences] plugin '%s' asked for the item '%s' that apis provider '%s' doesn't provide?!", pluginOptions.name, itemName, apiName);
					continue;
				}

				// set the proper api (pointer) to the item inside the api
				pluginApi.items[itemName] = items[itemName];
			}

			// inform the plugin about $resolved api
			pluginApi.$resolved = true;
			if(pluginApi.callback) pluginApi.callback();
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

		_distributeApis(apiName);
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

			getPluginsInfo: function(){
				return _plugins;
			},

			getReferencesInfo: function(){
				return _references;
			},

			getApisInfo: function(){
				return _apis;
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