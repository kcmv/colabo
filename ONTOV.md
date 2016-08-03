# Intro

Ontov is a facet filtering interface to the KnAllEdge space. It helps us reducing it and narrowing down to pieces of information of our interest.

# Usage

Ontov is very easy to use. All you need is to click inside the ontov field and you will be
immediately prompted with all possible facet types. After choosing appropriate type you can choose
among any possible value under that facet category.

If you choose `Type` you will be offered with `kn:KnAllEdge`, `ibis:QUESTION`, etc, depending if nodes of particular type exist in the map.

# Development

This is a list of exposed methods in the ontov API:

```js
this.collaboPluginsService.provideApi("ontov", {
  name: "ontov",
  items: {
    setSearch: this.setSearch.bind(this),
    addSearchItem: this.addSearchItem.bind(this),
    removeSearchItem: this.removeSearchItem.bind(this),
    getSearchArray: this.getSearchArray.bind(this),
    setOperation: this.setOperation.bind(this)
  }
});
```

For more details look at the : `src/frontend/app/components/ontov/ontov.service.ts`.

Registering for the ontov should be similar to:

```js
//this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
this.brainstormingPluginInfo = {
    name: "brainstorming",
    apis: {
        ontov: {
            items: {
                setSearch: null,
                getSearch: null
            },
            $resolved: false,
            callback: null,
            $promise: null
      }
    }
};

this.brainstormingPluginInfo.apis.ontov.callback = function() {
    that.brainstormingPluginInfo.apis.ontov.$resolved = true;

    // this is an example:
    that.brainstormingPluginInfo.apis.ontov.items.setSearch([
      // If you put more than one it will be OR (union) or
      // AND depending on operation type
      {
        category: 'Type',
        value: 'type_ibis_question'
      }

      // for some reason this doesn't filter
      // {
      //   category: 'iAmId',
      //   value: '556760847125996dc1a4a241'
      // }

      // {
      //   category: 'Tree',
      //   value: 'Ideological model' // node name
      // }
      //
    ]);
    */
};

this.collaboPluginsService.registerPlugin(this.brainstormingPluginInfo);
```

**NOTE**: For the list of all possible facets and their usage, check the file `src/frontend/app/components/ontov/ontov.service.ts` and
you can find function _getFacetMatches_<FILTER_NAME> (FILTER_NAME = Name, Tree, ...)
like _getFacetMatches_Name, etc

## Ontov service

### Developing Ontov plugins

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
