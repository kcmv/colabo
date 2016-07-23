## visualSearch

### callbacks

#### search(searchString, searchCollection)

searchCollection is array of pills
pill.get("category")
pill.get("value")

current result: ["name", "type", "iAmId", "user", "what", "tree", "approvals"]

#### facetMatches(callback)

callback should be called with the list of facet names

#### valueMatches(facet, searchTerm, callback)

facet: "name"
searchTerm: ""

=> callback called with: ["workshop test", "test"]
