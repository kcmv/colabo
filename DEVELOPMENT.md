# Development

This page describes the process of developing extra component.

## Branching

If you want to develop additional feature, the safest procedure is to create a separate git branch. **NOTE**: This requires developer write access to the CF project.

References:
+ [3.2 Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
+ [Create a new branch with git and manage branches](https://github.com/Kunena/Kunena-Forum/wiki/Create-a-new-branch-with-git-and-manage-branches)
+ [Using Branches](https://www.atlassian.com/git/tutorials/using-branches/)
+ [SO - Git create branch from current checked out master?](http://stackoverflow.com/questions/1453129/git-create-branch-from-current-checked-out-master)

### creating

You should create a new branch, let's call it `cf-puzzle-ibis`. This will be our new branch where we will create a new CF puzzle,

To create a branch and switch to it at the same time, you can run the git checkout command with the -b switch:

```sh
git checkout -b cf-puzzle-ibis
```

NOTE: This is shorthand for:

```sh
git branch cf-puzzle-ibis
git checkout cf-puzzle-ibis
```

Push the dev branch on the github:

```sh
git push origin cf-puzzle-ibis
```

You can see all branches created by using :

```sh
git branch
```

You can rename branch with:

```sh
git branch -m <new-branch-name>
```

### Updating dev branch(es)

While developing in other development branches, you should constantly update them with master branch. This will help later merging back easier and with less conflicts.

You do that by being in dev branch (switch to `git checkout cf-puzzle-ibis`) and issuing the following command in the git folder in order to merge all updates from master into our dev branch:

```sh
git merge master
```

NOTE: We might need to fix some conflicts. To see the merging status and conflicts you can run:

```sh
git status
```

You can merge them with editor or run visual tool:

```sh
git mergetool
```

After fixing all conflicts you should commit again:

```sh
git commit
```

# Merging dev-branch into master

After you achieved stable functionality in your dev branch, you should merge it back to the master branch and share with the master code and other developers and users :)

We need to be in (switch to `git checkout master`) the master branch and work from
there.

Now we can merge our dev branch back to the master branch:

```sh
git merge cf-puzzle-ibis
```

To merge the specified branch into the current branch, but always generate a merge commit (even if it was a `fast-forward` merge). This is useful for *documenting all merges* that occur in your repository:

```sh
git merge --no-ff cf-puzzle-ibis
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

If there is some "garbage" in the dev branch that you didn't want to commit and merge you need to do forced deleting:

```sh
git branch -D cf-puzzle-ibis
```

# TODO

## Zh

+ highlight node/text
