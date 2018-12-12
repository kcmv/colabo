import uuid
# from colabo.flow.audit import ColaboFlowAudit, audit_pb2
from colabo.flow.audit import audit_pb2
from colabo.flow.audit import ColaboFlowAudit

from random import randint
from time import sleep

cfAuditRequestDefualt = audit_pb2.SubmitAuditRequest(
    bpmn_type='activity',
    bpmn_subtype='task',
    bpmn_subsubtype='sub-task',

    flowId='searchForSounds',

    userId='a124',
    sessionId='e124',
    flowInstanceId='f123',

    implementationId='mediator',
    implementerId='ACE'
)

gRpcUrl = "localhost:50505"
colaboFlowAudit = ColaboFlowAudit(socketUrl=gRpcUrl, defaultAuditRequest=cfAuditRequestDefualt)

cfAuditRequest1 = audit_pb2.SubmitAuditRequest(
    name='start'
)
result1 = colaboFlowAudit.audit_create(cfAuditRequest1)
sleep(randint(1,3))
result1 = colaboFlowAudit.audit_finish(cfAuditRequest1)

cfAuditRequest2 = audit_pb2.SubmitAuditRequest(
    flowId='searchForSounds-2',
    name='parseResponse',
    userId='user-2'
)
result2 = colaboFlowAudit.audit_create(cfAuditRequest2)
sleep(randint(1, 2))
result2 = colaboFlowAudit.audit_finish(cfAuditRequest2)

print("result1 = %s" % (result1))
print("result2 = %s" % (result2))

# creating additional ColaboFlowAudit instance to check class static nature 
# of the default defaultAuditRequest
colaboFlowAudit2 = ColaboFlowAudit()
cfAuditRequest3 = audit_pb2.SubmitAuditRequest(name='end')
result3 = colaboFlowAudit2.audit_create_and_finish(cfAuditRequest3)
print("result3 = %s" % (result3))
