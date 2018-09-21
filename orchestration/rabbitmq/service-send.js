#!/usr/bin/env node

let config = require('./config');
let chalk = require('chalk');

// let amqp = require('amqplib/callback_api')
let amqp = require('amqplib');

let debug = config.global.queue_broker.debug;
let url = config.global.queue_broker.url;
let requestQueue = config.global.queue_broker.queue;
// RPC?
let shouldRequestResult = config.global.queue_broker.shouldRequestResult;
let noAck = config.global.queue_broker.noAck;

let shouldListenOnSeparateResponseQueue = config.global.queue_broker.shouldListenOnSeparateResponseQueue;
let separateResponseQueue = config.global.queue_broker.separateResponseQueue;

console.log("Accessing queue_broker at: '%s' on requestQueue: '%s'", url, requestQueue);

function getTimestamp() {
    return Math.floor(new Date().getTime()/1000);
}

async function sendMsg(action, params){
    return new Promise(async (resolve, reject) => {
        try{
            let conn = await amqp.connect(url);
            // if(debug) console.log("Conn: ", conn);
            let ch = await conn.createChannel();
            // if(debug) console.log("ch: ", ch);
            let responseQueue;
            let correlationId;

            if(shouldRequestResult){
                let responseAssertionParams = {exclusive: true, durable: false};
                responseQueue = await ch.assertQueue('', responseAssertionParams);
                if(debug) console.log("responseQueue.queue: ", responseQueue.queue);
            }
            if(shouldListenOnSeparateResponseQueue){
                let responseAssertionParams = {durable: false};
                await ch.assertQueue(separateResponseQueue, responseAssertionParams);
                if(debug) console.log("separateResponseQueue: ", separateResponseQueue);
            }

            // prepare message
            let msg = {
                meta: {
                    timestamp: getTimestamp()
                },
                action: {
                    'name': action
                },
                params: params
            };

            let bufferMsg = new Buffer(JSON.stringify(msg));
            // Note: on Node 6 Buffer.from(msg) should be used

            // create the requestQueue
            let requestAssertionParams = {durable: false};
            await ch.assertQueue(requestQueue, requestAssertionParams);
            if(debug) console.log("requestQueue asserted");

            // send message
            let sendingParams = {};
            if(shouldRequestResult){
                const uuidv1 = require('uuid/v1');
                correlationId = uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
                if(debug) console.log("correlationId: ", correlationId);
                if(debug) console.log("responseQueue.queue: ", responseQueue.queue);
                sendingParams.correlationId = correlationId;
                sendingParams.replyTo = responseQueue.queue;
            }
            ch.sendToQueue(requestQueue, bufferMsg, sendingParams);
            console.log(" [x] Sent %s", JSON.stringify(msg));
            resolve("Message is sent");

            if(shouldRequestResult){
                // wait for response
                ch.consume(responseQueue.queue, function(responseMsg) {
                    if(debug) console.log("responseMsg received: ", JSON.stringify(responseMsg));
                    if (responseMsg !== null) {
                        // console.log(responseMsg.content.toString());
                        if(!noAck) ch.ack(responseMsg);
                        
                        // check if response is correct one
                        if (responseMsg.properties.correlationId == correlationId) {
                            // console.log(' [.] Got response, %s', msg.content.toString());
                            // console.log(' [.] Got response, %s', JSON.stringify(responseMsg.content));
                            console.log(' [.] Got response, %s', responseMsg.content);
                            // setTimeout(function() { conn.close(); process.exit(0) }, 500); 
                        }
                    }
                }, {noAck: noAck});                
            }
            if(shouldListenOnSeparateResponseQueue){
                // wait for response
                // let responseMsg = await ch.consume(separateResponseQueue, {noAck: noAck});
                // if(debug) console.log("responseMsg received: ", JSON.stringify(responseMsg));

                ch.consume(separateResponseQueue, function(separateResponseMsg) {
                    if(debug) console.log("separateResponseMsg received: ", JSON.stringify(separateResponseMsg));
                    if (separateResponseMsg !== null) {
                        // console.log(separateResponseMsg.content.toString());
                        if(!noAck) ch.ack(separateResponseMsg);
                        
                        // check if response is correct one
                        if (separateResponseMsg.properties.correlationId == correlationId) {
                            // console.log(' [.] Got response, %s', JSON.stringify(separateResponseMsg.content));
                            console.log(' [.] Got response, %s', separateResponseMsg.content);
                            // console.log(' [.] Got response, %s', msg.content.toString());
                            // setTimeout(function() { conn.close(); process.exit(0) }, 500); 
                        }
                    }
                }, {noAck: noAck});
            }

        }catch(err){
            reject("There was a problem sending the message: " + err);
        }
    });
}

let action = 'get_sims_for_user';
let params = {
    mapId: '5b96619b86f3cc8057216a03',
    iAmId: '5b9fbde97f07953d41256b32',
    roundId: 1
};

sendMsg(action, params)
    .then(result => console.log(chalk.blue.bold("ColaboFlow action (%s) finished with result: "), 'action', result))
    .catch(error => console.log(chalk.red.bold("ColaboFlow action (%s) finished with error: "), 'action', error));


/*

// let open = amqp.connect(url);

async function sendMsg(action, params){
    return new Promise(async (resolve, reject) => {
        try{
            let conn = await amqp.connect(url);
            // console.log("Conn: ", conn);
            let ch = await conn.createChannel();
            // console.log("ch: ", ch);
            await ch.assertQueue(requestQueue, {durable: false});

            let msg = {
                meta: {
                    timestamp: getTimestamp()
                },
                action: {
                    'name': action
                },
                params: params
            };

            let bufferMsg = new Buffer(JSON.stringify(msg));
            // Note: on Node 6 Buffer.from(msg) should be used
            ch.sendToQueue(requestQueue, bufferMsg);

            console.log(" [x] Sent %s", JSON.stringify(msg));
            resolve("Message is sent");
        }catch(err){
            reject("There was a problem sending the message: " + err);
        }
    });
}

let action = 'get_sims_for_user';
let params = {
    mapId: '5b96619b86f3cc8057216a03',
    iAmId: '5b9fbde97f07953d41256b32',
    roundId: 1
};

sendMsg(action, params)
    .then(result => console.log(chalk.blue.bold("Colabo action (%s) finished with result: "), 'action', result))
    .catch(error => console.log(chalk.red.bold("Colabo action (%s) finished with error: "), 'action', error));
*/

/*
// PROMISSES

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
*/

/*
// CALLBACKS

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