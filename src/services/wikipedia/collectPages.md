# Info

This puzzle collects wikipedia pages and stores them localy

It reads JSON file (named in the task file) in the `data` folder as links to wikipedia pages, and stores them in the folder  (named in the task file)

Task that directs the puzzle is in `tasks/task-collectPages-writers.json`

# How to run

```sh
python collectPages.py -t tasks/task-collectPages-writers.json
```