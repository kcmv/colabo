# __package__ = "use-cases"

# NOTE:
# ColaboFlow.Go version of the previous

import uuid
# from colabo.flow.audit import ColaboFlowGo, audit_pb2
from colabo.flow.go import ColaboFlowGo

from random import randint
from time import sleep

# RUNNING_SCENARIO = 'manual'
# RUNNING_SCENARIO = 'sequential_data_flow'
# RUNNING_SCENARIO = 'descriptive_data_flow'
# RUNNING_SCENARIO = 'descriptive_multidata_flow'
RUNNING_SCENARIO = 'descriptive_multidataoutput_flow'

colaboFlowGo = ColaboFlowGo()


print("colaboFlowGo = %s" % (colaboFlowGo))


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


def f2(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut

def f3(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut

def f4(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut

def f5(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut = gTFN()+":result:"+dataIn
    return dataOut

dataIn1 = "hello 2"

print("Running flow as: %s" % (RUNNING_SCENARIO))

if RUNNING_SCENARIO == 'manual':
    # Running functions
    print("---")
    r1 = f1(dataIn1)
    print("r1: %s" %(r1))
    print("---")
    r2 = f2(r1)
    print("r2: %s" % (r2))
    print("---")
    r3 = f3(r2)
    print("r3: %s" % (r3))
    print("---")
    r4 = f4(r3)
    print("r4: %s" % (r4))
    print("---")
    r5 = f5(r4)
    print("r5: %s" % (r5))

if RUNNING_SCENARIO == 'sequential_data_flow':
    (colaboFlowGo
        .addActionAsFunction(f1, "f1")
        .addActionAsFunction(f2, "f2")
        .addActionAsFunction(f3, "f3")
        .addActionAsFunction(f4, "f4")
        .addActionAsFunction(f5, "f5")
    )

    colaboFlowGo.runWithSequentialDataFlow(dataIn1)

if RUNNING_SCENARIO == 'descriptive_data_flow':
    (colaboFlowGo
        .addActionAsFunctionWithInputParams(f1, "f1", "f0")
        .addActionAsFunctionWithInputParam(f2, "f2", "f1")
        # the data flow is not necessary to be sequential anymore
        .addActionAsFunctionWithInputParam(f3, "f3", "f0")
        .addActionAsFunctionWithInputParam(f4, "f4", "f1")
        .addActionAsFunctionWithInputParam(f5, "f5", "f1")
    )

    colaboFlowGo.runWithDescriptiveDataFlow("f0", dataIn1)

def f6(dataIn1, dataIn2):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn1: %s" % (gTFN(), dataIn1)))
    print(("[%s] dataIn2: %s" % (gTFN(), dataIn2)))
    dataOut = (gTFN()+":(result1:"+dataIn1+"+"
                + ":result2:"+dataIn1+")")
    return dataOut

if RUNNING_SCENARIO == 'descriptive_multidata_flow':
    (colaboFlowGo
        .addActionAsFunctionWithInputParams(f1, "f1", ["f0"])
        .addActionAsFunctionWithInputParams(f2, "f2", ["f1"])
        # the data flow is not necessary to be sequential anymore
        .addActionAsFunctionWithInputParams(f3, "f3", ["f0"])
        .addActionAsFunctionWithInputParams(f4, "f4", ["f1"])
        .addActionAsFunctionWithInputParams(f5, "f5", ["f1"])
        .addActionAsFunctionWithInputParams(f6, "f6", ["f1", "f5"])
     )

    colaboFlowGo.runWithDescriptiveMultiDataFlow("f0", dataIn1)

def f7(dataIn):
    print(("[%s] started." % (gTFN())))
    print(("[%s] dataIn: %s" % (gTFN(), dataIn)))
    dataOut1 = gTFN()+":result1:"+dataIn
    dataOut2 = gTFN()+":result2:"+dataIn
    return dataOut1, dataOut2

if RUNNING_SCENARIO == 'descriptive_multidataoutput_flow':
    (colaboFlowGo
        .addActionAsFunctionWithOutputParams(f1, "f1", ["f0"])
        .addActionAsFunctionWithOutputParams(f2, "f2", ["f1"])
        # the data flow is not necessary to be sequential anymore
        .addActionAsFunctionWithOutputParams(f3, "f3", ["f0"])
        .addActionAsFunctionWithOutputParams(f7, "f7", ["f0"], ["f7.1", "f7.2"])
        .addActionAsFunctionWithOutputParams(f5, "f5", ["f7.1"])
        .addActionAsFunctionWithOutputParams(f6, "f6", ["f7.2", "f2"])
     )

    colaboFlowGo.runWithDescriptiveOutDataFlow("f0", dataIn1)
