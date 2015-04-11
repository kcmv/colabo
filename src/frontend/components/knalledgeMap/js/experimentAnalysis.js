(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var bukvikServices = angular.module('bukvikServices');

// bukvikServices.factory('ExperimentAnalysisService', ['DatasService', 'IAmActiveService', function(DatasService, IAmActiveService){
bukvikServices.factory('ExperimentAnalysisService', ['$q', 'DatasService', function($q, DatasService){
	// creationId is parameter that will be replaced with real value during the service call from controller

	var resource = {
		get: function(analysisId, callback){
			var data = {
					$promise: null,
					$resolved: false
				};

			data.$promise = $q(function(resolve, reject) {
				DatasService.get({ideaId: 8, searchParam: analysisId}, function(dataGot){
					var analysis = dataGot.dataContent;
					for(var id in analysis){
						data[id] = analysis[id];
					}
					data.$resolved = true;
					resolve(data);
					//var dataStr = JSON.stringify(data, null, "\t");

					var cache = [];
					var dataStr = JSON.stringify(data, function(key, value) {
					    if (typeof value === 'object' && value !== null) {
					        if (cache.indexOf(value) !== -1) {
					            // Circular reference found, discard key
					        	console.log("JSON.Caching: key=%s", key);
					            return;
					        }
					        // Store value in our collection
					        cache.push(value);
					    }
					    return value;
					});
					cache = null; // Enable garbage collection
					console.log("ExperimentAnalysisService: analysis: "+dataStr);

					if(callback) callback(data);
				}, function(error){
					reject("Error accessing analysis"+JSON.stringify(error));
				});
			});
			return data;
		},
		query: function(namespace, name, callback){
			return DatasService.query({ideaId: 8, searchParam: namespace + ":" + name}, function(datas){
				var analyses = [];
				for(var i=0; i<datas.length; i++){
					var data = datas[i];
					var analysis = data.dataContent;
					analyses.push(analysis); 
				}
				if(callback) callback(analyses);
			});
		},
		// TODO: support returning promise
		queryFull: function(namespace, name, callback){
			// var promise = null;
			DatasService.query({ideaId: 8, searchParam: namespace + ":" + name}, function(datas){
				var promises = [];
				for(var i=0; i<datas.length; i++){
					var data = datas[i];
					var dataFull = DatasService.get({ideaId: 8, searchParam: data.id});
					promises.push(dataFull.$promise);
				}
				$q.all(promises).then(function(datas){
					var analyses = [];

					for(var i=0; i<datas.length; i++){
						var dataFull = datas[i];
						var analysis = dataFull.dataContent;
						analysis.$id = dataFull.id;
						analyses.push(analysis);
					}
					if(callback) callback(analyses);
				});
			});
		},
		create: function(dataset, analysis, callback){
			var iAm = null; // IAmActiveService.getLastActiveUserSync();
			if(!iAm){
				iAm = {iAmId: 2};
				// alert("You must be logged in");
				// return;
			}
		
			var data = {};
			data.name = dataset.namespace + ":" + dataset.name;
			data.iAmId = iAm.iAmId;
			data.ideaId = 8;
			data.version = 1;
			data.isPublic = true;
			data.dataContentSerialized = JSON.stringify(analysis);
			data.stateContentSerialized = JSON.stringify("");
			
			return DatasService.create({}, data, function(dataCreated){
				analysis.$id = dataCreated.id;
				if(callback){
					callback(analysis, dataCreated);
				}
			});
		},
		// TODO: support returning promise
		updateContent: function(analysis, callback){
			var iAm = null; // IAmActiveService.getLastActiveUserSync();
			if(!iAm){
				iAm = {iAmId: 2};
				// alert("You must be logged in");
				// return;
			}
		
			return DatasService.get({ideaId: 8, searchParam: analysis.$id}, function(data){
				data.dataContent = analysis;
				DatasService.update({ideaId: 8}, data, function(dataUpdated){
					if(callback){
						callback(analysis, dataUpdated.dataContent);
					}
				});	
			});
		},
		destroy: function(analysis, callback){
			var iAm = null; // IAmActiveService.getLastActiveUserSync();
			if(!iAm){
				iAm = {iAmId: 2};
				// alert("You must be logged in");
				// return;
			}
		
			return DatasService.destroy({ideaId: 8, searchParam: analysis.$id}, function(/*data*/){
				if(callback && typeof callback === 'function') callback(analysis);
			});
		}
	};
	return resource;
}]);

}()); // end of 'use strict';