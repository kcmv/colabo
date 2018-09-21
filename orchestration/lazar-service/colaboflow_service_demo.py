#!/usr/bin/python

import json
import uuid

# ColaboFlowServiceWorker is a class that handles services (workers) and opens them to other
# colaboflow local or remote consumers
from colaboflow.services.ColaboFlowServiceWorker import ColaboFlowServiceWorker;

def callback(msg, action, params):
    response = {
        'msg': "All is fine!",
        'uuid': str(uuid.uuid4())
    };

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