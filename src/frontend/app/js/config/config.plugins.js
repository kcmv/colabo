(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var plugins = {
	"knalledgeMap": {
        active: true,
        config: {
            knalledgeMapVOsService: {
                broadcastMapUsers: true
            }
        }
	},
	"rima": {
        active: true,
        config: {
            whoAmIService: {
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
