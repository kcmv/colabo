#!/usr/bin/python
# -*- coding: utf-8 -*-
# http://www.python.org/dev/peps/pep-0263/
from __future__ import division
from decimal import Decimal
from bukvik.io.BukvikIO import BukvikIO
from bukvik.debug.BukvikDebug import BukvikDebug
import re
from collections import OrderedDict
import csv
import json


class CalculateCSI():
    def __init__(self, name):
        pass

    def process(self, task):
        filenameIn = task["parameters"]["filenameIn"]
        io = BukvikIO()
        print("filenameIn: %s", filenameIn)
        encoding = "utf-8"
        BukvikDebug.debug(self.__class__.__name__, "process",
                          " loading CSV file, filenameIn = %s (encoding: %s)" % (filenameIn, encoding))
        dataIn = io.loadFile(filenameIn, encoding)

        # TODO ... conversion

        jsons = json.loads(dataIn)
        dataOut = {'total': {}, 'individual': []}
        total = {"biased_expressiveness": 0,
                 "biased_exploration": 0,
                 "biased_immersion": 0,
                 "biased_enjoyment": 0,
                 "biased_collaboration": 0,
                 "biased_effort": 0,
                 "overall": 0}
        cnt = 0
        for j in jsons:
            expressiveness = float(j["expressiveness"])
            immersion = float(j["immersion"])
            exploration = float(j["exploration"])
            enjoyment = float(j["enjoyment"])
            effort = float(j["effort"])
            collaboration = float(j["collaboration"])
            rank_expressiveness = float(j["rank_expressiveness"])
            rank_immersion = float(j["rank_immersion"])
            rank_exploration = float(j["rank_exploration"])
            rank_enjoyment = float(j["rank_enjoyment"])
            rank_effort = float(j["rank_effort"])
            rank_collaboration = float(j["rank_collaboration"])
            individual = {
                "email": j["email"],
                "biased_expressiveness": expressiveness*rank_expressiveness,
                "biased_exploration": exploration*rank_exploration,
                "biased_immersion": immersion*rank_immersion,
                "biased_enjoyment": enjoyment*rank_enjoyment,
                "biased_collaboration": collaboration*rank_collaboration,
                "biased_effort": effort*rank_effort,
                "overall": 10*(expressiveness*rank_expressiveness + exploration*rank_exploration + immersion*rank_immersion + enjoyment*rank_enjoyment + collaboration*rank_collaboration + effort*rank_effort)/1.5
            }
            total["biased_expressiveness"] += individual["biased_expressiveness"]
            total["biased_exploration"] += individual["biased_exploration"]
            total["biased_immersion"] += individual["biased_immersion"]
            total["biased_enjoyment"] += individual["biased_enjoyment"]
            total["biased_collaboration"] += individual["biased_collaboration"]
            total["biased_effort"] += individual["biased_effort"]
            total["overall"] += individual["overall"]
            cnt += 1
            dataOut['individual'].append(individual)

        total["biased_expressiveness"] /= cnt
        total["biased_exploration"] /= cnt
        total["biased_immersion"] /= cnt
        total["biased_enjoyment"] /= cnt
        total["biased_collaboration"] /= cnt
        total["biased_effort"] /= cnt
        total["overall"] /= cnt

        dataOut['total'] = total
        # dataOut = json.dumps(dataOut)
        dataOut = json.dumps(dataOut)

        filenameOut = task["parameters"]["filenameOut"]
        io.saveFile(filenameOut, dataOut, encoding)


a = CalculateCSI("calculate-CSI")
task = {
    "parameters": {
        "filenameIn": "file.json",
        "filenameOut": "csi.json",
        "entryId": "email"
    }
}
a.process(task)
