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
        filenameIn = task["parameters"]["filenameIn"]
        io = BukvikIO()
        print("filenameIn: %s", filenameIn)
        encoding = "utf-8"
        BukvikDebug.debug(self.__class__.__name__, "process",
                          " loading page collections file, filenameIn = %s (encoding: %s)" % (filenameIn, encoding))
        dataIn = io.loadFile(filenameIn, encoding)

        # TODO ... collection
        
        folderOut = task["parameters"]["folderOut"];
        BukvikDebug.debug(self.__class__.__name__, "process",
                          "Iterating through collected pages and storing them in the folder: folderOut = %s" % (folderOut))

        encoding = "utf-8";
        
        # iterate through collected pages and save each separately
        # io.saveFile(filenameOut, dataOutStr, encoding)

a = CollectPages("Collect-Writers-Pages");

parser = ArgumentParser(description='This puzzle collects wikipedia pages and stores them localy')
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
