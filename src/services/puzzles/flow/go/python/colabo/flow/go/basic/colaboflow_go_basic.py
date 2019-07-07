# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random
import site

from datetime import datetime
# import dateutil.parser
from argparse import ArgumentParser

from .parseFlowJSON import ParseFlowJSON
from .PuzzleImporter import PuzzleImporter

class ColaboFlowGoBasic():
    goRequestDefault = None
    stubDefault = None

    def __init__(self, flowName="basic-flow"):
        
        print("[ColaboFlowGoBasic] new flow created: %s" % (flowName))
        self.flow = []
        self.flowPointer = 0
        self.parseFlowJSON = ParseFlowJSON()
        self.puzzleImporter = PuzzleImporter()

        parser = ArgumentParser(description='This ColaboFlow.Go Orchestrator')
        parser.add_argument("-tf", "--taskfile", dest="task_filename",
                            help="JSON file with the task description", default=None, metavar="<TASK_FILE>")
        parser.add_argument("-f", "--flow", dest="flow_filename",
                            help="JSON file with the flow description", default=None, metavar="<FLOW_FILE>")
        parser.add_argument("-t", "--taskname", dest="task_name",
                            help="name of the task in flow to be executed", default=None, metavar="<TASK_NAME>")
        parser.add_argument("-p", "--puzzles", dest="puzzles_folder",
                            help="Folder containing puzzles", default=None, metavar="<PUZZLES_FOLDER>")

        self.args = parser.parse_args()

    def loadFlow(self, flowFilename=None):
        if flowFilename == None:
            flowFilename = self.args.flow_filename
        self.parseFlowJSON.loadFlow(flowFilename)
        self.parseFlowJSON.printFlow()
    
    def execute(self):
        if self.args.puzzles_folder:
            print("Adding puzzles folder: %s" % (self.args.puzzles_folder))
            site.addsitedir(self.args.puzzles_folder)
        flow = self.parseFlowJSON.getFlow()
        print("Task to execute: %s" % (self.args.task_name))
        for task in flow:
            if self.args.task_name and self.args.task_name != task["name"]:
                continue
                
            print("task name: %s" % (task["name"]))
            print("\t puzzle: %s" % (task["puzzle"]))
            puzzleClass = PuzzleImporter.GetModuleFromNsN(task["puzzle"])
            puzzleObj = puzzleClass(task["name"])
            puzzleObj.process(task)
