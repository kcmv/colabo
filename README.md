# <span style='font-weight:bold'><span style='color: #550000'>Kn</span><span style='color: #bb0000'>All</span><span style='color: #8888ff; font-style: italic;'>Edge</span></span>

__ <span style='color: #550000'>Kn</span><span style='color: #bb0000'>All</span><span style='color: #8888ff; font-style: italic;'>Edge</span></span> __

is a general knowledge layer, that can serve as a separate knowledge mapping service (please @see [KnAllEdge Homepage]{@link http://www.knalledge.org}), but it also serves as a underlying layer for the __<span style='color: gray; font-style: italic;'>Collabo</span><span style='color: black'>Science</span>__ ecosystem (@see [CollaboSceince Homepage]{@link http://www.collaboscience.com}).

Some of the main motivations behind developing <span style='color: #550000'>Kn</span><span style='color: #bb0000'>All</span><span style='color: #8888ff; font-style: italic;'>Edge</span></span> are the following:

* support of collective "knowledge-gardening" (thanks to Jack Park for the term)
* create a semantic-agnostic knowledge model
* create a universal knowledge layer with zero-friction between SoA system components
* create extendable knowledge semantics
* support dialogical process of knowledge creation
* support multi-truth knowledge
* support fuzzy-knowledge
* support personalized knowledge

An outmost goal was succeeding in development of the collaborative-system with unobtrusive and continuous **knowledge-dialogue-decision-action-learn** cycle:

![](../documents/diagrams/CollaboScience-spiral.png)

KnAllEdge is inspired with __ISO__ standard (ISO/IEC 13250:2003) of Mind-maps: **Topic maps** (@see on [Wikipedia]{@link https://en.wikipedia.org/wiki/Topic_Maps}) and __SocioTM__ (please @see [abstract]{@link http://tmra.de/2008/talks/socioTM-relevancies-collaboration-and-socio-knowledge-in-topic-maps.html} and [paper]{@link http://tmra.de/2008/talks/pdf/309-323.pdf}).

## Structure

KnAllEdge structure is implemented as a ***directed graph*** which **data representation** is consisting of the set of:

* **kNode** - representing a graph node and
* **kEdge** - representing a graph edge

Currently, nodes and edges are explicitly organized into containers, called **kMaps** which represent a third construct.

Finally, we have a separate **visual representation** of knowledge that provides both visual isolation of knowledge, supporting multiple visual representation, both multi-perspective and personalized:

* **vkNode** - representing a visual representation of the graph node and
* **vkEdge** - representing a visual representation of the graph edge

## Service

KnAllEdge service is implemented as a full JSON ***RESTful*** web service. It relies on and it is integrated with ***WhoAmI*** service for user authentication and authorization, but it is fairly easy to integrate it with other user management components.

## Product

[www.**<span style='color: #550000'>Kn</span><span style='color: #bb0000'>All</span><span style='color: #8888ff; font-style: italic;'>Edge</span></span>**.org]{@link http://www.KnAllEdge.org} is a product running on the top of the KnAllEdge service, and provides intuitive interface to the KnAllEdge.

## Team

* Sasha Mile Rudan
* Sinisha Rudan
* Jack Park
* Dino Karabeg
* Knowledge Federation

## NOTE:

Backend needs a special **express-resource** package on steroids. You can download it as a separate package [here]{@link http://magicheads.info/downloads/express-resource.zip}. After or even before issuing "**npm install**" you should (re)place the content of the archive into your  backend/node_modules folder.

## Documents

* [KnAllEdge - User Guide] (https://docs.google.com/document/d/1hEVIKLQqV_cEnZgHZUGFiqa20XmbhDmmOMvi6iGnGR8/edit?usp=sharing)
* [KnAllEdge - Technical Guide](https://docs.google.com/document/d/1MluIPyw9eRz3rBM4eXysrs1WX_IIrGkaHLgmGON-s6E/edit?usp=sharing)


# Semantic plugins

## RIMA

[RIMA service] (rima.collaboscience.com)
[RIMA draft discussion] (https://docs.google.com/document/d/1krMfz7G0iFgNc538tzblAwOov2w2JXvoit_UPhndL1Q/edit?usp=sharing)

## IBIS

@see [IBIS plugin] (ibis.collaboscience.com)

**IBIS module** implemented on the top of KnAllEdge differs from the standard implementation of IBIS (please @see for the reference: )[reference to IBIS] ).

The main reason for diverging from the original IBIS implementation is that original IBIS system(s) are designed as an independent systems that provides dialogue mapping. CollaboScience promotes frictionless services integration and knowledge sharing among the services.

The fundamental problem with the most of standards IBIS implementation is that although if they were intended to support ***dialogue mapping*** around different topic of interests of a community, naturally the process of argumentative dialogue necessarily introduce new knowledge artifacts which transforms semantically clean IBIS space into space cognitively polluted with knowledge. This additionally brings confusion in community of 

1. Questions may generalize or specialize other Questions
+ Questions may question, or be suggested by, other Questions, Ideas and Argument
+ Ideas can only respond to Questions
+ Arguments can only support or object to Ideas
+ Ideas can generalize or specialize other Ideas
+ Arguments can generalize or specialize other Arguments

# <span style='color: gray; font-style: italic;'>Collabo</span><span style='color: black'>Science</span> Manifesto

ecosystem (@see the [CollaboSceince Homepage](http://www.collaboscience.com).

1. ecosystem should be frictionless
	1. activities can be seemingly performed across different services
	* data and produced knowledge should be available in any service
* knowledge produced should be cultivated across the time to avoid saturation and information glut
* Artificial Intelligence should explain claims behind decision
* Domain experts should be able to change processes
* It should be highly modular and based on socio-technical processes
	