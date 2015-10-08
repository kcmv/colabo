(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var plugins = {
	ontov: {
		path: 'ontov'
	}
};

module.exports = function(grunt) {
	// Project configuration.
	var initConfig = {
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// define the files to lint
			files: ['gruntfile.js' 
			        , 'app/js/**/*.js', '!app/js/lib/**/*.js'
			        , 'components/knalledgeMap/js/**/*.js', '!components/knalledgeMap/js/lib/**/*.js'
			        ],
			// ignores: ['app/js/lib/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				laxcomma: true, // http://jshint.com/docs/options/#laxcomma
				newcap: false, // http://jshint.com/docs/options/#newcap
				// more options here if you want to override JSHint defaults
				latedef: "nofunc", // http://jshint.com/docs/options/#latedef
				shadow: "inner", // http://jshint.com/docs/options/#shadow
				undef: true, // http://jshint.com/docs/options/#undef
				unused: true, // http://jshint.com/docs/options/#unused
				funcscope: false, // http://jshint.com/docs/options/#funcscope
				globals: { // http://jshint.com/docs/options/#globals
					jQuery: true,
					$: true,
					angular: true,
					console: true,
					module: true,
					d3: true,
					interact: true,
					window: true,
					KeyboardJS: true,

					// application related global objects
					interaction: true,
					mcm: true,
					TreeHtml: true,
					knalledge: true
				}
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				autoWatch: true
			}
		},
		protractor: {
			options: {
				configFile: "node_modules/protractor/example/conf.js", // Default config file
				keepAlive: true, // If false, the grunt process stops when the test fails.
				noColor: false, // If true, protractor will not use colors in its output.
				args: {
					// Arguments passed to the command
				}
			},
			your_target: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
				options: {
					configFile: "e2e.conf.js", // Target-specific config file
					args: {} // Target-specific arguments
				}
			},
		},
		compass: {
			app_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['app/sass', 'components/knalledgeMap/sass'],
					cssDir: ['app/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			app_dev: { // Another target
				options: {
					sassDir: ['app/sass'],
					cssDir: ['app/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			map_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/knalledgeMap/sass'],
					cssDir: ['components/knalledgeMap/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			map_dev: { // Another target
				options: {
					sassDir: ['components/knalledgeMap/sass'],
					cssDir: ['components/knalledgeMap/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			rima_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/rima/sass'],
					cssDir: ['components/rima/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			rima_dev: { // Another target
				options: {
					sassDir: ['components/rima/sass'],
					cssDir: ['components/rima/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			notify_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/notify/sass'],
					cssDir: ['components/notify/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			notify_dev: { // Another target
				options: {
					sassDir: ['components/notify/sass'],
					cssDir: ['components/notify/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			topiChat_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/topiChat/sass'],
					cssDir: ['components/topiChat/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			topiChat_dev: { // Another target
				options: {
					sassDir: ['components/topiChat/sass'],
					cssDir: ['components/topiChat/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			collaboPlugins_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/collaboPlugins/sass'],
					cssDir: ['components/collaboPlugins/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			collaboPlugins_dev: { // Another target
				options: {
					sassDir: ['components/collaboPlugins/sass'],
					cssDir: ['components/collaboPlugins/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			login_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/login/sass'],
					cssDir: ['components/login/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			login_dev: { // Another target
				options: {
					sassDir: ['components/login/sass'],
					cssDir: ['components/login/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			}
		},
		concat: {
			// https://www.npmjs.com/package/grunt-contrib-concat
			// http://gruntjs.com/configuring-tasks#globbing-patterns
			options: {
				// define a string to put between each file in the concatenated output
				separator: grunt.util.linefeed // ';' // https://github.com/gruntjs/grunt-contrib-concat#separator
			},
			dist: {
				// the files to concatenate
				src: [
					'app/js/**/*.js',
					'!app/js/lib/**/*.js'
				],
				// the location of the resulting JS file
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			js: {
				files: ['<%= jshint.files %>'],
				tasks: ['jshint', 'notify:watch_js']
			},
			app_css: {
				files: ['app/sass/**/*.{scss,sass}'],
				tasks: ['compass:app_dev', 'notify:watch_css'],
			},
			map_css: {
				files: ['components/knalledgeMap/sass/**/*.{scss,sass}'],
				tasks: ['compass:map_dev', 'notify:watch_css'],
			},
			rima_css: {
				files: ['components/rima/sass/**/*.{scss,sass}'],
				tasks: ['compass:rima_dev', 'notify:watch_css'],
			},
			notify_css: {
				files: ['components/notify/sass/**/*.{scss,sass}'],
				tasks: ['compass:notify_dev', 'notify:watch_css'],
			},
			topiChat_css: {
				files: ['components/topiChat/sass/**/*.{scss,sass}'],
				tasks: ['compass:topiChat_dev', 'notify:watch_css'],
			},
			collaboPlugins_css: {
				files: ['components/collaboPlugins/sass/**/*.{scss,sass}'],
				tasks: ['compass:collaboPlugins_dev', 'notify:watch_css'],
			},
			login_css: {
				files: ['components/login/sass/**/*.{scss,sass}'],
				tasks: ['compass:login_dev', 'notify:watch_css'],
			}
		},
		concurrent: {
			watch: {
				tasks: ['watch:js', 'watch:app_css', 'watch:map_css', 'watch:rima_css', 'watch:notify_css', 'watch:topiChat_css', 'watch:collaboPlugins_css', 'watch:login_css'],
				options: { logConcurrentOutput: true }
			},
			dev: {
				tasks: ['jshint', 'compass:app_dev', 'compass:map_dev', 'compass:rima_dev', 'compass:notify_dev', 'compass:topiChat_dev', 'compass:collaboPlugins_dev', 'compass:login_dev'],
				options: { logConcurrentOutput: true }
			},
			dist: {
				tasks: ['jshint', 'compass:app_dist', 'compass:map_dist', 'compass:rima_dist', 'compass:notify_dist', 'compass:topiChat_dist', 'compass:collaboPlugins_dist', 'compass:login_dist'],
				options: { logConcurrentOutput: true }
			}
		},
		notify: {
			watch_js: {
				options: {
					title: "<%= pkg.name %>", // defaults to the name in package.json, or will use project directory's name
					message: 'JSHint finished running', //required
				}
			},
			'watch_css': {
				options: {
					title: "<%= pkg.name %>", // defaults to the name in package.json, or will use project directory's name
					message: 'SASS finished running', //required
				}
			}
		}
	};

	for(var pluginName in plugins){

		// distribution target
		initConfig.compass[pluginName+"_dist"] =
		{
			options: { // Target options
				// config: 'config/config.rb',
				sassDir: ['components/'+pluginName+'/sass'],
				cssDir: ['components/'+pluginName+'/css'],
				outputStyle: "nested",
				environment: 'production',
				noLineComments: true,
				require: ["susy", "breakpoint"],
				trace: true
			}
		};
		// development target
		initConfig.compass[pluginName+"_dev"] =
		{
			options: {
				sassDir: ['components/'+pluginName+'/sass'],
				cssDir: ['components/'+pluginName+'/css'],
				outputStyle: "nested", // expanded, nested, compact, compressed
				environment: 'development',
				noLineComments: false,
				require: ["susy", "breakpoint"],
				trace: true
			}
		};
		// watch target
		initConfig.watch[pluginName+"_css"] =
		{
			files: ['components/'+pluginName+'/sass/**/*.{scss,sass}'],
			tasks: ['compass:'+pluginName+'_dev', 'notify:watch_css'],
		};

		// concurent targets
		initConfig.concurrent.watch.tasks.push('watch:'+pluginName+'_css');
		initConfig.concurrent.dev.tasks.push('compass:'+pluginName+'_dev');
		initConfig.concurrent.dist.tasks.push('compass:'+pluginName+'_dist');
	}

	grunt.initConfig(initConfig);
	
	// Load plugins that provides the "uglify", ... tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-notify');
	
	// Default task(s).
	grunt.registerTask('default', ['concurrent:dev', 'concurrent:watch']);
	grunt.registerTask('build', ['jshint', 'compass', 'concat', 'uglify', 'compass:dist']);
	grunt.registerTask('test', ['jshint', /* 'qunit'*/]);
};

}()); // end of 'use strict';