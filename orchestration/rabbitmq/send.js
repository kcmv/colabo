#!/usr/bin/env node

let config = require('./config');

let amqp = require('amqplib/callback_api')
let url = config.global.queue_broker.url;
console.log("Accessing queue_broker at: ", url);
amqp.connect(url, function(err, conn) {
    if(conn){
        conn.createChannel(function(err, ch) {
            var q = 'hello';
            ch.assertQueue(q, {durable: false});
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(q, new Buffer('Hello World from Node.js!'));
            console.log(" [x] Sent 'Hello World from Node.js!'");
        });
    }
    if(err){
        console.error("Error while connecting to queue broker: ", err);
        
    }
});