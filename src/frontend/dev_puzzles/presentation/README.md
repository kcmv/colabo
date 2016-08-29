# ToDo

- migrate view component dependencies from `config.plugins.js` to puzzle's `config.js`
```js
/* Configuration */
var plugins = {
    "ViewComponents": {

        // ...

        "bottomPanel.BottomPanel": {
            components: {
                // ...
                'cf.puzzles.presentation.list': {
                    active: true,
                    path: "cf.puzzles.presentation.list"
                },
            }
        },

        // ...

    },
```
- disable map keyboard control while in the presentation mode
- make bottomPanel controllable (or greater at least) height
- remove slide button from presentation(s) nodes

# Intro

Presentation puzzle provides possibility for presenting nodes as set of slides that you can present in a similar way as regular presentation application (Microsoft Power Point, ...)

## States

This are 3 states of presentation puzzle

- disabled
- presentation-editing
- presentation-show

### Disabled state

Presentation is neither active nor visible

### Presentation editing

### Presentation show

## CF-level Implications

### Should we encode collective information (like nodes presentation) that are node related inside or outside nodes

#### Inside nodes

- better regarding the encapsulation
- better for copy/paste
- works bad with multiple "instances": like node belonging to multiple iterations
  - we can use an array: something similar to voting, but even then problem with integrity and maintenance (deleting presentation requires deleting in many nodes)
  - similarly voting process would be great to be able to reuse and vote (and keep votes existing in parallel) for different purposes, sessions, ...

#### Outside nodes

- better regarding the maintenance of

### Should we create new node(s) for collective informations

#### new nodes

- it makes sense to create new one, since nodes are our approach for storing data

##### type and node visibilities

#### keep in the map node

- good for clarity, "clean" approach, but map is becoming global container without structure.

#### keep it externally

- no good reason for that
- different and specialized mechanisms for management
- ...

### References to relevant nodes and visibility

- We can use **edges** to refer to all nodes that are part of collection
- These edges can by system edges and therefore not constantly **visible**
- Edges and node relations can be visible only in particular state or context
  - state: we activated presentation-editing mode
  - context: only under presentation-node they are visible

## Open questions

### Ordering nodes

How should we order nodes in the presentation

#### Order them under the presentation node

We can order them by ordering nodes that are referenced from presentation-node

- good: it is local for each presentation
- good: regular nodes are not affected
- good: we can have clear and localized overview of nodes
- bad: we cannot have two isolated views: one for exploring whole set of nodes, and other for presentation (maybe if  we allow multiple views (and multiple view controls))

#### Order them with changing order num on each node

- each node in presentation-editing mode has

#### Order them in presentation-list component

#### Hybrid

- keep them, order them and visualize them through nodes hierarchy under the presentation-node
- provide presentation-list as a separate way of ordering them in non-dustruptive way regarding node hierarchy
- support indes for each node when on presentation
