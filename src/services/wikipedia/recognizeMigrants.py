#!/usr/bin/python
# -*- coding: utf-8 -*-
# http://www.python.org/dev/peps/pep-0263/
from __future__ import division;
from decimal import Decimal;
import re;
from collections import OrderedDict
import csv, json
from argparse import ArgumentParser

from bukvik.io.BukvikIO import BukvikIO
from bukvik.debug.BukvikDebug import BukvikDebug

class CollectPages():
    def __init__(self, name):
        pass;

    def process(self, task):
        folderIn = task["parameters"]["folderIn"]
        BukvikDebug.debug(self.__class__.__name__, "process",
                          "Iterating through the folder: folderIn = %s" % (folderIn))

        # TODO ... collection
        
        encoding = "utf-8";
        
        # iterate through collected pages of writers trying to recognize if they are migrants

        # store findings, list of writers which are recognized as migrants 
        # together WITH ARGUMENTS and REASONING why they are recognized as migrants
        # BECAUSE we want to do a RESPONSIBLE and EXPLAINABLE AI (check the terms)
        # and we want to categorize based on findings, do some diagrams, etc

a = CollectPages("Recognize-Migrant-Writers");

parser = ArgumentParser(
    description='This puzzle tries to understand which of the writers are migrants')
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
