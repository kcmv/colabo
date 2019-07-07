# -*- coding: utf-8 -*-
#!/usr/bin/python

from __future__ import print_function

import random

from datetime import datetime
# import dateutil.parser


class PuzzleB():

    def __init__(self, taskName="taskB"):

        print("[PuzzleB] new task created: %s" % (taskName))

    def process(self, task):
        print("[PuzzleB] task: %s" % (task))
