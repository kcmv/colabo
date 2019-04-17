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

class CSV2JSON():
    def __init__(self, name):
        pass;

    def process(self, task):
        filenameIn = task["parameters"]["filenameIn"];
        io = BukvikIO();
        print("filenameIn: %s", filenameIn);
        encoding = "utf-8";
        BukvikDebug.debug(self.__class__.__name__, "process", " loading CSV file, filenameIn = %s (encoding: %s)" % (filenameIn, encoding));
        dataIn = io.loadFile(filenameIn, encoding);

        # TODO ... conversion
        
        skipRows = [-1]
        rowNoWithColumnNames = -1
        columns_to_translate = {}

        if task["parameters"].has_key("skipRow"):
            skipRows = task["parameters"]["skipRow"]

        if task["parameters"].has_key("rowNoWithColumnNames"):
            rowNoWithColumnNames = task["parameters"]["rowNoWithColumnNames"]

        if task["parameters"].has_key("entryTranslations"):
            for k, v in task["parameters"]["entryTranslations"]["columns_to_translate"].items():
                # print("k: %s, v:%s " % (k, v))
                columns_to_translate[k] = v
            for k,v in columns_to_translate.iteritems():
                translation = task["parameters"]["entryTranslations"]["translation_rules"][v]
                columns_to_translate[k] = translation
                # print("k: %s, v:%s " % (k, columns_to_translate[k]))

        with open(filenameIn, 'r') as fn:
            dialect = csv.Sniffer().sniff(fn.readline().replace("\xef\xbb\xbf",'').strip())
        BukvikDebug.debug(self.__class__.__name__, "process",
                          "Detected dialect.delimiter: %s" % (dialect.delimiter))


        dataOut = []

        # io = BukvikIO()
        # encoding = "utf-8"
        # BukvikDebug.debug("__MAIN__", "",
        #                 " loading Task file, filenameIn = %s (encoding: %s)" % (filenameIn, encoding))
        # csvfile = io.loadFile(filenameIn, encoding)

        # import io
        # csvfile = io.open(filenameIn, mode="r", encoding="utf-8")
        csvfile = open(filenameIn, mode="r")
        # csvfile = str(csvfile)
        # csvfile = csvfile.decode('UTF-8')
        # csvfile = csvfile.encode('UTF-8')
        reader = csv.reader(csvfile, delimiter=dialect.delimiter)
        linecnt = -1
        for row in reader:

            # skip rows that are not in the range
            linecnt += 1
            if linecnt in skipRows: continue

            # the row is the row with column names, let's read them
            if linecnt == rowNoWithColumnNames:
                heads = {}
                for i,col in enumerate(row):
                    if col.strip():
                        heads[i] = col
                continue

            entry = {}

            for i,col in enumerate(row):
                if heads.has_key(i):
                    # print("col: %s, heads[%s]: %s" % (col, i, heads[i]))
                    if heads[i] not in columns_to_translate.keys():
                        entry[heads[i]] = col
                    else:
                        # print("columns_to_translate[heads[i]: ", columns_to_translate[heads[i]])
                        # col = u'6. по приоритету'
                        col = col.decode('utf_8')
                        # print("type(col): %s" % (type(col)))
                        # col = col.encode('utf_8')
                        # print("col: %s" % (col))
                        entry[heads[i]] = columns_to_translate[heads[i]
                                                                ][col]
            if entry:
                dataOut.append(entry)
                    
        dataOut = json.dumps(dataOut, sort_keys=True, indent=4, separators=(',', ': '))
        #dataOut = dataIn

        filenameOut = task["parameters"]["filenameOut"];
        io.saveFile(filenameOut, dataOut, encoding);

a = CSV2JSON("CSI-csv-to-json");

parser = ArgumentParser(description='This Colabo Puzzle converts CSV into JSON and apply cropping and translations')
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
