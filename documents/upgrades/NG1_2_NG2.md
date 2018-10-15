# Links

With CLI

+ [ngUpgrade with Angular-cli](https://stackoverflow.com/questions/50822079/ngupgrade-with-angular-cli)
+ [A story of ngUpgrade: Upgrading an AngularJS application from 1.6 to Angular 4](https://medium.com/code-divoire/a-story-of-ngupgrade-bringing-an-angularjs-application-from-1-6-to-angular-4-84eae4434010)
+ [Angular v4: Hybrid Upgrade Application](https://hackernoon.com/angular-v4-hybrid-upgrade-application-73d5afba1e01)
+ [NgUpgrade in Depth](https://blog.nrwl.io/ngupgrade-in-depth-436a52298a00)
+ [Upgrade from AngularJS to Angular 2](https://medium.com/@gsari/upgrade-from-angularjs-to-angular-2-15f3179b7849)

Without CLI

+ https://angular.io/guide/upgrade
+ http://blog.rangle.io/upgrade-your-application-to-angular-2-with-ng-upgrade/
+ [Get Started with ngUpgrade: Going from AngularJS to Angular](https://scotch.io/tutorials/get-started-with-ngupgrade-going-from-angularjs-to-angular)

# Procedures

a NG1 ES5 provider:

```js
topiChatServices.provider('TopiChatService', function TopiChatServiceProvider(){
	// privateData: "privatno",
	var _isActive = true;

	this.setActive = function(isActive){
		_isActive = isActive;
	};

	this.$get = ['socketFactory', '$rootScope', 'ENV', /*'$q', */
	function(socketFactory, $rootScope, ENV /*$q */) {
		// var that = this;

		var _socket;

		var provider = {
			plugins: {},

			init: function(){
				if(!_isActive) return;

				_socket = socketFactory(_sfOptions);
				this.emit('tc:client-hello', msg);
			},

			emit: function(eventName, msg){
                // ...
				_socket.emit(eventName, tcPackage);
			}
		};

		provider.init();

		return provider;
	}];
});
```

becomes a NG1 ES5 service:

```js
topiChatServices.service('TopiChatService', ['socketFactory', '$rootScope', 'ENV',
	function TopiChatServiceProvider(socketFactory, $rootScope, ENV){
	// privateData: "privatno",
	var _isActive = true;

	this.setActive = function(isActive){
		_isActive = isActive;
	};

	// var that = this;

	var _socket;
	var _sfOptions;

	var provider = {
		plugins: {},

		init: function(){
			if(!_isActive) return;

			_socket = socketFactory(_sfOptions);
			this.emit('tc:client-hello', msg);
		},

		emit: function(eventName, msg){
            // ...
			_socket.emit(eventName, tcPackage);
		}
	};
	provider.init();
	return provider;
}]);
```

which becomes a NG1 TS-class service:

```js
export class TopiChatService {
    plugins:any = {};

    private _isActive:boolean = true;
    private _socket:any;
    private _sfOptions:any;

    // dependencies
    private socketFactory;
    private $rootScope;
    private ENV;

    constructor(socketFactory, $rootScope, ENV) {
        console.log("[TopiChatService] ENV: ", ENV);
        this.socketFactory = socketFactory;
        this.$rootScope = $rootScope;
        this.ENV = ENV;

        this.init();
    };

    init() {
        if(!this._isActive) return;

        this._socket = this.socketFactory(this._sfOptions);
        this.emit('tc:client-hello', msg);
    };

    emit(eventName, msg) {
        // ...
        this._socket.emit(eventName, tcPackage);
    };
}

```

with registration:

```js
import {TopiChatService} from '../components/topiChat/topiChatService';

var topiChatServices = angular.module('topiChatServices');
topiChatServices
    .service('TopiChatService', TopiChatService);

upgradeAdapter.upgradeNg1Provider('TopiChatService');
```
