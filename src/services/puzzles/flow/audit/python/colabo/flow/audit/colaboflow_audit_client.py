# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random

import grpc

from .colaboflow import audit_pb2
from .colaboflow import audit_pb2_grpc

class ColaboFlowAudit():

    def __init__(self):
        # NOTE(gRPC Python Team): .close() is possible on a channel and should be
        # used in circumstances in which the with statement does not fit the needs
        # of the code.
        socketUrl = 'localhost:50505'
        print("Initializing gRPC at: %s" % (socketUrl))
        self.channel = grpc.insecure_channel(socketUrl)
        # to call service methods, we first need to create a stub.
        self.stub = audit_pb2_grpc.AuditStub(self.channel)

    def audit_submit(self, auditRequest):
        auditReply = self.stub.submit(auditRequest)
        if not auditReply.n1:
            print("Server returned incomplete auditReply")
        else:
            print("Audit result is %s" % (auditReply.n1))
        return auditReply
