(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var ontovServices = angular.module('ontovServices', ['ontovDirectives', 'collaboPluginsServices']);

/**
* 	factory 'NotificationService'
*/

var ontovPluginInfo;

ontovServices
.run(['$q', 'CollaboPluginsService'
	, function($q, CollaboPluginsService /*, $rootScope*/) {

		ontovPluginInfo = {
			name: "Ontov",
			components: {

			},
			references: {
				map: {
					items: {
						mapStructure: null
					},
					$resolved: false,
					callback: null,
					$promise: null
				}
			},
			apis: {
				map: {
					items: {
						update: null
					},
					$resolved: false,
					callback: null,
					$promise: null
				}
			}
		};

		ontovPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
			ontovPluginInfo.references.map.callback = function(){
				ontovPluginInfo.references.map.$resolved = true;
				resolve(ontovPluginInfo.references.map);
				// reject('not allowed');				
			};
		});

		ontovPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
			ontovPluginInfo.apis.map.callback = function(){
				ontovPluginInfo.apis.map.$resolved = true;
				resolve(ontovPluginInfo.apis.map);
				// reject('not allowed');				
			};
		});

		CollaboPluginsService.registerPlugin(ontovPluginInfo);
	}])
.provider('OntovService', {
	// privateData: "privatno",
	$get: ['CollaboPluginsService' /*, '$rootScope', */
	, function(CollaboPluginsService /*, $rootScope*/) {

		var provider = {
			init: function(){
			},

			getReferenceItems: function(referenceName){
				// wrong reference
				if(!referenceName in ontovPluginInfo.references){
					return null;
				}

				// not resolved yet
				if(!ontovPluginInfo.references[referenceName].$resolved){
				}

				return ontovPluginInfo.references[referenceName].items;
			},

			getReference: function(referenceName){
				// wrong reference
				if(!referenceName in ontovPluginInfo.references){
					return null;
				}

				// not resolved yet
				if(!ontovPluginInfo.references[referenceName].$resolved){
				}

				return ontovPluginInfo.references[referenceName];
			},

			getApi: function(apiName){
				// wrong reference
				if(!apiName in ontovPluginInfo.apis){
					return null;
				}

				// not resolved yet
				if(!ontovPluginInfo.apis[apiName].$resolved){
				}

				return ontovPluginInfo.apis[apiName];
			}
		};
		provider.init();
		return provider;
	}]
});

}()); // end of 'use strict';