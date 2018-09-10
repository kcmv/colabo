# Development

This page describes the process of developing extra components.

# Apps

## Creating a new App (Frontend)

- duplicate the folder of an old existing app
-  **package.json** file
  - give the new value for the app-name: **name** parameter
  - in the **scripts** node, we should give the new port for the `"start": "npx ng serve -o --port 8887"` to prevent  their overlapping. Look for a free next port at the lower paragraph **Apps Ports**
  - 
-  in the **angular.json** file rename the project name. Under the node "**projects**", you will see an entry with name resembling name of the app (e.g."collective_sustainable_activism") you should rename in whole the file that name with the new desired project name.
- colabo.config.js
  - rename **puzzles/name** node and the **puzzles/description** node

## Apps Ports

- NCA (Networking for Collective Activism i.e. CoLaboArthon-Collective-Sustainable-Activism): **8887**
- Performing Sustainable CoEvolution (PSC): **8891**
- 

# Linked puzzles / components

If you want to develop all components, you should remove some of npm packages, that can be linked instead from local folders containing them. Please see in the [DEVELOPMENT CHEATSHEET](DEVELOPMENT_CHEATSHEET.md) document.

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

# Install Virtual Box with Ubuntu on OSX

- Some of [extra tips](https://www.lifewire.com/run-ubuntu-within-windows-virtualbox-2202098)
- Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- Download [Server Ubuntu](https://www.ubuntu.com/download/server)

Settings

- devices > shared clipboard > bidirectional
- devices > drag and drop > bidirectional

```sh
sudo updatedb
locate development
```



Tests

```sh
uname -a
sudo apt-get update
sudo apt-get install joe
```

## Mounting

Install guest tools

copy from the Applications/VirtualBox.app/Contents/MacOS the file **VBoxGuestAdditions.iso** somewhere else where it is accessible

mount it in the optical disk

```sh
sudo mount /dev/cdrom /media/cdrom
```

install build support

```sh
sudo apt-get install -y dkms build-essential linux-headers-generic linux-headers-$(uname -r)
```



install guest tools

```sh
sudo /media/cdrom/VBoxLinuxAdditions.ru
sudo adduser colabo vboxsf
logout
```

Add shared folder inside the VirtualBox:

- go to settings > Shared Folders , ad add the folder (make it auto-mount ad permanent)
- for example: development

Locate shared folder inside the virtual guest system

```sh
cd /media/sf_development
```

## Node

- https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

``````sh
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
``````

## Git

```sh
sudo apt-get install git
```

## Mongodb

```sh
sudo apt-get install -y mongodb
```

Start MongoDB:

```sh
sudo service mongod start
```

Verify that MongoDB has started successfully:

```sh
grep "waiting for connections" /var/log/mongodb/mongod.log
```

Logs: `/var/log/mongodb`
**Databases**: `/var/lib/mongodb`

## Node

- https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions

```sh
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

## Frontend

```sh
sudo npm install gulp -g
sudo npm i typings -g
sudo npm install -g bower
```



# Installing SASS support

```sh
sudo apt-get install -y ruby
sudo apt-get install -y ruby-all-dev
ruby -v
sudo gem install sass
sudo gem install compass
sudo gem install susy
sudo gem install breakpoint
sudo gem install normalize-scss
sudo gem install font-awesome-sass -v 4.3.2.1
```

## Zhenia

+ highlight node/text
