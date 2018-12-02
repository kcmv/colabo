import uuid
# from colabo.flow.audit import ColaboFlowAudit, audit_pb2
from colabo.flow.audit import audit_pb2
from colabo.flow.audit import ColaboFlowAudit

gRpcUrl = "localhost:50505"
colaboFlowAudit = ColaboFlowAudit(gRpcUrl)

cfAuditRequest1 = audit_pb2.SubmitAuditRequest(
    # id='d123',
    # time='8e23',
    bpmn_type='activity',
    bpmn_subtype='task',
    bpmn_subsubtype='sub-task',

    flowId='searchForSounds',
    name='searchUser',

    userId='a123',
    sessionId='e123',
    flowInstanceId='f123',

    implementationId='mediator',
    implementerId='colabo.service'
)

result1 = colaboFlowAudit.audit_submit(cfAuditRequest1)

cfAuditRequest2 = audit_pb2.SubmitAuditRequest(
    # id='d124',
    # time='8e24',
    bpmn_type='activity',
    bpmn_subtype='task',
    bpmn_subsubtype='sub-task',

    flowId='searchForSounds',
    name='checkCache',

    userId='a123',
    sessionId='e123',
    flowInstanceId='f123',

    implementationId='mediator',
    implementerId='colabo.service'
)

result2 = colaboFlowAudit.audit_submit(cfAuditRequest2)

print("result1 = %s" % (result1))
print("result2 = %s" % (result2))
