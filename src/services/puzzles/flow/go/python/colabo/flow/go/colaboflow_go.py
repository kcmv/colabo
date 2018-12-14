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

    def addActionAsFunction(self, funcRef, actionName):
        action = {
            'name': actionName,
            'funcRef': funcRef
        }
        self.flow.append(action)
        # print(len(self.flow))
        return self

    def addActionAsFunctionWithInputParam(self, funcRef, actionName, inputParameterName=None):
        action = {
            'name': actionName,
            'funcRef': funcRef,
            'inputParameterName': inputParameterName
        }
        self.flow.append(action)
        # print(len(self.flow))
        return self

    # runs functions in a sequence
    # data input for the function `i+1` is data ourpur of the function `i`
    def runWithSequentialDataFlow(self, dataIn):
        print("---")
        for action in self.flow:
            print("running action: ", action['name'])
            func = action['funcRef']
            result = func(dataIn)
            print("result: ", result)
            dataIn = result
            print("---")

    def addActionAsFunctionWithInputParams(self, funcRef, actionName, inputParameterNames=None):
        action = {
            'name': actionName,
            'funcRef': funcRef,
            'inputParameterNames': inputParameterNames
        }
        self.flow.append(action)
        # print(len(self.flow))
        return self

    def runWithDescriptiveMultiDataFlow(self, dataName, dataIn):
        print("---")
        self.results = {}
        self.results[dataName] = dataIn
        for action in self.flow:
            # print("running action: ", action)
            print("running action: ", action['name'])
            func = action['funcRef']
            inputParameterNames = action['inputParameterNames']
            inputParameters = []
            for inputParameterName in inputParameterNames:
                  inputParameters.append(self.results[inputParameterName])
            result = func(*inputParameters)
            self.results[action['name']] = result
            print("result: ", result)
            print("---")

    def addActionAsFunctionWithOutputParams(self, funcRef, actionName, inputParameterNames=None, outputParameterNames=None):
        action = {
            'name': actionName,
            'funcRef': funcRef,
            'inputParameterNames': inputParameterNames,
            'outputParameterNames': outputParameterNames
        }
        self.flow.append(action)
        # print(len(self.flow))
        return self

    def runWithDescriptiveOutDataFlow(self, dataName, dataIn):
        print("---")
        self.results = {}
        self.results[dataName] = dataIn
        for action in self.flow:
            # print("running action: ", action)
            print("running action: ", action['name'])
            func = action['funcRef']
            inputParameterNames = action['inputParameterNames']
            inputParameters = []
            for inputParameterName in inputParameterNames:
                  inputParameters.append(self.results[inputParameterName])
            outputParameterNames = action['outputParameterNames']
            result = func(*inputParameters)
            if outputParameterNames != None and len(outputParameterNames)>1:
                results = result
                print("results: ", results)
                if(len(outputParameterNames) != len(results)):
                    print("Expected number of parameters: %s, but got %s instead" % 
                          (len(outputParameterNames), len(results)))
                for i in range(len(outputParameterNames)):
                    outputParameterName = outputParameterNames[i]
                    result = results[i]
                    self.results[outputParameterName] = result
                    print("result[%s]: %s" % (i, result))
            else:
                print("result: ", result)
                self.results[action['name']] = result
            print("---")
