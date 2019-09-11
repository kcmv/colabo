NOTE: Should go to: http://colabo.space/development

# Development - General

As Colabo.Space is an ecosystem, consisting of both methodologies, tools, components and proto-websites, developing Colabo.Space can be done in various manner:

1. ***Programing Collective Mind*** - practicing it through Colabo.Space prototypes
2. ***Developing Collective Mind Ecosystem*** - integrating ColaboFramework puzzles into a community IT ecosystem
3. ***Developing Colabo Puzzles*** - extending, fixing or producing colabo puzzles
4. ***Developing ColaboFramework*** - contributing to Colabo.Space repository with infrastructural colaborative changes

## Programing Collective Mind

This developing is rather through ***социотехники*** (*sotsiotekhniki*) by practicing provided proto-websites designed for specific communities.

One of the examples is (**NOTE**: Currently SSL certificate is not set properly, so you need to go through browser scurity warnings to reach the website) https://fv.colabo.space/

This proto-websites goes around Sustainable Development and UN's SDGs (Sustainable Development Goals) as a tool for transforming community thinking, group mapping and dialogue and helping in creative thinking and innovative solutions.

The "Developing Collective Mind" development is out of our current focus, as it requires remotely trained facilitators, and we still do not have rigid documentation and ecosystem that would support such model. Therefore, we rather prefer to partner with communities or organizer (like Erasmus+ projects, or various forums and communities) where we use such proto-websites to demonstrate and evaluate Colabo.Space capabilities.

## Developing Collective Mind Ecosystem

This kind of development means that a community is actively engaged in designing and developing a collective mind ecosystem based on the ColaboFramework.

It either means that developers will: 

1. Create a Colabo.Space application/website and build it on the top of Colabo puzzles, or
2. Integrate Colabo puzzles in an existing ecosystem that community practices

Either way, the main focus is on ***using and integrating*** already existing Colabo Puzzles. In such way the community is extending its capacity with colaborative face-to-virtual capacity through ColaboFramework and Colabo.Space principles.

---

In order to integrate existing colabo puzzles there is no need for a special development infrastructure. This is due to the fact that Colabo puzzles are available as an independent `npm packages`. This makes it easy for a developer to simply add all necessary puzzles into the npm dependency file `package.json`.

More info on various colabo puzzles can be found under [Colabo Puzzles Map](https://TBD)

---

Puzzles are divided into subspaces, where each subspace defines particular aspect of the collaborative augmentation. We have `flow` subspace (providing ColaboFlow support for fuzzy (work)flows), `rima` (providing communities mapping and their interests), `knalledge` (providing knowledge representation with KnAllEdge component), etc.

Each subspace provides multiple puzzles for all necessary purposes that the subspace covers. The `flow` subspace provides puzzzes `audit`, `go`, `session`, etc puzzles.

Finally, from the perspective of puzzles' placement, each puzzle belongs either to backend, frontend, service, or is isomorphic (i.e. used at any of places). The puzzle name prefix determines its placement, `b`, `f`, `s`, `i`, respectivelly.

This brings us to the final npm namespacing for each puzzle, consisting of the domainspace, placement and puzzle's name: `@colabo-<subspace>/<placing>-<name>`, for example: `@colabo-flow/f-audit`, `@colabo-flow/b-audit`, `@colabo-topichat/b-clients-orchestration`, `@colabo-utils/i-pub-sub`, `@colabo-flow/s-go`, etc.

## Developing Colabo Puzzles

Colabo Puzzles are core components of Colabo.Space ecosystem. Developers extend and fix existing or create new colabo puzzles in order to fulfil their community needs or to provide additional capabilities for a global Colabo.Space community.

In order to develop Colabo Puzzles, a developer needs to install Colabo.Space dev environment. It consists of:

1. cloning the `https://github.com/Cha-OS/colabo` repository
2. installing Colabo CLI Tools
3. following procedure for developing and building colabo puzzles
4. publishing updated/new colabo.puzzles
5. integrating and testing the puzzles

## Developing ColaboFramework

This is more engaged work on Colabo.Space ecosystem, and currently it is maintaned through core group of developers and discussion and drafting with expert groups and partners.

Nevertheless, this is the most fundamental work on designing a collective mind, as it shapes models, design practices, understands needs and helps in the interoperability of systems and communities.

Work in this domain usually propagates to the whole system and often relates to the ecosystem ***breaking changes***.

## Additional development links

### Installing

+ [INSTALL Colabo.Space](https://github.com/Cha-OS/colabo/blob/master/install/INSTALL.md)

### Deploying

Deploying is automatized through Ansible system. Here you can find instructions on how to do it: [Colabo.Space deployment (Ansible)](https://github.com/Cha-OS/colabo.space-infrastructure/tree/master/provisioning/ansible)

**NOTE**: We are using OpenStack Cloud provided from UiO.

Documents for each Ansible playbook is at [Ansible Playbook docs](https://github.com/Cha-OS/colabo.space-infrastructure/tree/master/provisioning/ansible/docs)

### Development

+ [DEVELOPMENT CHEATSHEET](https://github.com/Cha-OS/colabo/blob/master/development/DEVELOPMENT_CHEATSHEET.md)
