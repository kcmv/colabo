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
* @class KnalledgeMapQueue
* @memberof knalledge.knalledgeMap.knalledgeMapServices
*/
knalledgeMapServices.provider('KnalledgeMapQueue', {
	//KnalledgeMapQueue.execute({data: kNode, callback:callback, resource_type:resource.RESOURCE_TYPE, method: "create", processing: {"RESOLVE":resolve, "REJECT":reject, "EXECUTE": resource.execute, "CHECK": resource.check}});
	// privateData: "privatno",
	$get: [/*'$q', '$rootScope', '$window',*/ function(/*$q, $rootScope, $window*/) {
		// var that = this;
		var provider = {
			queue: [],
			//OLD: not used any more linkToServices: {}, //KnalledgeMapQueue.link(resource.RESOURCE_TYPE, {"EXECUTE": resource.execute, "CHECK": resource.check});
			STATE_ADDED:"STATE_ADDED",
			STATE_BLOCKED:"STATE_BLOCKED",
			STATE_SENT:"STATE_SENT",
			STATE_EXECUTED:"STATE_EXECUTED",
			SERVICE_METHOD_EXECUTE:"EXECUTE",
			SERVICE_METHOD_CHECK:"CHECK",
			SERVICE_METHOD_CREATE:"create",
			SERVICE_METHOD_UPDATE:"update",
			req_no:0,
			//TODO: create timeout calling flush()?

			execute: function(request){
				request.state = this.STATE_ADDED;
				request.no = this.req_no++;
				this.queue.push(request);
				this.flush();
			},

			flush: function(){
				for(var i in this.queue){
					var request = this.queue[i];
					if((request.state != this.STATE_SENT && request.state != this.STATE_EXECUTED) && request.processing[this.SERVICE_METHOD_CHECK](request) && this.check(request,i)){
						request.state = this.STATE_SENT;
						request.processing[this.SERVICE_METHOD_EXECUTE](request);
					}
				}
			},

			check: function(request,index){
				/* update cannot be sent if it is updating resource (VO) that is still not created  */
				if(request.method == this.SERVICE_METHOD_UPDATE){
					if(request.data.state == knalledge.KEdge.STATE_LOCAL){ //TODO: we check for KEdge.STATE_LOCAL even though it might be KNode. but they have same values so it is fine
						return false;
					}
				}
//				for(var i = 0; i<index;i++){ //goes through all previous requests
//					var prev_request = this.quest[i];
//					if(prev_request.id && prev_request.)
//				}
				return true;
			},

			executed:function(request){
				for(var i in this.queue){
					var requestT = this.queue[i];
					if(requestT.no == request.no){ //TODO: should (could) be simplified to if(requestT == request)
						request.state = this.STATE_EXECUTED;
						//TODO: FOR TESTING BLOCKING UPDATES BEFORE CREATES: request.data.state = knalledge.KEdge.STATE_LOCAL;
						//NOT NEEDED: DONE IN CONSTRUCTOR. request.data.state = knalledge.KEdge.STATE_SYNCED; //TODO: we check for KEdge.STATE_LOCAL even though it might be KNode. but they have same values so it is fine;
						this.queue.splice(i, 1);
						break;
					}
				}
				this.flush(); //trying to execute some other request being dependent on executed request
			}


//			link: function(resource, methods){
//				this.linkToServices[resource] = methods
//
//			}

//			updateNode: function(node) {
//				KnalledgeNodeService.update(node); //updating on server service
//			}
		};
		window.queueTest = provider.queue; //TODO:REMOVE
		return provider;
	}]
});


}()); // end of 'use strict';
