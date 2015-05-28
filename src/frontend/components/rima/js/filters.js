angular.module('rimaFilters',[]).filter('whatSeparator',function(){
	// filter with multiple parameters
	// http://stackoverflow.com/questions/16227325/how-do-i-call-an-angular-js-filter-with-multiple-arguments
	// http://stackoverflow.com/questions/18792039/angularjs-multiple-filter-with-custom-filter-function
	// http://stackoverflow.com/questions/15868248/how-to-filter-multiple-values-or-operation-in-angularjs
	// http://suhairhassan.com/2013/07/25/angularjs-in-depth-part-2.html
	// filter with html output:
	// 	http://stackoverflow.com/questions/13251581/how-to-create-angularjs-filter-which-outputs-html
	// 	http://stackoverflow.com/questions/14692354/angular-filter-that-generates-html
	// it could be better done with directive instead of filter injecting html code and links
	return function(isLast) {
		return (!isLast ? ", " : ""); 
	};
});

angular.module('rimaFilters', [])
	.filter('topicsFromWhats',function(){
		// filter with multiple parameters
		// http://stackoverflow.com/questions/16227325/how-do-i-call-an-angular-js-filter-with-multiple-arguments
		// http://stackoverflow.com/questions/18792039/angularjs-multiple-filter-with-custom-filter-function
		// http://stackoverflow.com/questions/15868248/how-to-filter-multiple-values-or-operation-in-angularjs
		// http://suhairhassan.com/2013/07/25/angularjs-in-depth-part-2.html
		// filter with html output:
		// 	http://stackoverflow.com/questions/13251581/how-to-create-angularjs-filter-which-outputs-html
		// 	http://stackoverflow.com/questions/14692354/angular-filter-that-generates-html
		// it could be better done with directive instead of filter injecting html code and links
		return function(whats, topics){
			//var topics = "Creation.initialize";
			
			//console.log("[whatsFilters:dataFilterIdea] topics:%s, whats:%s", topics, JSON.stringify(whats));
			// if(topics == null || topics == undefined || topics == 'all'){
			// 	return whats;
			// }
			//var topics = ['5566c62cbb09e90677658a60', '5566c62cbb09e90677658a61', '5566c62cbb09e90677658a62'];

			var whatsOut = [];
			for(var wid=0; wid<whats.length; wid++){
				for(var tid in topics){
					if(whats[wid]._id == topics[tid]){
						//console.log("[whatsFilters:dataFilterIdea] matched data:%s", JSON.stringify(whats[i]));
						whatsOut.push(whats[wid]);
					}else{
						//console.log("[whatsFilters:dataFilterIdea] mismatched data:%s", JSON.stringify(whats[i]));
					}
				}
			}
			return whatsOut;
		};
	}
);