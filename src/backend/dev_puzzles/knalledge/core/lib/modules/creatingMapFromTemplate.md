## Template Format

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

src/backend/dev_puzzles/knalledge/core/lib/modules/mapTemplateProcessor.ts

is initiated from

src/backend/dev_puzzles/knalledge/core/lib/modules/kMap.ts

after a user initiate **Map Creation**.

# ToDo

1. in https://github.com/Cha-OS/colabo/issues/380

