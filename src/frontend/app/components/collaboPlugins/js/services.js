/**
* the namespace for the knalledgeMap part of the KnAllEdge system
* @namespace collaboframework.plugins
*/

(function () { // This prcomponents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

/**
* @description
* ## Info
* This namespace contains all code relevant to the CollaboFramework plugins implementation
* @namespace knalledge.collaboPluginsServices
*/

var collaboPluginsServices = angular.module('collaboPluginsServices', ['ngResource', 'Config']);

/**
@classdesc Provides the API to Collabo plugins
The 2 most important parts of the service are

Representing Collabo System to plugins:

+ ***_apis*** - all API provided by Collabo system (api providers registers them)
+ ***_references*** - all references provided by Collabo system
	(they probable have to be refactored and wrapped into API)
	(reference providers registers them)

Collabo system plugins:

+ ***_plugins*** - all registed plugins
+ ***_componentsByPlugins*** -

@class CollaboPluginsService
@memberof knalledge.collaboPluginsServices
@constructor
*/

collaboPluginsServices.provider('CollaboPluginsService', function CollaboPluginsServiceProvider(){
	// privateData: "privatno",

	/**
	 * This variable determines if the Collabo Plugin system is in the ***active state***
	 * @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	 * @var  {Boolean} isActive
	 */
	var _isActive = true;

	/*
	*/

	/**
	 * Plugin registering structure
	 * example:
	 * ```js
	 * 	{
	 * 		name: "...",
	 * 		components: {
	 *
	 * 		},
	 * 		references: {
	 * 			referenceName1: {
	 * 				$resolved: false,
	 * 				callback: ...,
	 * 				items: {
	 * 					itemName1: {},
	 * 					itemName2: {},
	 * 					...
	 * 				}
	 * 			}
	 * 		},
	 * 		apis: {
	 * 			apiName1: {
	 * 				$resolved: false,
	 * 				callback: ...,
	 * 				items: {
	 * 					itemName1: {},
	 * 					itemName2: {},
	 * 					...
	 * 				}
	 * 			}
	 * 		}
	 * 	}
	 * ```
	 *
	 * @typedef {Object} PluginRegisterStructure
	 * @memberof knalledge.collaboPluginsServices
	 * @property {string} name - plugin name
	 * @property {Array.<string,Object>} components -
	 *
	 * @property {Array.<string,Object>} references - list of references plugin requires
	 * @property {Array.<string,Object>} references.<a_reference> -
	 * 		this is just a placeholder of a provisionary reference in the references hash array
	 * @property {boolean} references.<a_reference>.$resolved - is the reference resolved
	 * (can plugin use it)
	 * TODO: add promise here
	 * @property {Function} references.<a_reference>.callback - callback to be called when the reference gets resolved
	 * @property {Array.<string,Object>} references.<a_reference>.items - a
	 *  	hash list of items that plugin require from the reference
	 * @property {*} references.<a_reference>.items.<an_item> -
	 * 		this is just a placeholder of a provisionary item in the references' item hash array/.
	 * 		Its value can be (currently) any defined (i.e. non-undefined) value, just to confirm our interest
	 *
	 * @property {Array.<string,Object>} apis - list of apis plugin requires
	 * @property {Array.<string,Object>} apis.<an_api> -
	 * 		this is just a placeholder of a provisionary api in the apis hash array
	 * @property {boolean} apis.<an_api>.$resolved - is the api resolved
	 * (can plugin use it)
	 * TODO: add promise here
	 * @property {Function} apis.<an_api>.callback - callback to be called when the api gets resolved
	 * @property {Array.<string,Object>} apis.<an_api>.items - a
	 *  	hash list of items that plugin require from the api
	 * @property {*} apis.<an_api>.items.<an_item> -
	 * 		this is just a placeholder of a provisionary item in the apis' item hash array/.
	 * 		Its value can be (currently) any defined (i.e. non-undefined) value, just to confirm our interest
	*/

	/**
	 * This is the palce where all ***Collabo plugins*** ends up when they got registered.
	 * It is a hash array of where each key represents the name of the plugin,
	 * and value represents reference to the plugin options.
	 * @var  {Array.<string, knalledge.collaboPluginsServices.PluginRegisterStructure>}
	 *       _plugins - registered plugins
	 * @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	*/
	var _plugins = {};

	/**
	 * API structure
	 *
	 * example:
	 * ```js
	 * 	{
	 * 		name: "...",
	 * 		items: {
	 * 			itemName1: {},
	 * 			itemName2: {},
	 * 			...
	 * 		}
	 * 	}
	 * ```
	 *
	 * @typedef {Object} ApiStructure
	 * @memberof knalledge.collaboPluginsServices
	 * @property {string} name - API name
	 * @property {Array.<string,Object>} items - a
	 *  	hash list of items that the API provides
	 * @property {*} items.<an_item> -
	 * 		this is just a placeholder of a provisionary item in the API's items hash array.
	 * 		Its value is a reference to the particular API item implementation that plugin can use
	*/

	/**
	 * 	The _apis variable contains *references ("pointers")* to
	 * 	***the Collabo system APIs*** exported and provided for the use
	 * 	inside of the ***Collabo plugins***
	 * 	Each item is a separate API addressed with the api name as a key.
	 * 	Each item (API) is represented as a list of items that API provides
	 * 	TODO: API Item should be more expanded as suggested in
	 * 		the knalledge.collaboPluginsServices.ApiStructure @ typedef
	 * @var  {Array.<string, knalledge.collaboPluginsServices.ApiStructure>} _apis
	 * @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	*/
	var _apis = {};

	/**
	*  This is a hash of references ("pointers") of the ***APIs used by plugins***.
	*
	*  Each element has a ***name of the API*** as the key and
	*  list of plugins that utilze the particluar API.
	*  The list of plugins for each API is basically a list of references to
	*  the plugins' pluginOptions:
	*
	*  ```js
	*	_apisByPlugins = {
	*	  	'componentName1': [plugin1Options, plugin2Options, ...],
   	*	  	'componentName2': [plugin1Options, plugin3Options, ...],
   	*	  	...
	*	}
	*  ```
	* @var  {Array.<string, Array.<knalledge.collaboPluginsServices.PluginRegisterStructure>>} _apisByPlugins
	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	*/
	var _apisByPlugins = {};

	/**
	 * TODO: This is not currently used, should it be removed?!
	 * So far it looks it is something that Collabo system provides, and plugins consume.
	 *
	 *  This is a hash of references of ***components used by plugins***.
	 *
	 *  Each element has a ***name of the component*** as the key and
	 *  list of plugins that utilze the particular component.
	 *  The list of plugins for each component is basically a list of references to
	 *  the plugins' pluginOptions:
	 *
	 *  ```js
	 *  _componentsByPlugins = {
	 *  	'componentName1': [plugin1Options, plugin2Options, ...],
	 *  	'componentName2': [plugin1Options, plugin3Options, ...],
	 *  	...
	 *  }
	 *  ```
	 * @var  {Array.<string, Array.<knalledge.collaboPluginsServices.PluginRegisterStructure>>} _componentsByPlugins
	 * @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	*/
	var _componentsByPlugins = {};

	/**
	 * Reference structure
	 * example:
	 * ```js
	 * 	{
	 * 		name: "...",
	 * 		items: {
	 * 			itemName1: {},
	 * 			itemName2: {},
	 * 			...
	 * 		}
	 * 	}
	 * ```
	 *
	 * @typedef {Object} ReferenceStructure
	 * @memberof knalledge.collaboPluginsServices
	 * @property {string} name - reference name
	 * @property {Array.<string,Object>} items -
	 *  	a hash list of items that the reference provides
	 * @property {*} items.<an_item> -
	 * 		this is just a placeholder of a provisionary item in the reference's items hash array.
	 * 		Its value is a reference to the particular reference's item that plugin can use
	*/


	/**
	 * _references variable contains references ("pointers") to the
	 * ***system objects, structures, components, ...***
	 * exported and provided for the use inside of the Collabo plugins
	 *
	 * @var  {Array.<string, knalledge.collaboPluginsServices.ReferenceStructure>} _references
	 * @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	*/
	var _references = {};

	/**
	*  This is a hash of references ("pointers") of the ***references used by plugins***.
	*
	*  Each element has a ***name of the component*** as the key and
	*  list of plugins that utilze to particluar component.
	*  The list of plugins for each component is basically a list of references to
	*  the plugins' pluginOptions:
	*
	*  ```js
	*	_referencesByPlugins = {
	*	  	'componentName1': [plugin1Options, plugin2Options, ...],
   	*	  	'componentName2': [plugin1Options, plugin3Options, ...],
   	*	  	...
	*	}
	*  ```
	* @var  {Array.<string, Array.<knalledge.collaboPluginsServices.PluginRegisterStructure>>} _referencesByPlugins
	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	*/
	var _referencesByPlugins = {};

	/**
	* @var {debugPP} debug - namespaced debug for the class
	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	*/
	var debug = debugpp.debug('knalledge.collaboPluginsServices.CollaboPluginsService');


	/**
	 * Sets the Collabo Plugin system in the active state
	 * @function setActive
	 * @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	 * @param  {Boolean} isActive - the state of Collabo Plugin system
	 * @return {knalledge.collaboPluginsServices.CollaboPluginsService} returns the reference to itself to support fluid interface
	 */
	this.setActive = function(isActive){
		_isActive = isActive;
		return this;
	};

	/**
	* It registers plugin with the structure
	*
	* where:
	*
 	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	* @param  {knalledge.collaboPluginsServices.PluginRegisterStructure} pluginOptions - options for the plugin
	*/
	var _registerPlugin = function(pluginOptions) {
		if(!_isActive) return;

		var pluginName = pluginOptions.name;
		debug.log('[registerPlugin] Registering plugin: %s', pluginName);

		_plugins[pluginName] = pluginOptions;

		// TODO: This is currently not used
		// register all plugin's components into _componentsByPlugins
		for(var componentName in pluginOptions.components){
			if(!(componentName in _componentsByPlugins)){
				_componentsByPlugins[componentName] = [];
			}
			var componentByPlugins = _componentsByPlugins[componentName];
			componentByPlugins.push(pluginOptions);
		}

		// refer all plugin's references into _referencesByPlugins
		for(var referenceName in pluginOptions.references){
			if(!(referenceName in _referencesByPlugins)){
				_referencesByPlugins[referenceName] = [];
			}
			var referenceByPlugins = _referencesByPlugins[referenceName];
			referenceByPlugins.push(pluginOptions);

			// distribute reference immediatelly if reference provider has already provided it
			_distributeReferences(referenceName);
		}

		// refer all plugin's required apis into _apisByPlugins
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

	/**
	* At the moment of registering a plugin and its requirements for specific references
	* it is possible that those references are not provided to the Collabo plugin system yet.
	*
	* Therefore we need to support pushing them back to the all intersted plugins when they are ready.
	*
	* This function is called with a reference name and then the reference that stands for that name
	* will be provided to all plugins that registered requirement for it
	*
	* * ***NOTE:*** At the current implementation plugins should be idempotent from the perspective of
	* the work done in the response to this method since it will most likely be invoked multiple times
	*
	*
	* @function _distributeReferences
	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	* @param  {string} referenceName - name of the reference the Collabo system is ready to distribute to plugins
	*/
	var _distributeReferences = function(referenceName){
		debug.log("[_distributeReferences] distributing the reference '%s' to plugins", referenceName);
		// get the items that the reference is providing
		if(!(referenceName in _references)) return;
		var items = _references[referenceName].items;
		if(!items) return;
		// get list of plugins interested in the reference
		var referenceByPlugins = _referencesByPlugins[referenceName];
		if (!referenceByPlugins) return;

		// iterate through all plugins that registered for the reference <referenceName>
		for(var i=0; i<referenceByPlugins.length; i++){
			// get the original options that plugin registered with and ...
			var pluginOptions = referenceByPlugins[i];
			// ... from it get plugin's requirements about the reference
			var pluginReference = pluginOptions.references[referenceName];
			debug.log("[_distributeReferences] providing the reference to the plugin '%s'", pluginOptions.name);
			if(!pluginReference){
				debug.error("[_distributeReferences] missing reference '%s' for the plugin '%s' that registered for that reference?!", referenceName, pluginOptions.name);
				continue;
			}

			// iterate through all items that plugin asked for inside the reference <referenceName>
			for(var itemName in pluginReference.items){
				if(!(itemName in items)){ // the item that is requested by plugin should be exported by the reference
					debug.error("[_distributeReferences] plugin '%s' asked for the item '%s' that references provider '%s' doesn't provide?!", pluginOptions.name, itemName, referenceName);
					continue;
				}

				// set the proper reference (pointer) to the item inside the reference
				pluginReference.items[itemName] = items[itemName];
			}

			// inform the plugin about $resolved reference
			pluginReference.$resolved = true;
			// TODO: Add before and trigger the promise here as well
			if(pluginReference.callback) pluginReference.callback(referenceName);
		}
	};

	/**
	* This function is called with a reference name and then the reference that stands for that name
	* will be revoked from all plugins that registered requirement for it
	*
	* * ***NOTE:*** At the current implementation plugins should be idempotent from the perspective of
	* the work done in the response to this method since it might be invoked multiple times
	*
	* @function _distributeReferencesRevoking
	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	* @param  {string} referenceName - name of the reference the Collabo system is about to revoke from plugins
	*/
	var _distributeReferencesRevoking = function(referenceName){
		debug.log("[_distributeReferencesRevoking] distributing the reference '%s' to plugins", referenceName);
		// get the items that the reference is providing
		if(!(referenceName in _references)) return;
		var items = _references[referenceName].items;
		if(!items) return;
		// get list of plugins interested in the reference
		var referenceByPlugins = _referencesByPlugins[referenceName];
		if (!referenceByPlugins) return;

		// iterate through all plugins that registered for the reference <referenceName>
		for(var i=0; i<referenceByPlugins.length; i++){
			// get the original options that plugin registered with and ...
			var pluginOptions = referenceByPlugins[i];
			// ... from it get plugin's requirements about the reference
			var pluginReference = pluginOptions.references[referenceName];
			if(!pluginReference){
				debug.error("[_distributeReferencesRevoking] missing reference '%s' for the plugin '%s' that registered for that reference?!", referenceName, pluginOptions.name);
				continue;
			}

			// iterate through all items that plugin asked for inside the reference <referenceName>
			for(var itemName in pluginReference.items){
				if(!(itemName in items)){ // the item that is requested by plugin should be exported by the reference
					debug.error("[_distributeReferencesRevoking] plugin '%s' asked for the item '%s' that references provider '%s' doesn't provide?!", pluginOptions.name, itemName, referenceName);
					continue;
				}

				// set the proper reference (pointer) to the item inside the reference
				delete pluginReference.items[itemName];
			}

			// inform the plugin about $resolved reference
			pluginReference.$resolved = false;
			// TODO: see if it is safe to call the same callback
			// if(pluginReference.callback) pluginReference.callback(referenceName, null);
		}
	};

	/**
	* At the moment of registering a plugin and its requirements for specific apis
	* it is possible that those apis are not provided to the Collabo plugin system yet.
	*
	* Therefore we need to support pushing them back to the all intersted plugins when they are ready.
	* This function is called with an api name and then the api that stands for that name
	* will be provided to all plugins that registered requirement for it.
	*
	* ***NOTE:*** At the current implementation plugins should be idempotent from the perspective of
	* the work done in the response to this method since it will most likely be invoked multiple times
	*
	* @function _distributeApis
	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	* @param  {string} apiName - name of the api the Collabo system is ready to distribute to plugins
	*/
	var _distributeApis = function(apiName){
		debug.log("[_distributeApis] distributing the api '%s' to plugins", apiName);
		// api items
		if(!(apiName in _apis)) return;
		var items = _apis[apiName].items;
		if(!items) return;
		// get all plugins that are interested in the api
		var apiByPlugins = _apisByPlugins[apiName];
		if (!apiByPlugins) return;

		// iterate through all plugins that registered for the api <apiName>
		for(var i=0; i<apiByPlugins.length; i++){
			// get the original options that plugin registered with and ...
			var pluginOptions = apiByPlugins[i];
			// ... from it get plugin's requirements about the api
			var pluginApi = pluginOptions.apis[apiName];
			debug.log("[_distributeApis] providing the api to the plugin '%s'", pluginOptions.name);
			if(!pluginApi){
				debug.error("[_distributeApis] missing api '%s' for the plugin '%s' that registered for that api?!", apiName, pluginOptions.name);
				continue;
			}

			// iterate through the all items that plugin asked for inside the api <apiName>
			for(var itemName in pluginApi.items){
				if(!(itemName in items)){ // the item that is requested by plugin should be exported by the api
					debug.error("[_distributeApis] plugin '%s' asked for the item '%s' that apis provider '%s' doesn't provide?!", pluginOptions.name, itemName, apiName);
					continue;
				}

				// set the proper pointer to the item inside the api
				pluginApi.items[itemName] = items[itemName];
			}

			// inform the plugin about $resolved api
			pluginApi.$resolved = true;
			// TODO: Add before and trigger the promise here as well
			if(pluginApi.callback) pluginApi.callback(apiName);
		}
	};

	/**
	* This function is called with an api name and then the api that stands for that name
	* will be revoked from all plugins that registered requirement for it.
	*
	* ***NOTE:*** At the current implementation plugins should be idempotent from the perspective of
	* the work done in the response to this method since it might be invoked multiple times
	*
	* @function _distributeApisRevoking
	* @memberof knalledge.collaboPluginsServices.CollaboPluginsService#
	* @param  {string} apiName - name of the api the Collabo system is about to revoke from plugins
	*/
	var _distributeApisRevoking = function(apiName){
		debug.log("[_distributeApisRevoking] distributing the api '%s' to plugins", apiName);
		// api items
		if(!(apiName in _apis)) return;
		var items = _apis[apiName].items;
		if(!items) return;
		// get all plugins that are interested in the api
		var apiByPlugins = _apisByPlugins[apiName];
		if (!apiByPlugins) return;

		// iterate through all plugins that registered for the api <apiName>
		for(var i=0; i<apiByPlugins.length; i++){
			// get the original options that plugin registered with and ...
			var pluginOptions = apiByPlugins[i];
			// ... from it get plugin's requirements about the api
			var pluginApi = pluginOptions.apis[apiName];
			debug.log("[_distributeApisRevoking] providing the api to the plugin '%s'", pluginOptions.name);
			if(!pluginApi){
				debug.error("[_distributeApisRevoking] missing api '%s' for the plugin '%s' that registered for that api?!", apiName, pluginOptions.name);
				continue;
			}

			// iterate through the all items that plugin asked for inside the api <apiName>
			for(var itemName in pluginApi.items){
				if(!(itemName in items)){ // the item that is requested by plugin should be exported by the api
					debug.error("[_distributeApisRevoking] plugin '%s' asked for the item '%s' that apis provider '%s' doesn't provide?!", pluginOptions.name, itemName, apiName);
					continue;
				}

				// set the proper pointer to the item inside the api
				pluginApi.items[itemName] = items[itemName];
			}

			// inform the plugin about $resolved api
			pluginApi.$resolved = true;
			// TODO: Add before and trigger the promise here as well
			if(pluginApi.callback) pluginApi.callback(apiName);
		}
	};

	var _provideReferences = function(referenceName, items){
		debug.log("[provideReferences] providing references from the reference provided '%s'", referenceName);
		_references[referenceName] = items;

		_distributeReferences(referenceName);
	};

	var _provideApi = function(apiName, api){
		debug.log("[provideApi] providing api from the api provider: '%s'", apiName);
		_apis[apiName] = api;

		_distributeApis(apiName);
	};

	var _revokeReferences = function(referenceName){
		debug.log("[revokeReferences] revoking references  '%s'", referenceName);
		delete _references[referenceName];

		_distributeReferencesRevoking(referenceName);
	};

	var _revokeApi = function(apiName){
		debug.log("[revokeApi] revoking api from the api revoker: '%s'", apiName);
		delete _apis[apiName];

		_distributeApisRevoking(apiName);
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
				// debug.log("[provideReferences] providing api from the api provider: '%s'", apiName);
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
