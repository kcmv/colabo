#!/usr/bin/env python

#python sv_client.py 5b96619b86f3cc8057216a03 5b97c7ab0393b8490bf5263c 0

from similarity_functions import *

print 'imported whole similarity_functions'
hostname = 'localhost'
port = 12345

print ("starting rpyc service at hostname:'%r' and port: %r" % (hostname, port));

# rpyc service definition
sys.path.append('/var/colabo/colabo-env/lib/python2.7/site-packages/rpyc-3.3.0')

import rpyc

class MyService(rpyc.Service):
    def exposed_get_sims(self, mid):
        return d(mid)
    def exposed_get_sims_for_user(self, mid, uid, rid):
        return ds(mid, uid, rid)

# start the rpyc server
# https://rpyc.readthedocs.io/en/latest/tutorial/tut3.html
from rpyc.utils.server import ThreadedServer
from threading import Thread
server = ThreadedServer(MyService, hostname=hostname, port = port, auto_register=None)
t = Thread(target = server.start)
t.daemon = True
t.start()

print ("rpyc service started and listening");

from time import time, sleep

# the main logic
#main = normAPI()
work = True
begin=time()
while work:
    sleep(1/10.)
    #if false and(time()-begin)>60*59*1:
        #crontab -e :
        #na svakih 5 sati /opt/python2.7/bin/python2.7 /var/www/livelytour/normalize-me.py
    #    work = False

t.close()