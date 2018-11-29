# import `ColaboKnalledgeMongo` class from the local (notice: `.`) file `knalledge_mongo`
from .colaboflow_audit_client import ColaboFlowAudit
from .colaboflow import audit_pb2

# provide the `ColaboFlowAudit` class directly importable from the `audit` namespace
__all__ = ['ColaboFlowAudit', audit_pb2, 'audit_pb2_grpc.py']
