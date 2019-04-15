#!/usr/bin/python
# -*- coding: utf-8 -*-
# http://www.python.org/dev/peps/pep-0263/
from __future__ import division;
from decimal import Decimal;
from bukvik.io.BukvikIO import BukvikIO
from bukvik.debug.BukvikDebug import BukvikDebug
import re;
from collections import OrderedDict

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
        
        dataOut = dataIn

        filenameOut = task["parameters"]["filenameOut"];
        io.saveFile(filenameOut, dataOut, encoding);

a = CSV2JSON("CSI-csv-to-json");
task = {
    "parameters": {
        "filenameIn": "ReTesla 2018 (Responses) - FV18 Responses.csv",
        "filenameOut": "file.json",
        "skipRowsNo": 1,
        "rowNoWithColumnNames": 2
    }    
}
a.process(task);
