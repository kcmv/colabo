# KnAllEdge

# Misc
- link on the node name in properties
  - or shortcut/icon on node itself
  - so we can copy a node name with link

## Versioning

- make node version
- return old version
- support multiple versions for different users


## Automatic backing up / exporting

## offline

## Improve MD editor

## Crowlers/robots friendly

+ render content for deep links
  - either use backend rendering (headless browsers) and cache output or
  - generate some basic content not identical to fully rendered browser-content
- for a deep link
  - allow to integrate name of the map (and node) in the path together with ids
  - through metadata and html content for Crowlers
    - show the name of the map
    - or if it is a node, show node content, even image, ...

## pre/post focus, pre/post change
+ Be sure if we change a focus or content that our visual experience and interactions are as expected/corrected
+ i.e.
  - if we create a new node and start typing the node name we should not loose first few characters but ***deliver*** them into the node name
  - if we are re-selecting node, other components, like tag-managing component should not deliver tags' interaction into an old node
  - if we go back to the maps list and click on a new map to open it, we shouldn't see an old map until the new one flushes it away (the same problem happens with youtube checked lists for the current playing video)

## Temp context
A set of nodes that are relevant to me and which I am currently working on

## ContextualWalker

Integrate it with KnAllEdge background (and move it into angular)
So contexts are stored on server, accessible anywhere and they can naturally extend into something bigger, but still keeping SEPARATION strongly between the TEMP-CURRENT-FOCUS and KNOWLEDGE that is built during that process

## Export/Import

* An easy way of importing Markdown
  - file into bunch of nodes
  - additional aspects as tags annotation should be recognized and matched against existing tags
  - not too many questions, AI should help and do some reasonable assumptions
  - AI should offer some ambiguous assumptions and matchings, and also some potentially usefull matchings/corrections that it assumed/learned from the external knowledge
* Exporting and reimporitng should be intuitive
  - it should be simple to export a part of knowledge space (branch, or sequence (presentation)) to the plain text, work on it, change, move arround, and safely rematch it and recover back to the repository
    - maybe some special export-knowledge should be kept either in the system (and then ID or user choose when imports) or at the bottom of the file
    - or even more exciting, user can interact with knowledge through regular editor, like Atom, sublime, or some other markdown editor and in the background in the realtime, KnAllEdge will correspond and map it into the kn-space

# RIMA

Sasa Rudan: gledam malo za ono map->rima
Sasa Rudan: nije naivno (smiley)
Sasa Rudan: mislim nije problem da se izvede
Sasa Rudan: ali je problem kako pristupiti problemu (smiley)
Sasa Rudan: KO je tu GLAVNI koji odlucuje, itd
Sasa Rudan: po meni je najlogicnije da RIMA ne radi nista (to mozemo i konfigurisati kao ponasanje) dok KnAlledge Map servis ne ucita mapu, i tada samo proslijedi listu usera koji nas interesuju RIMA servisu i tada ih on povuce
Sasa Rudan: mada za sada mislim da nemamo RIMA poziv ka serveru koji prima listu usera, mada nam to naravno treba

---

# MISC

+ export
  + to PDF
    + http://pdfkit.org/docs/images.html
    + https://parall.ax/products/jspdf
+ conflict
  if we both are presenters
+ editor
  + double-click => editing
  + support for text colors and formats
    + https://en.wikipedia.org/wiki/Lightweight_markup_language
    + https://en.wikipedia.org/wiki/Markdown#Markdown_Extra
    + https://en.wikipedia.org/wiki/Markdown#CommonMark
    + https://en.wikipedia.org/wiki/ReStructuredText
    + https://en.wikipedia.org/wiki/MultiMarkdown
    + https://en.wikipedia.org/wiki/Comparison_of_document_markup_languages
    +
+ properties
  + show node name
  + show node type
  + show node parent edge(s) type
  + make link
+ Structuring
  + move nodes hierarchy with mouse
  + on removing node with children offer options
    + add children to parent of removed node
    + let them hang in the air
    + ask to move them manually before removing
  + disable system nodes for editing, etc, so you cannot add to the presentations or presentation node manually
+ IBIS
  + [done] show number of voters
  + redesign interface (red should not be sum :) )
+ icon for properties of node doesn't have popup explanation
+ Presentation
  + add support for multiple presentations
  + extend/use to form linear textual book, article, ... i can use it for dissertation
  + make youtube support
  + make next/previous slide navigation buttons
  + make it impossible to add nodes to Presentation(s) nodes
  + make it impossible to add root node to presentations and create circular loops
  + problem with expanded content after presentation mode
    + in `<md-sidenav-layout _ngcontent-tfh-1="" class="main-content" flex="" layout="row" style="overflow: auto; height: 100%; display: block;">` the ` display: block;` is added and not removed after closing presentation mode
  + images
    + support resizing with standard image format (translate markdown into img tag on the fly?)
  + background support
+ Discussion (Oleg)
  + limitation on number of votes, etc
+ map
  + button to position to the currently selected node
+ Search
  + show context, paths to nodes (when there are duplicates, or not sure which one)
  + make popup to go over all CF components, not just map
  + searching through all nodes in all maps
+ Photos
  + make it easier to upload to flickr and extract url
  + support non-public flickr photos through url accessible only photos
+ Connectivity
  + System is showing offline icon when we are offline but at the same time connected to the local CF server and normally saving

Optimizing the Collective Mind
Self-organizing Collective Mind

  - we are component
  - technology
  - collective mind is possible to evolve

Academic Form
- this said this, this said that
- reflect to them and say
- we are doing this and this
- they (academics) feel comfortable
-


- потресаюшча
  -

Poliscopy
- make information that serves society
- information is everything
- action is information
  - information is aspect
  - deffinition is abastract
- we have freedom of designing perspectives
- they are conventions
  - by definition/convention information is recorded experience
  - chair is not information but it is record of experience
    - it has encoded how to make it, how to sit on it
- poliscopy
- prototip
  - it is the main object of the science
  - same as experiment and theory is conventional object
  - we do not create a model but a prototype
  - in a real science
  - book is a prototype
    - of writing
    - it is a prototype of type of informaction
    - it is not real and objectiveness of world, but it affecting world through its information
- systemic epistemology
  - how



The Russian event we mentioned you has officially finished and we had a very cool international poetic and drawing art reflection to journalist reportage, a kind of cross-discipline and society feedback loop. The event became viral in Russia and we want to extend it with few more invitation-only poets like you. We will also join it with 24h Literature Marathon in Belgrade, Serbia. Are you interested to take part in any of them?

Dear Saumya,

How are you doing? I just saw a poem about her Majesty Vagina! pretty cool :) In Serbian vagina is called "рибица" = 'little fish' :D

I am currently in Russia, Sinisha just came back and there in snowy Siberia we just finished a first round of an interesting trans-disciplinary and inter-national artistic experiment.

It was a CoLaboArthon between journalists and artists. We invited international artists to make their artistic reflections on instant/short-form of journalism. It was an event of few hundred journalists. We see it really important and interesting to engage poets and other artists with that flow of real and touching journalistic stories and a dialogue and exchange of emotions across nations.

We want to do a 2nd round tomorrow and introduce more artists. We sent a post on your FB group. Could you please approve the post?

We will soon do more exotic practices and keep you updated.

Best,
Siniha and Sasha


=====


I am currently in Russia, Sinisha just came back and there in snowy Siberia we just finished a first round of an interesting trans-disciplinary and inter-national artistic experiment.

It was a CoLaboArthon between journalists and artists. We invited international artists to make their artistic reflections on instant/short-form of journalism. It was an event of few hundred journalists. We see it really important and interesting to engage poets and painters with that flow of real and touching journalistic stories and a dialogue and exchange of emotions across nations.

We will do it much


=====

here is an official description:
in short, it's an interesting, but a time-limited (and now, invitation-only) offer for international poetic collaboration  🙂
Our ChaOS organization is organizing an international CoLaboArthon event at a big journalist event.
Journalists were going around the Siberian, Russian city of Tyumen and collecting stories/photos.
Your task is to choose a story that inspires you and give your short poetic reflection.
So, if you want to make an interesting yet simple collaboration with journalists and other poets/artist; if you want some of your verses to be published in Russia;
and later read at the 24h Literature Marathon in Belgrade, Serbia, here is our event - just join it and all explanation is there:
https://www.facebook.com/events/169175616936761/
BUT you have some 48hrs, till Friday, 23:59 CET 😉
what is more than enough, because we expect just few impressionistic verses as you will see in comments on photos, done by other poets already
I’m here for any question!
you can write in your own language 😉

===

- We are proposing an OPEN competition for participants, to get generic and more international groups
- interviewing them
- each group should have a concrete issue of conflict so
  - it can be input for us so our lab can work on real problems
  - participant will be more involved
- we need to identify what we are
- each event
- participants can split
- motivating other stakeholders
- big LARS game for practicing
- we have NGO
Socio-technical solutions for collaboration and dialogical and artistical resolution of conflicts/

Colaboarthon
  EVS need supporters, how they can motivate them and inspire them
DialoGame
Open Innovation
  - an online solution for innovating ideas (of i.e. conflict resolution)

Structured Democratic Dialogue

Demonstration

Integrate flow of actions with the support for rolling-back, undoing, redoing, ...

Support for supper-fast loading of a single node (when you are sharing document with someone who is not into CF)
