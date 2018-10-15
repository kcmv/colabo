const MODULE_NAME:string = "@colabo-flow/b-services";

declare let require:any;
declare let Buffer:any;

let chalk = require('chalk');
// let amqp = require('amqplib/callback_api')
let amqp = require('amqplib');
const uuidv1 = require('uuid/v1');

import {GetPuzzle} from '@colabo-utils/i-config';

interface MessageContext {
	action: string;
	messageRequestId: number;
	correlationId: string;
	messageFingerprint: string;
	isRequestResultReady: boolean;
	isSeparateResponseQueue: boolean;
	resolve: (reason?: any) => void;
	reject: (reason?: any) => void;
}

export interface MessageContextHash {
	[correlationId: number]: MessageContext
}

export class ColaboFlowService{
	static messageRequestCounter:number = 0;
	protected debug:boolean;
	protected url:string;
	protected cancelCunsumerTags:boolean;
	protected requestQueue:string;
	protected shouldRequestResult:boolean;
	protected noAck:boolean;
	protected responseQueue:any;
	protected messageContexts: MessageContextHash = {};

	protected shouldListenOnSeparateResponseQueue:boolean;
	protected separateResponseQueue:string;
	protected consumerTagRequestResult:string;
	protected consumerTagSeparateRequestResult:string;

	protected conn:any;
	protected ch:any;

	constructor(){
		this.loadConfig();
	}

	loadConfig(){
		let puzzleConfig:any = GetPuzzle(MODULE_NAME);
		this.debug = puzzleConfig.debug;
		this.url = puzzleConfig.url;
		this.cancelCunsumerTags = puzzleConfig.cancelCunsumerTags;
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

				await this.listen();

				resolve("amqp client is connnected");
			}catch(err){
				reject("There was a problem connecting: " + err);
			}
		});
	}

	async listen(){
		if (this.shouldRequestResult) {
			let responseAssertionParams = { exclusive: true, durable: false };
			this.responseQueue = await this.ch.assertQueue('', responseAssertionParams);
			if (this.debug) console.log("responseQueue.queue: ", this.responseQueue.queue);

			this.consumerTagRequestResult = uuidv1() + "-request"; // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
			;
			let options = {
				noAck: this.noAck,
				consumerTag: this.consumerTagRequestResult
			};
			// wait for response
			this.ch.consume(this.responseQueue.queue, (responseMsg) => {
				if (this.debug) console.log("(responseQueue) responseMsg received: ", JSON.stringify(responseMsg));
				if (responseMsg !== null) {
					// console.log(responseMsg.content.toString());
					if (!this.noAck) this.ch.ack(responseMsg);

					// check if response is unprocessed one
					if (this.messageContexts.hasOwnProperty(responseMsg.properties.correlationId)) {
						let messageContext = this.messageContexts[responseMsg.properties.correlationId];
						console.log("(responseQueue) (%s) Got response, %s", messageContext.messageFingerprint, responseMsg.content);

						messageContext.isRequestResultReady = true;
						let result = JSON.parse(responseMsg.content);
						this.checkIsResponseFinished(messageContext, result);
					} else {
						console.warn("(responseQueue) correlationId Received message with not recognized correlationId:", responseMsg.properties.correlationId);
					}
				} else {
					throw new Error("(responseQueue) Empty message received");
				}
			}, options);
		}
		if (this.shouldListenOnSeparateResponseQueue) {
			let responseAssertionParams = { durable: false };
			await this.ch.assertQueue(this.separateResponseQueue, responseAssertionParams);
			if (this.debug) console.log("separateResponseQueue: ", this.separateResponseQueue);

			// wait for response
			// let responseMsg = await ch.consume(separateResponseQueue, {noAck: noAck});
			// if(debug) console.log("responseMsg received: ", JSON.stringify(responseMsg));

			this.consumerTagSeparateRequestResult = uuidv1() + "-separate";
			let options = {
				noAck: this.noAck,
				consumerTag: this.consumerTagSeparateRequestResult
			};
			this.ch.consume(this.separateResponseQueue, (separateResponseMsg) => {
				if (this.debug) console.log("(separateResponseQueue) separateResponseMsg received: ", JSON.stringify(separateResponseMsg));
				if (separateResponseMsg !== null) {
					// console.log(separateResponseMsg.content.toString());
					if (!this.noAck) this.ch.ack(separateResponseMsg);

					// check if response is unprocessed one
					if (this.messageContexts.hasOwnProperty(separateResponseMsg.properties.correlationId)) {
						let messageContext = this.messageContexts[separateResponseMsg.properties.correlationId];
						console.log("separateResponseQueue (%s) Got response, %s", messageContext.messageFingerprint, separateResponseMsg.content);
						messageContext.isSeparateResponseQueue = true;

						let result = JSON.parse(separateResponseMsg.content);
						this.checkIsResponseFinished(messageContext, result);
					} else {
						console.warn("(separateResponseQueue) correlationId Received message with not recognized correlationId:", separateResponseMsg.properties.correlationId);
					}
				} else {
					throw new Error("(separateResponseQueue) Empty message received");
				}
			}, options);
		}
	}

	/*
	WARNING: This method should be called only when all messages are delivered.
	Otherwise it will invalidate any unresolved operations.
	https://www.squaremobius.net/amqp.node/channel_api.html#model_close
	https://www.squaremobius.net/amqp.node/channel_api.html#channel_close
	https://www.squaremobius.net/amqp.node/channel_api.html#channel_cancel
	*/
	disconnect(){
		if(this.cancelCunsumerTags){
			if (this.consumerTagRequestResult) {
				console.log("Canceling consumerTagRequestResult: ", this.consumerTagRequestResult);
				this.ch.cancel(this.consumerTagRequestResult);
			}
			if (this.consumerTagSeparateRequestResult) {
				console.log("Canceling consumerTagSeparateRequestResult: ", this.consumerTagSeparateRequestResult);
				this.ch.cancel(this.consumerTagSeparateRequestResult);
			}
		}
		console.log("[ColaboFlowService:disconnect] closing channel");
		this.ch.close((err) => {
			console.error("[ColaboFlowService:disconnect] Error clossing channel: ", err);
		});
		this.ch.on('close', function(){
			console.log("[ColaboFlowService:disconnect] channel succesfully closed");
			console.log("[ColaboFlowService:disconnect] closing connection");
			this.conn.close((err) => {
				console.error("[ColaboFlowService:disconnect] Error clossing connection: ", err);
			});
		}.bind(this))
	}

	// used to synchronize internal async callbacks and reslove promise after all results are done
	checkIsResponseFinished(messageContext: MessageContext, result: any) {
		console.log("checkIsResponseFinished: (%s) isRequestResultReady: %s, isSeparateResponseQueue: %s", messageContext.messageFingerprint,
			messageContext.isRequestResultReady, messageContext.isSeparateResponseQueue);
		if (messageContext.isRequestResultReady && messageContext.isSeparateResponseQueue) {
			console.log("[ColaboFlowService:sendMessage] (%s) resolving action: %s", messageContext.messageFingerprint, messageContext.action);
			delete this.messageContexts[messageContext.correlationId];
			messageContext.resolve(result);
		}
	}

	async sendMessage(action, params){
		let messageRequestId: number = ColaboFlowService.messageRequestCounter++;
		let messageFingerprint = messageRequestId+":" + action;

		console.log("[ColaboFlowService:sendMessage] (%s) Sending message with action: '%s' and params: '%s'", messageFingerprint, action, params);

		return new Promise(async (resolve, reject) => {
			try{
				console.log("[sendMessage] (%s) starting ...", messageFingerprint);
				let correlationId: string;

				correlationId = uuidv1(); // ⇨ '45745c60-7b1a-11e8-9c9c-2d42b21b1a3e'
				if (this.debug) console.log("correlationId: ", correlationId);

				let _messageContext:MessageContext = {
					action: action,
					messageRequestId: messageRequestId,
					correlationId: correlationId,
					messageFingerprint: messageFingerprint,
					isRequestResultReady: !this.shouldRequestResult,
					isSeparateResponseQueue: !this.shouldListenOnSeparateResponseQueue,
					resolve: resolve,
					reject: reject
				};
				this.messageContexts[correlationId] = _messageContext;

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
					if(this.debug) console.log("responseQueue.queue: ", this.responseQueue.queue);
					sendingParams.correlationId = correlationId;
					sendingParams.replyTo = this.responseQueue.queue;
				}
				this.ch.sendToQueue(this.requestQueue, bufferMsg, sendingParams);
				console.log(" [x] Sent %s", JSON.stringify(msg));

				if(!this.shouldRequestResult && !this.shouldListenOnSeparateResponseQueue){
					this.checkIsResponseFinished(_messageContext, "no result requested");
				}
			}catch(err){
				reject("There was a problem sending the message: " + err);
			}
		});
	}
}