# Info

It access the dbPedia and collect the list of pages that belongs to a specified category and stores it in a JSON file (named in the task file) in the `data` folder

Task that directs the puzzle is in `tasks/task-extract4category-writers.json`

# How to run

```sh
python extract4category.py -t tasks/task-extract4category-writers.json
```

# Goal

Retrieves the list of pages about writers (that belongs to the `writers` categort)

This will be the list of pages/references that will be collected in the later puzzle

usefull links:
+ https://www.google.com/search?q=wikipedia+writers+category
+ https://en.wikipedia.org/wiki/Category:Writers
+ https://en.wikipedia.org/wiki/Category:Lists_of_writers_by_language
+ https://www.google.com/search?q=wikipedia+migration+writers
+ https://refugeehosts.org