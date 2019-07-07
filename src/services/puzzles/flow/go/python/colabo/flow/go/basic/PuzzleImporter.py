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
	def GetPuzzleRefFromPuzlePath(puzzlePath):
		"""
		Loads puzzle reference (class, method, etc) from a puzzle path
		"""

		puzzleRef = {
			puzzlePath: puzzlePath
		}
		print("getting module path for NsN %s" % (puzzlePath))
		nsNParts = puzzlePath.split(':')
		moduleName = nsNParts[0]
		puzzleRef["moduleName"] = moduleName
		print("moduleName: %s" % (moduleName))

		print("loading module %s" % (moduleName))
		try:
			module = __import__(moduleName)
		except ImportError as err:
			print("Error importing moduleName %s: %s" % (moduleName, err))
			return None
		puzzleRef["module"] = module
		print("loaded module %s: %s" % (moduleName, module))

		print("traversing down the module %s" % (moduleName))
		moduleNameParts = moduleName.split('.')
		moduleLeaf = module
		for comp in moduleNameParts[1:]:
			moduleLeaf = getattr(moduleLeaf, comp)
		print("reached the module %s: %s" % (moduleName, moduleLeaf))

		classOrModuleLeaf = moduleLeaf
		# parsing class part
		if len(nsNParts)>1 and len(nsNParts[1])>0:
			className = nsNParts[1]
			puzzleRef["className"] = className
			classReference = getattr(moduleLeaf, className)
			classOrModuleLeaf = classReference
			puzzleRef["classReference"] = classReference
			print("class for NsN:%s is %s" % (puzzlePath, classReference))

		# parsing method part
		if len(nsNParts)>2 and len(nsNParts[2])>0:
			methodName = nsNParts[2]
		else:
			methodName = "process"

		puzzleRef["methodName"] = methodName
		methodReference = getattr(classOrModuleLeaf, methodName)
		puzzleRef["methodReference"] = methodReference
		print("method for NsN:%s is %s" % (puzzlePath, methodReference))

		return puzzleRef
