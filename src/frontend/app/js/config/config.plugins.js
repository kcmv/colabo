(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var plugins = {
	"rima": {
        active: true,
        config: {
            rimaService: {
                waitToReceiveRimaList: true
            }
        }
	}
};

if(typeof window.Config === 'undefined') window.Config = {};
window.Config.plugins = plugins;

angular.module('Config')
	.constant("ENV", env);

}()); // end of 'use strict';
