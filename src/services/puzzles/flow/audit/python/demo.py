import uuid
# from colabo.flow.audit import ColaboFlowAudit, audit_pb2
from colabo.flow.audit import audit_pb2
from colabo.flow.audit import ColaboFlowAudit

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

result1 = colaboFlowAudit.audit_submit(cfAuditRequest1)

cfAuditRequest2 = audit_pb2.SubmitAuditRequest(
    flowId='searchForSounds-2',
    name='parseResponse',
    userId='user-2'
)

result2 = colaboFlowAudit.audit_submit(cfAuditRequest2)

print("result1 = %s" % (result1))
print("result2 = %s" % (result2))

# creating additional ColaboFlowAudit instance to check class static nature 
# of the default defaultAuditRequest
colaboFlowAudit2 = ColaboFlowAudit()
cfAuditRequest3 = audit_pb2.SubmitAuditRequest(name='end')
result3 = colaboFlowAudit.audit_submit(cfAuditRequest3)
print("result3 = %s" % (result3))
