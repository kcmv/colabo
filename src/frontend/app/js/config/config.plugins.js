(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var plugins = {
	"ViewComponents": {
		"knalledgeMap.Main": {
			components: {
				TopPanel: {
					active: true,
					path: "/components/topPanel/topPanel"
				}
			}
		},
		"knalledgeMap.KnalledgeMapTools": {
			components: {
				GardeningControls: {
					active: true,
					path: "/components/gardening/gardening-controls.component"
				},
				RimaUsersList: {
					active: true,
					path: "/components/rima/rimaUsersList"
				},
				IbisTypesList: {
					active: true,
					path: "/components/knalledgeMap/ibisTypesList"
				}
			}
		}
	},
	"knalledgeMap": {
        active: true,
        config: {
            knalledgeMapVOsService: {
				// should map participants be broadcasted after loading map
                broadcastMapUsers: true
            },
			knAllEdgeRealTimeService: {
                available: true
            }
        }
	},
	"topPanel": {
        active: true,
        config: {
            suggestion: {
				available: false
            },
			request: {
				available: false
            },
        }
	},
	"mapsList": {
		active: true,
		config: {
			title: 'CollaboFramework',
			//map_path,
			//
			openMap: {
				routes: [{
					route: '/mcmap',
					name: 'McM-map',
					icon: ''
				}, {
					route: '/map',
					name: 'map',
					icon: ''
				}]
			}
		}
	},
	"ontov": {
        active: true
	},
	"rima": {
        active: true,
        config: {
            rimaService: {
				available: true,
				ANONYMOUS_USER_ID: "55268521fb9a901e442172f8",
				// should the service wait for users be broadcasted from other components
				// (like KnalledgeMapVOsService) or request loading all of them?
                waitToReceiveRimaList: true
            }
        }
	},
	"request": {
        active: true,
        services: {
            requestService: {
				name: 'RequestService',
				path: 'request.RequestService'
				// icons: {
				// 	showRequests: {
				// 		position: "nw",
				// 		iconClass: "fa-bell",
				// 		action: "showRequests"
				// 	}
				// }
            }
        },
		plugins: {
			mapVisualizeHaloPlugins: ['requestService'],
			// mapInteractionPlugins: ['requestService'],
			keboardPlugins: ['requestService']
		}
	},
	notify: {
		active: true,
		services: {
			NotifyNodeService: {
			}
		},
		plugins: {
			mapVisualizePlugins: ['NotifyNodeService']
		}
	},
	gardening: {
		active: true,
		services: {
			ApprovalNodeService: {
			}
		},
		plugins: {
			mapVisualizePlugins: ['ApprovalNodeService']
		}
	}
};

if(typeof window.Config === 'undefined') window.Config = {};
window.Config.Plugins = plugins;

angular.module('Config')
	.constant("Plugins", plugins);

}()); // end of 'use strict';
