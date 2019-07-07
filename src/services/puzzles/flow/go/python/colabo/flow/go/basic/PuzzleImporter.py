#!/usr/bin/python
# -*- coding: utf-8 -*-
# http://www.python.org/dev/peps/pep-0263/
from __future__ import division

import sys

#from BeautifulSoup import BeautifulStoneSoup, PageElement, NavigableString, Tag
# Installing BeautifulSoup in Debian/Ubuntu:
#    sudo aptitude install python-beautifulsoup


class PuzzleImporter():
	"""
		@author: Sasha Mile Rudan

		This class imports puzzle by text reference
	"""

	def __init__(self):
		"""
		Initialization function of the class
		"""

	@staticmethod
	def GetModuleFromNsN(nsN):
		print("getting class for NsN %s" % (nsN))
		parts = nsN.split('.')
		module = ".".join(parts[:-1])
		print("module: %s" % (module))
		try:
			m = __import__(module)
		except ImportError as err:
			print("Error importing module %s: %s" % (module, err))
			return None
		for comp in parts[1:]:
			m = getattr(m, comp)
		classReference = m
		print("class for NsN:%s is %s" % (nsN, classReference))
		return classReference
