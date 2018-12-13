# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random

from datetime import datetime
# import dateutil.parser

class ColaboFlowGo():
    auditRequestDefault = None
    stubDefault = None

    def __init__(self, socketUrl=None, defaultAuditRequest = None, reuseClient = True):
        # NOTE(gRPC Python Team): .close() is possible on a channel and should be
        # used in circumstances in which the with statement does not fit the needs
        # of the code.
        
        print("ColaboFlowGo::__init__");
