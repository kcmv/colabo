# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random

from datetime import datetime
# import dateutil.parser


class PuzzleA():

    def __init__(self, taskName="taskA"):

        print("[PuzzleA] new task created: %s" % (taskName))

    def process(self, task):
        print("[PuzzleA] task: %s" % (task))
