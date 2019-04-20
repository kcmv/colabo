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

class Extract4Category():
    def __init__(self, name):
        pass;

    def process(self, task):
        # TODO ... conversion
        
        categories = task["parameters"]["categories"]           
        dataOut = {}
        
        # TODO:
        
        dataOutStr = json.dumps(dataOut, sort_keys=True, indent=4, separators=(',', ': '))

        filenameOut = task["parameters"]["filenameOut"];
        encoding = "utf-8";
        io.saveFile(filenameOut, dataOutStr, encoding)

a = Extract4Category("Extract Writers");

parser = ArgumentParser(description='This Colabo Puzzle Extracts the list of wikipedia pages (references) that belongs to a specified category')
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
