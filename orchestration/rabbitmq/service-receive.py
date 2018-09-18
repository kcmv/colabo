#!/usr/bin/env python
import pika

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
queue = config['queue_broker']['queue'];
print("Connecting to listen @ url %s on %s" % (url, queue))

# https://pika.readthedocs.io/en/stable/modules/parameters.html#pika.connection.URLParameters
# https://www.cloudamqp.com/blog/2015-05-21-part2-3-rabbitmq-for-beginners_example-and-sample-code-python.html
parameters = pika.connection.URLParameters(url)

connection = pika.BlockingConnection(parameters);
channel = connection.channel()
channel.queue_declare(queue=queue)

def callback(ch, method, properties, jsonMsg):
    # print(" ch = %r, method = %r, properties = %r" % (ch, method, properties))
    msg = json.loads(jsonMsg);
    print("Received msg: %r" % msg)
    print("\t mapId=%r" % (msg['mapId']))
    print("")

channel.basic_consume(callback, queue=queue, no_ack=True)

print('Waiting for messages. To exit press CTRL+C')
print("")

channel.start_consuming()
