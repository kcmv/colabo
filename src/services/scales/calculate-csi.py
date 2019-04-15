#!/usr/bin/python
# -*- coding: utf-8 -*-
# http://www.python.org/dev/peps/pep-0263/
from __future__ import division;
from decimal import Decimal;
from bukvik.io.BukvikIO import BukvikIO
from bukvik.debug.BukvikDebug import BukvikDebug
import re;
from collections import OrderedDict
import csv, json

class CalculateCSI():
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
                 
        # dataOut = json.dumps(dataOut)
        dataOut = dataIn

        filenameOut = task["parameters"]["filenameOut"];
        io.saveFile(filenameOut, dataOut, encoding);

a = CalculateCSI("calculate-CSI");
task = {
    "parameters": {
        "filenameIn": "file.json",
        "filenameOut": "csi.json",
        "entryId": "email"
    }
}
a.process(task);
