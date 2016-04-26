(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var plugins = {
	"knalledgeMap": {
        active: true,
        config: {
            knalledgeMapVOsService: {
				// should map participants be broadcasted after loading map
                broadcastMapUsers: true
            }
        }
	},
	"rima": {
        active: true,
        config: {
            whoAmIService: {
				// should the service wait for users be broadcasted from other components
				// (like KnalledgeMapVOsService) or request loading all of them?
                waitToReceiveRimaList: false
            }
        }
	}
};

if(typeof window.Config === 'undefined') window.Config = {};
window.Config.Plugins = plugins;

angular.module('Config')
	.constant("Plugins", plugins);

}()); // end of 'use strict';
