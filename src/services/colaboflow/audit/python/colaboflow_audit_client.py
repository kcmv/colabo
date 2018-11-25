# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random

import grpc

import colaboflow.audit_pb2 as audit_pb2
import colaboflow.audit_pb2_grpc as audit_pb2_grpc


def audit_submit(stub, auditRequest):
    auditReply = stub.submit(auditRequest)
    if not auditReply.n1:
        print("Server returned incomplete auditReply")
        return

    print("Audit result is %s" % (auditReply.n1))


def audit_submit_wrapper(stub):
    audit_submit(stub,
        audit_pb2.SubmitAuditRequest(n1=2, n2=-3))
    audit_submit(stub, 
        audit_pb2.SubmitAuditRequest(n1=4, n2=5))

def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with grpc.insecure_channel('localhost:50505') as channel:
        # to call service methods, we first need to create a stub.
        stub=audit_pb2_grpc.AuditStub(channel)
        print("-------------- submit --------------")
        audit_submit_wrapper(stub)


if __name__ == '__main__':
    run()
