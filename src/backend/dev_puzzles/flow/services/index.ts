const MODULE_NAME:string = "@colabo-flow/b-services";

declare let require:any;
declare let Buffer:any;

let chalk = require('chalk');
// let amqp = require('amqplib/callback_api')
let amqp = require('amqplib');

import {GetPuzzle} from '@colabo-utils/config';

export class ColaboFlowService{
	protected debug:boolean;
	protected url:string;
	protected requestQueue:string;
	protected shouldRequestResult:boolean;
	protected noAck:boolean;
	protected responseQueue:any;

	protected shouldListenOnSeparateResponseQueue:boolean;
	protected separateResponseQueue:string;

	protected conn:any;
	protected ch:any;

	constructor(){
		this.loadConfig();
	}

	loadConfig(){
		let puzzleConfig:any = GetPuzzle(MODULE_NAME);
		this.debug = puzzleConfig.debug;
		this.url = puzzleConfig.url;
		this.requestQueue = puzzleConfig.queue;
		// RPC?
		this.shouldRequestResult = puzzleConfig.shouldRequestResult;
		this.noAck = puzzleConfig.noAck;

		this.shouldListenOnSeparateResponseQueue = puzzleConfig.shouldListenOnSeparateResponseQueue;
		this.separateResponseQueue = puzzleConfig.separateResponseQueue;
	}

	getTimestamp() {
		return Math.floor(new Date().getTime()/1000);
	}

	async connect(){
		console.log("Accessing queue_broker at: '%s' on requestQueue: '%s'", this.url, this.requestQueue);

		return new Promise(async (resolve, reject) => {
			try{
				this.conn = await amqp.connect(this.url);

				this.conn.on("error", function(err) {
					if (err.message !== "Connection closing") {
						console.error("[AMQP] conn error", err.message);
					}
				});
				this.conn.on("close", function() {
					console.error("[AMQP] Connection closed");
					// i guess to restart
					// console.error("[AMQP] reconnecting");
					// return setTimeout(start, 1000);
				});

				// if(debug) console.log("Conn: ", conn);
				this.ch = await this.conn.createChannel();
				// if(debug) console.log("ch: ", ch);

				this.ch.on("error", function(err) {
					console.error("[AMQP] channel error", err.message);
				});
				this.ch.on("close", function() {
					console.log("[AMQP] channel closed");
				});

				// create the requestQueue
				let requestAssertionParams = {durable: false};
				await this.ch.assertQueue(this.requestQueue, requestAssertionParams);
				if(this.debug) console.log("requestQueue asserted");

				if(this.shouldRequestResult){
					let responseAssertionParams = {exclusive: true, durable: false};
					this.responseQueue = await this.ch.assertQueue('', responseAssertionParams);
					if(this.debug) console.log("responseQueue.queue: ", this.responseQueue.queue);
				}
				if(this.shouldListenOnSeparateResponseQueue){
					let responseAssertionParams = {durable: false};
					await this.ch.assertQueue(this.separateResponseQueue, responseAssertionParams);
					if(this.debug) console.log("separateResponseQueue: ", this.separateResponseQueue);
				}
				resolve("amqp client is connnected");
			}catch(err){
				reject("There was a problem connecting: " + err);
			}
		});
	}

	/*
	WARNING: This method should be called only when all messages are delivered.
	Otherwise it will invalidate any unresolved operations.
	https://www.squaremobius.net/amqp.node/channel_api.html#model_close
	https://www.squaremobius.net/amqp.node/channel_api.html#channel_close
	*/
	disconnect(){
		this.ch.close();
		this.conn.close();
	}

	async sendMessage(action, params){
		console.log("[ColaboFlowService:sendMessage] Sending message with action: '%s' and params: '%s'", action, params);

		return new Promise(async (resolve, reject) => {
			try{
				let correlationId:string;
				let result:any = "Initial resul";

				// used to synchronize internal async callbacks and reslove promise after all results are done
				let isRequestResultReady:boolean = !this.shouldRequestResult;
				let isSeparateResponseQueue:boolean = !this.shouldListenOnSeparateResponseQueue;
				function processFinish(){
					console.log("processFinish: isRequestResultReady: %s, isSeparateResponseQueue: %s",
						isRequestResultReady, isSeparateResponseQueue);
					if(isRequestResultReady && isSeparateResponseQueue){
						console.log("[ColaboFlowService:sendMessage] resolving")
						resolve(result);
					}
				}

				// prepare message
				let msg = {
					meta: {
						timestamp: this.getTimestamp()
					},
					action: {
						'name': action
					},
					params: params
				};

				// Note: on Node 6 Buffer.from(msg) should be used
				let bufferMsg = new Buffer(JSON.stringify(msg));

				// send message
				let sendingParams:any = {};
				if(this.shouldRequestResult){
					const uuidv1 = require('uuid/v1');
					correlationId = uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
					if(this.debug) console.log("correlationId: ", correlationId);
					if(this.debug) console.log("responseQueue.queue: ", this.responseQueue.queue);
					sendingParams.correlationId = correlationId;
					sendingParams.replyTo = this.responseQueue.queue;
				}
				this.ch.sendToQueue(this.requestQueue, bufferMsg, sendingParams);
				console.log(" [x] Sent %s", JSON.stringify(msg));

				if(this.shouldRequestResult){
					// wait for response
					this.ch.consume(this.responseQueue.queue, (responseMsg) => {
						if(this.debug) console.log("responseMsg received: ", JSON.stringify(responseMsg));
						if (responseMsg !== null) {
							// console.log(responseMsg.content.toString());
							if(!this.noAck) this.ch.ack(responseMsg);
							
							// check if response is correct one
							if (responseMsg.properties.correlationId == correlationId) {
								// console.log(' [.] Got response, %s', msg.content.toString());
								// console.log(' [.] Got response, %s', JSON.stringify(responseMsg.content));
								console.log(' [.] Got response, %s', responseMsg.content);
								// setTimeout(function() { conn.close(); process.exit(0) }, 500);
							}
						}
						isRequestResultReady = true;
						result = JSON.parse(responseMsg.content);
						processFinish();
					}, {noAck: this.noAck});
				}
				if(this.shouldListenOnSeparateResponseQueue){
					// wait for response
					// let responseMsg = await ch.consume(separateResponseQueue, {noAck: noAck});
					// if(debug) console.log("responseMsg received: ", JSON.stringify(responseMsg));

					this.ch.consume(this.separateResponseQueue, (separateResponseMsg) => {
						if(this.debug) console.log("separateResponseMsg received: ", JSON.stringify(separateResponseMsg));
						if (separateResponseMsg !== null) {
							// console.log(separateResponseMsg.content.toString());
							if(!this.noAck) this.ch.ack(separateResponseMsg);
							
							// check if response is correct one
							if (separateResponseMsg.properties.correlationId == correlationId) {
								// console.log(' [.] Got response, %s', JSON.stringify(separateResponseMsg.content));
								console.log(' [.] Got response, %s', separateResponseMsg.content);
								// console.log(' [.] Got response, %s', msg.content.toString());
								// setTimeout(function() { conn.close(); process.exit(0) }, 500); 
							}
						}
						isSeparateResponseQueue = true;
						result = JSON.parse(separateResponseMsg.content);
						processFinish();
					}, {noAck: this.noAck});
				}
				// if(!this.shouldRequestResult && this.shouldListenOnSeparateResponseQueue)
				processFinish();
			}catch(err){
				reject("There was a problem sending the message: " + err);
			}
		});
	}
}