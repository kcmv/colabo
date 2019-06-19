# __package__ = "use-cases"

from enum import Enum
import uuid
# from colabo.flow.go import ColaboFlowGoDemo, go_pb2
from colabo.flow.go import ColaboFlowGoActionHost
from colabo.flow.go import go_pb2
from colabo.flow.go import go_pb2_grpc

from random import randint
from time import sleep

# https://stackoverflow.com/questions/1977362/how-to-create-module-wide-variables-in-python
_ACTION_EXECUTION_ID = 0

# https://docs.python.org/3/library/enum.html
class SupportedActions(Enum):
    SearchSounds = 'search-sounds'

def searchSounds(actionExId, request, context):
    return go_pb2.ActionExecuteReply(id=actionExId, dataOut="Hello From ActionHost", params="All good!")

class ActionsHostServicerImplementation(go_pb2_grpc.ActionsHostServicer):

    def executeAction(self, request, context):
        global _ACTION_EXECUTION_ID
        actionExId = str(_ACTION_EXECUTION_ID)
        _ACTION_EXECUTION_ID = _ACTION_EXECUTION_ID+1
        print("request: %s" % (request))
        print("request.name: %s" % (request.name))
        print("SupportedActions.SearchSounds: %s" % (SupportedActions.SearchSounds.value))
        
        # https://docs.python.org/3/library/enum.html#iteration
        # https://stackoverflow.com/questions/44781681/how-to-compare-a-string-with-a-python-enum
        if(request.name == SupportedActions.SearchSounds.value):
            result = searchSounds(actionExId, request, context)
        else:
            print("ERROR: request.name '%s' is not supported" % (request.name))
            result = go_pb2.ActionExecuteReply(id=actionExId, dataOut="Error", params="", error=("ERROR: request.name '%s' is not supported" % (request.name)) )
        return result

colaboFlowGoActionHost = ColaboFlowGoActionHost(
    ActionsHostServicerImplementation)

print("colaboFlowGoActionHost = %s" % (colaboFlowGoActionHost))

colaboFlowGoActionHost.startService()
