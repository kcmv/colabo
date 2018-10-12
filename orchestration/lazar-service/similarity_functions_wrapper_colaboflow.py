#!/usr/bin/env python

#python sv_client.py 5b96619b86f3cc8057216a03 5b97c7ab0393b8490bf5263c 0

from similarity_functions import *

print 'imported whole similarity_functions'

import json
import uuid

# ColaboFlowServiceWorker is a class that handles services (workers) and opens them to other
# colaboflow local or remote consumers
from colaboflow.services.ColaboFlowServiceWorker import ColaboFlowServiceWorker;

# function that is called when a consumer calls service (worker)
def callback(msg, action, params):
    response = "All is fine: " + str(uuid.uuid4());

    if(action == 'get_sims_for_user'):
        mapId = msg['params']['mapId']
        iAmId = msg['params']['iAmId']
        roundId = msg['params']['roundId']
        print("[colaboflow_service_demo:callback] Calling action '%r' with parameters(mapId:%r, iAmId:%r, roundId:%r)" % (action, mapId, iAmId, roundId))
        # response = ds(mapId, iAmId, roundId)
    if(action == 'get_sims'):
        mapId = msg['params']['mapId']
        print("[colaboflow_service_demo:callback] Calling action '%r' with parameters(mapId:%r)" % (action, mapId))
        # response = d(mapId)

    print("\t response: %r" % (response))
    print("\t")
    return response;

cfService = ColaboFlowServiceWorker();
cfService.connect();
cfService.listen(callback);
