# Install

```sh
# the latest
pip install colabo.flow.audit

# upgrade AFTER installing
pip install --upgrade colabo.flow.audit

# a speciffic one
pip install colabo.flow.audit==0.0.4
```

# Use

```py
# import
from colabo.flow.audit import audit_pb2
from colabo.flow.audit import ColaboFlowAudit

# create an ColaboFlowAudit object
colaboFlowAudit = ColaboFlowAudit()

# create an audit object
cfAuditRequest1 = audit_pb2.SubmitAuditRequest(
    bpmn_type='activity',
    bpmn_subtype='task',
    bpmn_subsubtype='sub-task',

    flowId='searchForSounds',
    # ...
)

# send the audit object to the audit service
result1 = colaboFlowAudit.audit_submit(cfAuditRequest1)

# print the respons from the audit service
print("result1 = %s" % (result1))
```

# More Details

+ [Github Colabo repository](https://github.com/Cha-OS/colabo)
+ [This package inside the Colabo repo](https://github.com/Cha-OS/colabo/tree/master/src/services/puzzles/flow/audit/python)
+ [DEVELOPMENT.md](https://github.com/Cha-OS/colabo/blob/master/src/services/puzzles/flow/audit/python/DEVELOPMENT.md)
+ Relevant Colabo Puzzles
    + [Python](https://github.com/Cha-OS/colabo/tree/master/src/services/puzzles/flow/audit/python)
    + [ColaboFlow Audit Services](https://github.com/Cha-OS/colabo/tree/master/src/services/puzzles/flow/audit)
    + [Backend](https://github.com/Cha-OS/colabo/tree/master/src/backend/dev_puzzles/flow/audit)
    + [Frontend](https://github.com/Cha-OS/colabo/tree/master/src/frontend/dev_puzzles/flow/audit)
    + [Isomorphic](https://github.com/Cha-OS/colabo/tree/master/src/isomorphic/dev_puzzles/flow/audit)