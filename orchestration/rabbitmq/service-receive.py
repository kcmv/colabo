#!/usr/bin/env python
import pika
import uuid

# Set the connection parameters to connect to rabbit-server 
# on port 5672, on the / virtual host 
# using the username "guest" and password "guest"
# https://pika.readthedocs.io/en/stable/modules/parameters.html

# credentials = pika.PlainCredentials('colabo', 'colabo_usr56')
# parameters = pika.ConnectionParameters('158.39.75.31',
#                                        5672,
#                                        '/',
#                                        credentials)

import json
with open('config-server.json', 'r') as f:
    config = json.load(f)

url = config['queue_broker']['url'];
requestQueue = config['queue_broker']['requestQueue'];
# RPC?
shouldRequestResult = config['queue_broker']['shouldRequestResult'];
noAck = config['queue_broker']['noAck'];
shouldListenOnSeparateResponseQueue = config['queue_broker']['shouldListenOnSeparateResponseQueue'];
separateResponseQueue = config['queue_broker']['separateResponseQueue'];
print("Connecting to listen @ url:%s on requestQueue: %s" % (url, requestQueue))

# https://pika.readthedocs.io/en/stable/modules/parameters.html#pika.connection.URLParameters
# https://www.cloudamqp.com/blog/2015-05-21-part2-3-rabbitmq-for-beginners_example-and-sample-code-python.html
parameters = pika.connection.URLParameters(url)

connection = pika.BlockingConnection(parameters);
channel = connection.channel()
channel.queue_declare(queue=requestQueue, durable=False)
if shouldListenOnSeparateResponseQueue:
    # channel.queue_declare(queue=separateResponseQueue, durable=False)
    channel.queue_declare(queue=separateResponseQueue)

def callback(ch, method, properties, jsonMsg):
    # print(" ch = %r, method = %r, properties = %r" % (ch, method, properties))
    msg = json.loads(jsonMsg);
    print("Received msg: %r" % msg)
    print("\t mapId=%r" % (msg['params']['mapId']))
    response = "All good: " + str(uuid.uuid4());
    print("")
    if shouldRequestResult:
        body = str(response)
        print("sending request result: %r" % body)
        ch.basic_publish(exchange='', routing_key=properties.reply_to, 
            properties=pika.BasicProperties(correlation_id = \
                properties.correlation_id),
            body=body) 
        if not noAck:
            print("sending request result ack: %r" % method.delivery_tag)
            ch.basic_ack(delivery_tag = method.delivery_tag)
        # ch.basic_ack(str(response))
    if shouldListenOnSeparateResponseQueue:
        body=str(response)
        print("sending separate response result: %r" % body)
        ch.basic_publish(exchange='', routing_key=separateResponseQueue,
            properties=pika.BasicProperties(correlation_id = \
                properties.correlation_id),
            body=body) 
        # channel.basic_publish(exchange='', routing_key='hello', body='Hello World!')
        # if not noAck:
        #     print("sending separate response ack: %r" % method.delivery_tag)
        #     ch.basic_ack(delivery_tag = method.delivery_tag)
        #     # ch.basic_ack(str(response))
    

channel.basic_qos(prefetch_count=1)
channel.basic_consume(callback, queue=requestQueue, no_ack=noAck)

print('Waiting for messages. To exit press CTRL+C')
print("")

channel.start_consuming()
