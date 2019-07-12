# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random
import json

from datetime import datetime
# import dateutil.parser

class ParseFlowJSON():

    def __init__(self, flowName="basic-flow"):

        print("[ColaboFlowGoBasic] new flow created: %s" % (flowName))
        self.flow = []
        self.flowPointer = 0

    def loadFlow(self, flowFilename):
        print("flowFilename: %s" % (flowFilename))
        with open(flowFilename, 'r') as fn:
            tasksObj = json.load(fn)
            print("tasksObj: %s" % (tasksObj))
            for task in tasksObj["tasks"]:
                self.flow.append(task)
    
    def printFlow(self):
        print("flow: %s" % (self.flow))

    def getFlow(self):
        return self.flow
