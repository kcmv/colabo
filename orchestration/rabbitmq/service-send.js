#!/usr/bin/env node

let config = require('./config');

// let amqp = require('amqplib/callback_api')
let amqp = require('amqplib');

let url = config.global.queue_broker.url;
let queue = config.global.queue_broker.queue;
console.log("Accessing queue_broker at: '%s' on queue: '%s'", url, queue);

function getTimestamp() {
    return Math.floor(new Date().getTime()/1000);
}

let open = amqp.connect(url);

open.then(function(conn){
    return conn.createChannel();
}).then(function(ch){
    ch.assertQueue(queue, {durable: false}).then(function(ok) {
        let msg = {
                meta: {
                    timestamp: getTimestamp()
                },
                action: {
                    'name': 'get_sims_for_user'
                },
                params: {
                    mapId: '5b96619b86f3cc8057216a03',
                    iAmId: '5b9fbde97f07953d41256b32',
                    roundId: 1
                }
        };
        let bufferMsg = new Buffer(JSON.stringify(msg));
        ch.assertQueue(queue, {durable: false});
        // Note: on Node 6 Buffer.from(msg) should be used
        ch.sendToQueue(queue, bufferMsg);
        console.log(" [x] Sent %s", JSON.stringify(msg));
    });
}).catch(console.error);

/*
amqp.connect(url, function(err, conn) {
    if(conn){
        conn.createChannel(function(err, ch) {
            let msg = {
                    meta: {
                        timestamp: getTimestamp()
                    },
                    params: {
                        mapId: '5b96619b86f3cc8057216a03',
                        iAmId: '5b9fbde97f07953d41256b32',
                        roundId: 1
                    }
            };
            let bufferMsg = new Buffer(JSON.stringify(msg));
            ch.assertQueue(queue, {durable: false});
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(queue, bufferMsg);
            console.log(" [x] Sent %s", JSON.stringify(msg));
        });
    }
    if(err){
        console.error("Error while connecting to queue broker: ", err);
        
    }
});
*/