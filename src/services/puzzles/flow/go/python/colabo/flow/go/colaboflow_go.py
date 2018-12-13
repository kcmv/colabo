# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random

from datetime import datetime
# import dateutil.parser

class ColaboFlowGo():
    auditRequestDefault = None
    stubDefault = None

    def __init__(self, flowName="basic-flow"):
        
        print("[ColaboFlowGo] new flow created: %s" % (flowName))
        self.flow = []
        self.flowPointer = 0

    def addActionAsFunction(self, funcRef, funcName):
        action = {
            'funcName': funcName,
            'funcRef': funcRef
        }
        self.flow.append(action)
        # print(len(self.flow))
        return self

    # runs functions in a sequence
    # data input for the function `i+1` is data ourpur of the function `i`
    def runWithSequentialDataFlow(self, dataIn):
        print("---")
        for action in self.flow:
            print("running action: ", action['funcName'])
            func = action['funcRef']
            result = func(dataIn)
            print("result: ", result)
            dataIn = result
            print("---")

    def addActionAsFunctionWithInputParams(self, funcRef, funcName, inputParameterName=None):
        action = {
            'funcName': funcName,
            'funcRef': funcRef,
            'inputParameterName': inputParameterName
        }
        self.flow.append(action)
        # print(len(self.flow))
        return self

    def run(self, dataName, dataIn):
        print("---")
        self.results = {}
        self.results[dataName] = dataIn
        for action in self.flow:
            print("running action: ", action['funcName'])
            func = action['funcRef']
            dataIn = self.results[action['inputParameterName']]
            result = func(dataIn)
            self.results[action['funcName']] = result
            print("result: ", result)
            dataIn = result
            print("---")
