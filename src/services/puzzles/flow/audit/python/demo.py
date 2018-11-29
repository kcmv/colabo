import uuid
from colabo.flow.audit import ColaboFlowAudit, audit_pb2

colaboFlowAudit = ColaboFlowAudit()

result1 = colaboFlowAudit.audit_submit(
    audit_pb2.SubmitAuditRequest(n1=2, n2=-3));
result2 = colaboFlowAudit.audit_submit(
    audit_pb2.SubmitAuditRequest(n1=4, n2=5))

print("result1 = %s" % (result1))
print("result2 = %s" % (result2))
