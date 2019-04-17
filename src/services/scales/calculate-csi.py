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
from argparse import ArgumentParser

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

        normalization_satisfaction_question = task["parameters"]["scaling"]["normalization_satisfaction_question"]
        normalization_ranking_question = task["parameters"]["scaling"]["normalization_ranking_question"]
        normalization_overall = task["parameters"]["scaling"]["normalization_overall"]
        normalization_biased = task["parameters"]["scaling"]["normalization_biased"]
        normalization_input = task["parameters"]["scaling"]["normalization_input"]
        jsons = json.loads(dataIn)
        dataOut = {'total': {}, 'individual': []}
        total = {
            "input_expressiveness": 0,
            "input_exploration": 0,
            "input_immersion": 0,
            "input_enjoyment": 0,
            "input_collaboration": 0,
            "input_effort": 0,

            "rank_expressiveness": 0,
            "rank_exploration": 0,
            "rank_immersion": 0,
            "rank_enjoyment": 0,
            "rank_collaboration": 0,
            "rank_effort": 0,

            "biased_expressiveness": 0,
            "biased_exploration": 0,
            "biased_immersion": 0,
            "biased_enjoyment": 0,
            "biased_collaboration": 0,
            "biased_effort": 0,

            "csi_overall": 0
        }
        data_keys  = dict()
        cnt = 0
        for j in jsons:
            if j["email"] in data_keys:
                print("Data entry for user <%s> already exists" % (j["email"]))
                continue

            input_expressiveness = normalization_satisfaction_question * float(j["expressiveness"])
            input_immersion = normalization_satisfaction_question * float(j["immersion"])
            input_exploration = normalization_satisfaction_question * float(j["exploration"])
            input_enjoyment = normalization_satisfaction_question * float(j["enjoyment"])
            input_effort = normalization_satisfaction_question * float(j["effort"])
            input_collaboration = normalization_satisfaction_question * float(j["collaboration"])

            rank_expressiveness = normalization_ranking_question*float(j["rank_expressiveness"])
            rank_immersion = normalization_ranking_question*float(j["rank_immersion"])
            rank_exploration = normalization_ranking_question*float(j["rank_exploration"])
            rank_enjoyment = normalization_ranking_question*float(j["rank_enjoyment"])
            rank_effort = normalization_ranking_question*float(j["rank_effort"])
            rank_collaboration = normalization_ranking_question*float(j["rank_collaboration"])
 
            rank_total = rank_expressiveness + rank_immersion + rank_exploration + rank_enjoyment + rank_effort + rank_collaboration
            
            if rank_total != 15:
                print("Wrong rank ('%d') for user: %s" % (rank_total, j["email"]))
                continue
            data_keys[j["email"]] = True

            individual = {
                "email": j["email"],
                "input_expressiveness": normalization_input * input_expressiveness,
                "input_exploration": normalization_input * input_exploration,
                "input_immersion": normalization_input * input_immersion,
                "input_enjoyment": normalization_input * input_enjoyment,
                "input_collaboration": normalization_input * input_collaboration,
                "input_effort": normalization_input * input_effort,
                "biased_expressiveness": input_expressiveness * rank_expressiveness / normalization_biased,
                "biased_exploration": input_exploration * rank_exploration / normalization_biased,
                "biased_immersion": input_immersion * rank_immersion / normalization_biased,
                "biased_enjoyment": input_enjoyment * rank_enjoyment / normalization_biased,
                "biased_collaboration": input_collaboration * rank_collaboration / normalization_biased,
                "biased_effort": input_effort * rank_effort / normalization_biased,
                "csi_overall": (input_expressiveness*rank_expressiveness + input_exploration*rank_exploration + input_immersion*rank_immersion + input_enjoyment*rank_enjoyment + input_collaboration*rank_collaboration + input_effort*rank_effort)/normalization_overall
            }

            total["input_expressiveness"] += individual["input_expressiveness"]
            total["input_exploration"] += individual["input_exploration"]
            total["input_immersion"] += individual["input_immersion"]
            total["input_enjoyment"] += individual["input_enjoyment"]
            total["input_collaboration"] += individual["input_collaboration"]
            total["input_effort"] += individual["input_effort"]

            total["rank_expressiveness"] += rank_expressiveness
            total["rank_exploration"] += rank_exploration
            total["rank_immersion"] += rank_immersion
            total["rank_enjoyment"] += rank_enjoyment
            total["rank_collaboration"] += rank_collaboration
            total["rank_effort"] += rank_effort

            total["biased_expressiveness"] += individual["biased_expressiveness"]
            total["biased_exploration"] += individual["biased_exploration"]
            total["biased_immersion"] += individual["biased_immersion"]
            total["biased_enjoyment"] += individual["biased_enjoyment"]
            total["biased_collaboration"] += individual["biased_collaboration"]
            total["biased_effort"] += individual["biased_effort"]

            total["csi_overall"] += individual["csi_overall"]
            cnt += 1
            dataOut['individual'].append(individual)

        total["input_expressiveness"] /= cnt
        total["input_exploration"] /= cnt
        total["input_immersion"] /= cnt
        total["input_enjoyment"] /= cnt
        total["input_collaboration"] /= cnt
        total["input_effort"] /= cnt

        total["rank_expressiveness"] /= cnt
        total["rank_exploration"] /= cnt
        total["rank_immersion"] /= cnt
        total["rank_enjoyment"] /= cnt
        total["rank_collaboration"] /= cnt
        total["rank_effort"] /= cnt

        total["biased_expressiveness"] /= cnt
        total["biased_exploration"] /= cnt
        total["biased_immersion"] /= cnt
        total["biased_enjoyment"] /= cnt
        total["biased_collaboration"] /= cnt
        total["biased_effort"] /= cnt

        total["csi_overall"] /= cnt

        dataOut['total'] = total
        # dataOut = json.dumps(dataOut)
        dataOut = json.dumps(dataOut, sort_keys=True,
                             indent=4, separators=(',', ': '))

        filenameOut = task["parameters"]["filenameOut"]
        io.saveFile(filenameOut, dataOut, encoding)


a = CalculateCSI("calculate-CSI")

parser = ArgumentParser(description='This Colabo Puzzle calculates JSON dataset into CSI index')
parser.add_argument("-t", "--task", dest="task_filename",
                    help="JSON file with the task description", default=True, metavar="<TASK_FILE>")

args = parser.parse_args()

io = BukvikIO();
encoding = "utf-8";
BukvikDebug.debug("__MAIN__", "",
    "loading Task file, filenameIn = %s (encoding: %s)" % (args.task_filename, encoding))
taskStr = io.loadFile(args.task_filename, encoding)
taskObj = json.loads(taskStr)
# print(taskObj)
a.process(taskObj);
