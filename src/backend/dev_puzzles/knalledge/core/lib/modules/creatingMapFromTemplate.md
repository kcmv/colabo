# Usage

## Template Format

A template consists of nodes of type:

1. `actions`
   1. used for groupin several other nodes or actions
2. `insert`
   1. a concrete data to be inserted

**Output variables**

- marked with the beginning `$>`
- Example in the template: `"_id" : "$>rootNodeId"`
- Output variables <u>cannot</u> be nested in objects as input variables. 

**Input variables**

- marked with the beginning `$`
- Example in the template:
 -  `"name" : "$mapName"`
 -  `"mapId" : "$mapId"`

- input variables can be nested in objects, eg: 

  ```json
  "dataContent": {
    "property": "$desc"
  }
  ```

# Development

1. `src/backend/dev_puzzles/knalledge/core/lib/modules/mapTemplateProcessor.ts` is initiated from `src/backend/dev_puzzles/knalledge/core/lib/modules/kMap.ts` and started by calling `processTemplate`, after a user initiate **Map Creation**.
2. the process continues with `processTemplateNode(this.template);` call that gives the template's root node as a first node
3. `processTemplateNode` switches on `node.type`. If it's:
   1. `action` , it iterates through its children and for each calls `processTemplateNode` recursively;
   2. `insert`
      1. it calls `processVariables` that creates node's `inputVariables` and `outputVariables` objects by parsing the node content
      2. it tries to insert the node by calling `insertNode`
      3. if could not been inserted (because it depends on input variables), we put it in the queue to be processed later when those input variables are resolved: `this.nodesPendingForInsert.push(node)`
4. `onInsert` is called by `insertNode` 
   1. it removes the inserted node from `nodesPendingForInsert` 
   2. it calls setVariablesFromSavedOutputVariables for the inserted node, which updates `this.variables` with the output-values of the node, set-up by its insert (as its `_id`)
   3. then it callses `processNodesInQueue`, expecting that some of their input variables are resolved by this output variables
      1. it calls `insertNode`for each node after resolving their input variables

# ToDo

1. in https://github.com/Cha-OS/colabo/issues/380

