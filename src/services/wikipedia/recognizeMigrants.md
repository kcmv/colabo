# Info

This puzzle tries to understand which of the writers are migrants, in a sense, they were:
  + living in different cities
  + there is menitioning of migration and similar words
  + born, died in different cities or countries (interesting kind of "migration" is when country changed the name, like Yugoslavio -> Serbia, ...)
  + anything else that makes sense

It uses the output dataset of the `extract4category` puzzle, and reads the content of a folder (named in the task file)

Task that directs the puzzle is in `tasks/task-recognizeMigrants-writers.json`

# How to run

```sh
python recognizeMigrants.py -t tasks/task-recognizeMigrants-writers.json
```