if (!global.hasOwnProperty('queue_broker')) {
	console.log("Setting up global.queue_broker");
	global.queue_broker = {
		debug: true,

		// https://www.rabbitmq.com/uri-spec.html
        // amqp://user:pass@host.com:port/vhost
		// url: 'amqp://guest:guest@localhost:5672',
		url: 'amqp://colabo:colabo_usr56@158.39.75.31:5672',
		// url: 'amqp://localhost:5672',
		queue: 'colabo-service',
		// queue: 'colabo-service-localhost',

		shouldRequestResult: true,
		noAck: true,

		shouldListenOnSeparateResponseQueue: false,
		separateResponseQueue: 'colabo-service-response'
		// separateResponseQueue: 'colabo-service-response-localhost'
	};
}

module.exports = global;