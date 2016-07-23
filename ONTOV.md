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

### Ontov plugins

```js

_getFacetMatches_What(searchTerm:string){
  return ['ISSS', 'system', 'todo', 'sustainable'];
}
_doesMatch_What(searchTerm:string, vkNode){
  return vkNode.kNode.name === searchTerm;
}

this.registerFacet("What", {
  getFacetMatches: this._getFacetMatches_What.bind(this),
  doesMatch: this._doesMatch_What.bind(this)
});
```
