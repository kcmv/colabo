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
        "skipRow": [0, 2, 3],
        "rowNoWithColumnNames": 1,
        "columnWithEntryId": "email",
        "entryTranslations": {
            "translation_rules": {
                "rank": {
                    "6. по приоритету": 0,
                    "5. по приоритету": 1,
                    "4. по приоритету": 2,
                    "3. по приоритету": 3,
                    "2. по приоритету": 4,
                    "1. по приоритету": 5
                }
            },
            "columns_to_translate": {
                "rank_collaboration": "rank",
                "rank_enjoyment": "rank",
                "rank_immersion": "rank",
                "rank_exploration": "rank",
                "rank_expressiveness": "rank",
                "rank_effort": "rank"
            }
        }
    }
}
a.process(task);
