# Development

This page describes the process of developing extra component.

## Branching

If you want to develop additional feature, the safest procedure is to create a separate git branch. **NOTE**: This requires developer write access to the CF project.

### creating

You should create a new branch, let's call it `cf-puzzle-ibis`. This will be our new branch where we will create a new CF puzzle,

### Updating dev branch(es)

While developing in other development branches, you should constantly update them with master branch. This will help later merging back easier and with less conflicts.

You do that by being in dev branch (switch to `git checkout cf-puzzle-ibis`) and issuing the following command in the git folder in order to merge all updates from master into our dev branch:

```sh
git merge master
```

NOTE: We might need to fix some conflicts

# Merging dev-branch into master

After you achieved stable functionality in your dev branch, you should merge it back to the master branch and share with the master code and other developers and users :)

We need to be in (switch to `git checkout master`) our dev branch and work from
there.

Now we can merge our dev branch back to the master branch:

```sh
git merge cf-puzzle-ibis
```

Then we should pull latest changes from the server:

```sh
git pull origin master
```

and we should we push it back to the server

```sh
git push origin master
```

Delete local developer branch

After we are finished with dev branch and merged it into master, then we can delete the local dev branch:

```sh
git branch -d cf-puzzle-ibis
```
