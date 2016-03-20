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
