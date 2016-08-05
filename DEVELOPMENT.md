# Development

This page describes the process of developing extra component.

## Branching

If you want to develop additional feature, the safest procedure is to create a separate git branch. **NOTE**: This requires developer write access to the CF project.

### creating

You should create a new branch, let's call it `cf-puzzle-ibis`. This will be our new branch where we will create a new CF puzzle,

### updating dev branch(es)

While developing in other development branches, you should constantly update them with master branch. This will help later merging back easier and with less conflicts. You do that by being in dev branch and issuing the following command in the git folder:

```sh
git merge master
```
