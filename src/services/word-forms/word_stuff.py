#!/usr/bin/python
# -*- coding: utf-8 -*-

import os, sys, json
import time
from time import sleep
import datetime
dt = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
from nltk.corpus import wordnet as wn
from word_forms.word_forms import get_word_forms

pths = sys.path

logfile = '/var/colabo/log_words.txt'
with open(logfile, 'a') as out:
    out.write(dt + ' main.py started \n')
    for pth in pths:
        out.write(pth + ' \n')

sleep(60)

dt = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')

with open(logfile, 'a') as out:
    out.write(dt + 'main.py awake \n')

with open(logfile, 'a') as out:
    out.write(dt + ' done with imports \n')
    
def wordsforms(word):
    res = get_word_forms(word)#{, get_word_forms('un'+word), get_word_forms('in'+word)}
    #res = json.dumps(res)#.encode('ascii','ignore').str.decode('utf-8')#.decode('unicode-escape').encode('utf8')
    return res

def synonyms(word):
    res = []
    synsets = wn.synsets(word)
    for synset in synsets:
        res.extend(synset.lemma_names())
    return list(set(res))

def hypernyms(word):
    res = []
    synsets = wn.synsets(word)
    for synset in synsets:
        for hypernym in synset.hypernyms():
            res.extend(hypernym.lemma_names())
    return list(set(res))


print ('loading remote service provider')

##############################
# END OF THE BUSINESS LOGIC  #
##############################

with open('./config-server.json', 'r') as f:
    config = json.load(f)

if config['wrapper'] == 'colaboflow':
    print ("WRAPPER: Starting 'colaboflow' service wrapper")

    import uuid

    # ColaboFlowServiceWorker is a class that handles services (workers) and opens them to other
    # colaboflow local or remote consumers
    from colaboflow.services.ColaboFlowServiceWorker import ColaboFlowServiceWorker;

    # function that is called when a consumer calls service (worker)
    def callback(msg, action, params):
        response = "All is fine: " + str(uuid.uuid4());
        word = msg['word']

        if(action == 'get_word_forms'):
            print("[colaboflow_service_demo:callback] Calling action '%r' with parameters(word:%r)" % (action, word))
            response = wordsforms(word)
        if(action == 'get_synonyms'):
            print("[colaboflow_service_demo:callback] Calling action '%r' with parameters(word:%r)" % (action, word))
            response = synonyms(word)
        if(action == 'get_hypernyms'):
            print("[colaboflow_service_demo:callback] Calling action '%r' with parameters(word:%r)" % (action, word))
            response = hypernyms(word)

        print("\t response: %r" % (response))
        print("\t")
        return response;

    cfService = ColaboFlowServiceWorker();
    cfService.connect();
    cfService.listen(callback);

if config['wrapper'] == 'rpyc':
    print ("WRAPPER: Starting 'rpyc' service wrapper")

    #python sv_client.py 5b96619b86f3cc8057216a03 5b97c7ab0393b8490bf5263c 0

    hostname = 'localhost'
    port = 12374

    print ("starting rpyc service at hostname:'%r' and port: %r" % (hostname, port));

    # rpyc service definition
    sys.path.append('/var/colabo/colabo-env/lib/python2.7/site-packages/rpyc-3.3.0')

    import rpyc

    class MyService(rpyc.Service):
        def exposed_get_word_forms(self, word):
            return wordsforms(word)
        def exposed_get_synonyms(self, word):
            return synonyms(word)
        def exposed_get_hypernyms(self, word):
            return hypernyms(word)


    with open(logfile, 'a') as out:
        out.write(dt + ' done with defs \n')
        
    # start the rpyc server
    from rpyc.utils.server import ThreadedServer
    from threading import Thread
    server = ThreadedServer(MyService, hostname=hostname, port = port, auto_register=None)
    t = Thread(target = server.start)
    t.daemon = True
    t.start()

    print ("rpyc service started and listening");

    with open(logfile, 'a') as out:
        out.write(dt + ' done t.start \n')

    from time import time, sleep

    # the main logic
    work = True
    begin=time()
    while work:
        sleep(0.1)
        #if false and(time()-begin)>60*59*1:
            #crontab -e :
            #na svakih 5 sati /opt/python2.7/bin/python2.7 /var/www/main.py
        #    work = False

    t.close()
