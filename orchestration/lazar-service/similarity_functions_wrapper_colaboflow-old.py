#!/usr/bin/env python

#python sv_client.py 5b96619b86f3cc8057216a03 5b97c7ab0393b8490bf5263c 0

from similarity_functions import *

print 'imported whole similarity_functions'

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
# The DEFAULT_SOCKET_TIMEOUT is set to 0.25s
parameters.socket_timeout = 5

connection = pika.BlockingConnection(parameters);
channel = connection.channel()
channel.queue_declare(queue=queue)

def callback(ch, method, properties, jsonMsg):
    # print(" ch = %r, method = %r, properties = %r" % (ch, method, properties))
    msg = json.loads(jsonMsg);
    print("Received msg: %r" % msg)
    print("")
    action = msg['action']['name'];
    if(action == 'get_sims_for_user'):
        mapId = msg['params']['mapId']
        iAmId = msg['params']['iAmId']
        roundId = msg['params']['roundId']
        print("\t Calling action '%r' with parameters(mapId:%r, iAmId:%r, roundId:%r)" % (action, mapId, iAmId, roundId))
        result = ds(mapId, iAmId, roundId)
        print("\t result: %r", result)
        print("\t")
        return result
    if(action == 'get_sims'):
        mapId = msg['params']['mapId']
        print("Calling action '%r' with parameters(mapId:%r)" % (action, mapId))
        result = d(mapId)
        print("\t result: %r", result)
        print("\t")
        return result

channel.basic_consume(callback, queue=queue, no_ack=True)

print('Waiting for messages. To exit press CTRL+C')
print("")

channel.start_consuming()
