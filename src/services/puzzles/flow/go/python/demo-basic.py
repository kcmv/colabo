#!/usr/bin/python
# -*- coding: utf-8 -*-
# http://www.python.org/dev/peps/pep-0263/
from __future__ import division
from decimal import Decimal
import re
from collections import OrderedDict
import csv
import json
import os
import uuid
from random import randint
from time import sleep

from colabo.flow.go import ColaboFlowGoBasic

colaboFlowGo = ColaboFlowGoBasic()


print("colaboFlowGo = %s" % (colaboFlowGo))

# colaboFlowGo.loadFlow("flows/flow-test.json")
colaboFlowGo.loadFlow()
colaboFlowGo.execute()


# gets the name of function inspectig stack
def gTFN():
    import traceback
    return traceback.extract_stack(None, 2)[0][2]

# Set of functions
def f1(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut

