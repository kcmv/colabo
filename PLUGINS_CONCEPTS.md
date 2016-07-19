# Plugins

# General

KnAllEdge is aiming with to fulfill the following paradigm:

<div style='border: 1px solid gray; padding: 5px; margin: 5%'>

[__<span style='color: #550000'>Kn</span><span style='color: #bb0000'>All</span><span style='color: #8888ff; font-style: italic;'>Edge</span></span>__ system](http://www.knalledge.org) is a general agnostic knowledge layer, that can serve as a separate knowledge-mapping service, but it is mostly user as an underlying layer for the  [__<span style='color: gray; font-style: italic;'>ColLabo</span><span
 style='color: black'>Framework</span>__ ecosystem](http://www.collaboscience.com).
</div>

Having KnAllEdge as agnostic knowledge layer is a great thing; helping us to use it for different purposes and keep it as light as possible.

However, we also want to make it as suitable as possible for each concrete usecase!

To achieve this, we have designed and architectured CF to be modular and pluggable in almost every part of the system.

Those plugins/modules/components we simply call ***PUZZLE***s or more technically ***Semantic Plugins***.

## Why

To create possibility of dialogue between components, puzzles, ...

Having puzzles we are able to add new feature as a puzzle to existing system, or remove it if we do not need it and the system should work just fine.

The main part of ther system that is responsible for puzzlebility of the CF sistem is a **CollaboPluginsService** service.

There are three constructs/concepts.

+ components
+ references
    + references to objects
    + TODO: rename
+ apis
    + api functions

core CF is equivalent as CF puzzles from the perspective of CF puzzlebility.

## How does it work?

Every part of CF can export itself, or part of itself through the `CollaboPluginsService` service.

Every other CF puzzle can request feature exported other by other puzzle or componenent.

## Issues

### Time of exporting and availability of plugin

A puzzle can ask for a plugin that is still not exported.

When components are loaded then they export plugins.

Therefore we have promises, that are trigered when plugin is avalialbe.

so any time consumer can check if plugin is available, and also can be notified first time it become available.

# Two-bounded connection

`CollaboPluginsService` is aware of every consumer.

So consumer need to register its needs.

# Open issues

Externaly register plugins, in `config.plugins.js`.
