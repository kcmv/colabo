#!/usr/bin/python

import json
import uuid

# ColaboFlowServiceWorker is a class that handles services (workers) and opens them to other
# colaboflow local or remote consumers
from colaboflow.services.ColaboFlowServiceWorker import ColaboFlowServiceWorker;

def callback(msg, action, params):
    if(action == 'get_sims_for_user'):
        mapId = msg['params']['mapId']
        iAmId = msg['params']['iAmId']
        roundId = msg['params']['roundId']
        print("[colaboflow_service_demo:callback] Calling action '%r' with parameters(mapId:%r, iAmId:%r, roundId:%r)" % (action, mapId, iAmId, roundId))
        # result = ds(mapId, iAmId, roundId)
        result = 'get_sims_for_user:'+str(params)
    if(action == 'get_sims'):
        mapId = msg['params']['mapId']
        print("[colaboflow_service_demo:callback] Calling action '%r' with parameters(mapId:%r)" % (action, mapId))
        # result = d(mapId)
        result = 'get_sims:'+str(params)

    print("\t result: %r" % (result))
    print("\t")
    return result;

cfService = ColaboFlowServiceWorker();
cfService.connect();

cfService.listen(callback);