#!/usr/bin/python

# Usage
# from colaboflow.services.ColaboFlowServiceWorker import ColaboFlowServiceWorker;
# cfService = ColaboFlowServiceWorker();
# dataRaw = cfService.loadFile(fileInName, encoding);


import os
import sys
import json
import pika
import uuid

# JSON usage
# json.dump(obj, f);
# indent=0 inserts only new lines
# indent=None makes the most compact encoding
# json.dump(obj, f, skipkeys=False, ensure_ascii=False, check_circular=True, allow_nan=True, indent=4, separators=(',', ':'), encoding='utf-8', sort_keys=False);

# fileOut = Bukvik.TRANSFORM_TO_ABSOLUTE_PATH(fileOut);
# with open(fileOut, 'w') as outfile:
# 	json.dump(dataOut, outfile);

class ColaboFlowServiceWorker():
	# http://docs.python.org/library/functions.html#staticmethod
	# http://docs.python.org/library/functions.html#classmethod
	# @staticmethod
	# def SET_ABSOLUTE_PATH(absolutePath):
	# 	ColaboFlowServiceWorker.ABSOLUTE_PATH = absolutePath

	def __init__(self, absolutePath=None):
		# self.absolutePath = None
		# self.absolutePath = ColaboFlowServiceWorker.ABSOLUTE_PATH
		self.url = None
		self.requestQueue = None
		self.shouldRequestResult = None
		self.noAck = None
		self.shouldListenOnSeparateResponseQueue = None
		self.separateResponseQueue = None

		self.connection = None
		self.channel = None
		self.workerCallback = None

		self.loadConfig();

	def loadConfig(self):
		with open('./config-server.json', 'r') as f:
			config = json.load(f)

		print("[ColaboFlowServiceWorker:loadConfig] Loaded: %s" % (config['name']))
		# print("[ColaboFlowServiceWorker:loadConfig] Loaded: %s" % (config['queue_broker']))

		self.url = config['queue_broker']['url'];
		self.requestQueue = config['queue_broker']['requestQueue'];
		# RPC?
		self.shouldRequestResult = config['queue_broker']['shouldRequestResult'];
		self.noAck = config['queue_broker']['noAck'];
		self.shouldListenOnSeparateResponseQueue = config['queue_broker']['shouldListenOnSeparateResponseQueue'];
		self.separateResponseQueue = config['queue_broker']['separateResponseQueue'];

	def connect(self):
		print("[ColaboFlowServiceWorker:connect] Connecting to listen @ url %s on queue: %s" % (self.url, self.requestQueue))
		# https://pika.readthedocs.io/en/stable/modules/parameters.html#pika.connection.URLParameters
		# https://www.cloudamqp.com/blog/2015-05-21-part2-3-rabbitmq-for-beginners_example-and-sample-code-python.html
		parameters = pika.connection.URLParameters(self.url)
		parameters.socket_timeout = 5

		self.connection = pika.BlockingConnection(parameters);
		self.channel = self.connection.channel()
		self.channel.queue_declare(queue=self.requestQueue, durable=False)
		if self.shouldListenOnSeparateResponseQueue:
			# channel.queue_declare(queue=separateResponseQueue, durable=False)
			self.channel.queue_declare(queue=self.separateResponseQueue)
		self.channel.basic_qos(prefetch_count=1)
	
	def listen(self, workerCallback):
		self.workerCallback = workerCallback
		self.channel.basic_consume(self.callback, queue=self.requestQueue, no_ack=self.noAck)

		print("[ColaboFlowServiceWorker:listen] Waiting for messages. To exit press CTRL+C")

		self.channel.start_consuming()

	def callback(self, ch, method, properties, jsonMsg):
		# print(" ch = %r, method = %r, properties = %r" % (ch, method, properties))
		msg = json.loads(jsonMsg);
		print("[ColaboFlowServiceWorker:callback] Received msg: %r" % msg)

		action = msg['action']['name'];
		params = msg['params'];
		response = self.workerCallback(msg, action, params);
		responseSerialized = json.dumps(response);

		print("")

		if self.shouldRequestResult:
			print("\t sending request result: %r" % responseSerialized)
			ch.basic_publish(exchange='', routing_key=properties.reply_to, 
				properties=pika.BasicProperties(correlation_id = \
					properties.correlation_id),
				body=responseSerialized) 
			if not self.noAck:
				print("\t sending request result ack: %r" % method.delivery_tag)
				ch.basic_ack(delivery_tag = method.delivery_tag)
			# ch.basic_ack(responseSerialized)
		if self.shouldListenOnSeparateResponseQueue:
			print("\t sending separatce response result: %r" % responseSerialized)
			ch.basic_publish(exchange='', routing_key=self.separateResponseQueue,
				properties=pika.BasicProperties(correlation_id = \
					properties.correlation_id),
				body=responseSerialized) 
		