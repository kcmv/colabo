# Mac. Condensed steps for Devs
+ Installing Node.JS
	+ https://nodejs.org/en/download/
	+ instead of
	```sh 
	brew install node
	```
	+ after this, you can test if you have installed successfully node and containing npm, by running:
	```sh 
	node -v
	npm -v
	```
+ create development folder
+ open the terminal and navigate to that folder, then run:
```sh
git clone https://github.com/mprinc/Knalledge
``` 
+ Install mongodb server
	+ we use Brew for its installation, so first:
```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
```
	+ then
```sh
brew install mongodb
sudo mkdir -p /data/db
```
+ Install backend
```sh
cd /Users/sir/Documents/data/development/Knalledge/ c:/data/development/Knalledge/
cd src/backend
npm install
cd modules/topiChat
npm install
cd ../topiChat-knalledge
npm install
```
+ install frontend:
```sh
sudo npm install node-gyp -g
sudo npm install gulp -g
sudo npm i typings -g
sudo npm install -g typescript
sudo npm install -g bower
sudo npm install marked -g

# it could be necessary to do the following as well
cd /usr/local/lib/node_modules
sudo chmod -R o+rx .
sudo chmod g+s .
```

# Win. Condensed steps for Devs
+ .....
+ cd c:/data/development/Knalledge/
+ .....

# Windows

+ create/get-in development folder
+ clone project from github

```sh
git clone https://github.com/mprinc/Knalledge
```

## MongoDB

Default MongoDB installation should be good enough. The mongo database must be running before starting the server.

### Installing mongodb server

[MongoDB for Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

Get info about windows:

```sh
wmic os get caption
wmic os get osarchitecture
```

Download the [community version](https://www.mongodb.com/download-center#community).

**NOTE:** These instructions assume that you have installed MongoDB to `C:/mongodb` folder. Therefore you need to choose custom installation and set the installation path to `C:/mongodb`.

### Data folder

MongoDB requires a **data directory** to store all data. MongoDB’s default data directory path is /data/db. Create this folder using the following commands from a Command Prompt:

```sh
md c:/data/db
```

### Running

#### Windows

Navigate to `c:/mongodb/bin/`in command prompt and start the server:

```sh
c:
cd c:\mongodb\bin\
mongod
```

When server starts, windows firewall system will ask you for granting access. Allow full access to the server.

Mongod should start on **27017 port**.

#### Checking

```sh
sudo netstat -tulpn | grep ':27017'
```

### Info

[official install](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

+ log: `/var/log/mongodb/*`
+ upstart config: `/etc/mongod.conf`
+ mongod config: `etc/init/mongod.conf `
+ data: ``
+ service: `/etc/init.d/mongod`

relevant files:

```
/var/log/upstart/
/data/db/mongod.lock
/etc/init.d/.#mongod
/usr/bin/mongod
/var/lib/mongodb
/var/lib/mongodb/EarthCube.0
/var/log/mongodb
```

running services:
```sh
chkconfig --list
runlevel
```

Upstart logs your service execution in a log file by the same name in `/var/log/upstart/your-service-name.log`. It should be helpful.

### repair

```sh
rm /data/db/mongod.lock
rm /var/lib/mongodb/mongod.lock
mongod --repair
```

### MongoChef


[MongoChef](http://3t.io/mongochef/download/) is a great client for Mongo db.

After installing it, you need to connect, and create new connection, it should be stright forward for the local server. Be sure that connection is with host: `localhost`, and port `27017`.

### Creating database and collections

+ Start MongoChef
+ Connect to localhost
+ create database `KnAllEdge` (File > Add Database ...).
+ download [KnAllEdge DB samples]()
+ import them in Mongo
    * select database in MongoChef
    * import collections (***tables*** in relational DBS are called ***collections*** in Mongod Schemaless DBS)
        - Database > Import Collections
        - Click on plus and navigate to your demo KnAllEdge collections
        - select all collections (each exported as a separate json file)
        - **If you haven't installed KnAllEdge before and do not have important data** then chose option `Drop collection first if it allready exists`
        - You can also select `Validate JSON before import`
        - Import
+ Now you can explore collections through the MongoChef interface


## BACKEND

### Install backend

```sh
cd c:/data/development/Knalledge/
cd src/backend
npm install
cd modules/topiChat
npm install
cd ../topiChat-knalledge
npm install
```

### Additional packages

**NOTE**: Backend needs a special ```express-resource``` package on steroids. You can download it as a separate package [here](http://magicheads.info/downloads/express-resource.zip). After or even before issuing ```npm install``` you should (re)place the content of the archive:

in your ```backend/node_modules``` folder

It is similar with deep-assign package which you can find [here](http://magicheads.info/downloads/deep-assign.zip).

then you should go to 2. in ```backend/modules/topiChat```
and do npm install there

and (re)start the server

    npm start
### Run backend server

```sh
cd c:/data/development/Knalledge/
cd src/backend
npm start
```

When server starts, windows firewall system will ask you for granting access. Allow full access to the server.

KnAllEdge backend server should start on **8888 port** and its real-time support (**topiChat**) should start at **8060 port**.

### Testing the server

You can go to broweser and type the following command in order to check the connection and database integration:
```sh
http://localhost:8888/kmaps/by-participant.json
```

You should expect something similar to (just and excerpt):
```js
{"data":[{"_id":"5543c546645912db4fee9654","name":"Test Sasha","rootNodeId":"5543c545645912db4fee9653","type":"mcm_map","ideaId":0,"parentMapId":"Test","dataContent":{"mcm":{"authors":"Sasha"}},"__v":0,"updatedAt":"2015-05-01T18:26:14.352Z","createdAt":"2015-05-01T18:26:14.352Z","isPublic":true,"participants":[],"version":1,"activeVersion":1},{"_id":"5543c656645912db4fee9666","name":"SNAC","rootNodeId":"5543c656645912db4fee9665","type":"mcm_map","ideaId":0,"parentMapId":"SNAC","dataContent":{"mcm":{"authors":"Eunseo Choi"}},"__v":0,"updatedAt":"2015-05-01T18:30:46.402Z","createdAt":"2015-05-01T18:30:46.402Z","isPublic":true,"participants":[],"version":1.2,"activeVersion":1},{"_id":"5543cee34a653c345007c839","name":"mcm_changes","rootNodeId":"5543cee34a653c345007c838","type":"mcm_changes","ideaId":0,"parentMapId":"","dataContent":{"mcm":{"authors":"Sasha"}},"__v":0,"updatedAt":"2015-05-01T19:07:15.585Z","createdAt":"2015-05-01T19:07:15.583Z","isPublic":true,"participants":[],"version":1,"activeVersion":1},
```

and similarly, for:
```js
http://localhost:8888/howAmIs/all/.json
```

**Note**: you will have prefix in the returned json: `)]}',` that helps to avoid browser JS attacks.

This is a positive signal that the backend is installed properly.

## Frontend

### building tools

```sh
sudo npm install node-gyp -g
# sudo npm install npm -g
sudo npm install gulp -g
sudo npm i typings -g
sudo npm install -g typescript
# sudo npm install ts-node -g
# sudo npm install typescript-node -g
# sudo npm install node-gyp -g
sudo npm install -g bower
sudo npm install marked -g

# it could be necessary to do the following as well
cd /usr/local/lib/node_modules
sudo chmod -R o+rx .
sudo chmod g+s .
```

### code

```sh
cd c:/data/development/Knalledge/
cd src/frontend
npm install
npm run typings install
# or
typings -v
node_modules/typings/dist/bin.js -v

node_modules/typings/dist/bin.js install
```

#### Typings issues

+ open `src\frontend\typings\globals\angular-protractor\index.d.ts` and
+ go to the bottom of the file and comment the line `declare var $: cssSelectorHelper;` => `// declare var $: cssSelectorHelper;`

# Building Process

The majority of server and client components are built on **MEAN stack** so the environment necessary for starting tool should be straightforward.

## Local machine

[fixing-npm-permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions)
`sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}`

Install tools:

```sh

```

### NPM privileges problem

```sh
cd /usr/local/lib/node_modules
sudo chmod o+rx npm
cd npm
sudo chmod -R o+r  *
sudo chmod o+rx  node_modules/
```

This didn't work: [solution?](https://docs.npmjs.com/getting-started/fixing-npm-permissions)

### Bower install issues

```sh
bower install
```

With installing bower packages on OSX you might need xcode, here are some hints what might be happening and how to resolve it:

if you get the error:

```
"xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun"
```

This is a problem with 'OS X El Capitan', you should run: `xcode-select --install`

More on:
+ [invalid-active-developer-path-on-mac-os-x-after-installing-ruby](http://stackoverflow.com/questions/28706428/invalid-active-developer-path-on-mac-os-x-after-installing-ruby)
+ [xcrun-error-invalid-active-developer-path-library-developer-commandline-tools-missing-xcrun/](http://tips.tutorialhorizon.com/2015/10/01/xcrun-error-invalid-active-developer-path-library-developer-commandline-tools-missing-xcrun/)

## Server
Server is at the moment completely built as **node.js** environment. Therefore you need node and npm tools installed to run it properly. When you have them installed all you need to do is to install necessary packages with

```sh
git clone https://github.com/mprinc/KnAllEdge
mv KnAllEdge knalledge
chmod -R g+ws knalledge
    drwxrwsr-x+  7 mprinc developers
    drwxrwsr-x   7 mprinc developers    4096 Mar 17 09:28 knalledge
# npm install


    # http://stackoverflow.com/questions/7487793/symbolic-link-not-inheriting-permissions
    cd /usr/local/bin
    sudo chmod -h go+rx typings

cd src/backend/
    npm install --production

    # sudo npm cache clean
    # rm -rf node_modules

joe /etc/apache2/sites-enabled/framework.colabo.space
# DocumentRoot /var/www/knalledge/src/frontend
# ->
# DocumentRoot /var/www/knalledge_frontend
apache2ctl restart

cd /var/www/knalledge_frontend/
chmod -R o+r *
ls -al node_modules | grep ng2
chmod -R g-s node_modules/*
chmod -R go+rx node_modules/*
ls -al node_modules | grep ng2
```


```js
# From here are tasks on the local server:
# go to the folder `frontend/dist/dev`
# and zip it
# `zip dev.zip`
# rename it to show date `dev-YYYY.MM.DD.zip` (e.g `dev-2016.03.18.zip`)

# use SFTP to put this zip at destination `/var/www/knalledge_frontend/dist`

# now, login to server:
# > `ssh user@server`
cd /var/www/knalledge_frontend/dist
ls -al
    resulting in: # drwxrwxr-x  9 mprinc developers    4096 Mar 17 12:39 dev
rm -rf dev
unzip <name_of_the_zip> (e.g. `unzip dev-2016.03.18.zip`)
# check about this, but probably should not do it: `chmod -R g-s dev`
chmod -R go+rx dev

cd /var/www/knalledge_frontend
cp dist/dev/components/collaboPlugins/globalEmitterService.js dist/dev/components/collaboPlugins/GlobalEmitterService.js
cp dist/dev/components/collaboPlugins/globalEmitterServicesArray.js dist/dev/components/collaboPlugins/GlobalEmitterServicesArray.js


joe dist/dev/js/config/config.env.js
#uncomment:    `//var env = envs.localhost;`
#comment:    `var env = envs.server;`

# =======================
```

```js
cp -r dist/dev
cd ../frontend
    npm install --production

joe /var/www/knalledge_frontend/dist/dev/index.html
# var disableLog = true;

joe /var/www/knalledge_frontend/dist/dev/components/knalledgeMap/css/default.css

# .knalledge_map_middle_bottom{
#     display: none;
#     ...
# }

stop knalledge-b
start knalledge-b
restart knalledge-b

```

Test as a script:

```sh
nodejs /var/www/knalledge/src/backend/KnAllEdgeBackend.js
```

Test in the service context:

```sh
sudo -u www-data /usr/bin/nodejs /var/www/knalledge/src/backend/KnAllEdgeBackend.js 8888
```

# TypeScript

sudo npm install -g ts-node
sudo npm install -g typescript
rm -r typings
npm run postinstall

Precompile tools at one machine
`tsc`
copy them to Sinisha's machine

## Typings
  typings install open --global --save
  typings install merge-stream --ambient --save-dev

  typings install
  https://github.com/DefinitelyTyped/DefinitelyTyped/blob/ffceea9dd124d277c4597c7bd12930666ec074c5/open/open.d.ts
  "open": "github:DefinitelyTyped/DefinitelyTyped/open/open.d.ts#ffceea9dd124d277c4597c7bd12930666ec074c5"
  src/frontend/typings.json

```js
declare module 'open' {
	function open(target: string, app?: string): void;
	export = open;
}
```

```js
declare module open {
	export function open(target: string, app?: string): void;
}

declare module "open" {
	export = open;
}
```

```sh
// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/dc2c61c4b295d88befeba7fa542582d0e8ec85dc/merge-stream/merge-stream.d.ts
// Type definitions for merge-stream
// Project: https://github.com/grncdr/merge-stream
// Definitions by: Keita Kagurazaka <https://github.com/k-kagurazaka>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module MergeStream {

    interface IMergedStream extends NodeJS.ReadWriteStream {
        add: (source: NodeJS.ReadableStream) => IMergedStream;
    }

    function merge<T extends NodeJS.ReadableStream>(...streams: T[]): IMergedStream;
    export = merge;
}

declare module "merge-stream" {
	export = MergeStream;
}
```

```sh
npm WARN enoent ENOENT: no such file or directory, open '/Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/v8-debug/package.json'
npm ERR! Darwin 15.3.0
npm ERR! argv "/usr/local/bin/node" "/usr/local/bin/npm" "install" "--dev"
npm ERR! node v5.8.0
npm ERR! npm  v3.8.0
npm ERR! path /Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/.staging/npmlog-57f83870
npm ERR! code ENOENT
npm ERR! errno -2
npm ERR! syscall rename

npm ERR! enoent ENOENT: no such file or directory, rename '/Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/.staging/npmlog-57f83870' -> '/Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/node-inspector/node_modules/v8-debug/node_modules/node-pre-gyp/node_modules/npmlog'
npm ERR! enoent ENOENT: no such file or directory, rename '/Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/.staging/npmlog-57f83870' -> '/Users/sir/Documents/data/Development/KnAllEdge/src/backend/node_modules/node-inspector/node_modules/v8-debug/node_modules/node-pre-gyp/node_modules/npmlog'
npm ERR! enoent This is most likely not a problem with npm itself
npm ERR! enoent and is related to npm not being able to find a file.
npm ERR! enoent
```

## Colabo Server

### users

add mprinc/sir to sudoers

```sh
usermod -a -G sudo mprinc
usermod -a -G sudo sir
```

### Node

[info](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

```sh
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## MongoDB

Default MongoDB installation should be good enough. The mongo database must be running before starting the server.

# Installing mongodb server

[MongoDB for OSX](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

installing [brew](http://brew.sh/):

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

install mongodb:

```sh
brew update
brew install mongodb
brew install mongodb --with-openssl
```

To have launchd start mongodb now and restart it at login: `brew services start mongodb`

Or, if you don't want/need a background service you can just run:

`mongod --config /etc/mongod.conf`

To start it in background (forked)
`mongod --fork --config /etc/mongod.conf`

Linux
```sh
sudo service mongod stop
sudo service mongod start
sudo service mongod restart
```

After that you need to restart all services listening to it
```sh
restart knalledge-b
```

**TODO**: we need to make backend smart enough to detect new/restart/crash of the database

## Installing SASS support

```sh
ruby -v
sudo gem install sass
sudo gem install compass
sudo gem install susy
sudo gem install breakpoint
sudo gem install normalize-scss
sudo gem install font-awesome-sass -v 4.3.2.1
```

if different version is installed you can uninstall it with:
```sh
sudo gem uninstall font-awesome-sass -v 4.6.2
```

On some machines it might be necessary to do:
```sh
sudo chmod -R og+rx /Library/Ruby/Gems/2.0.0/
```
in order to provide reading access.

# Running the backend

When you want to run the server you need to run specific ```package.json``` command: start. You do it by running:

npm start

Server will start, connect to default mongodb port and start listening for client connections on the announced port.

## Client

![KnAllEdge - frontend class-diagram](documents/diagrams/KnAllEdge-frontend-class-diagram.png)

Client is implemented at the moment as a ng1/2 hybrid (Angular1/Angular2). Angular

### Debugging support

Debugging is handled with the support of the [debugpp](https://www.npmjs.com/package/debugpp) and [debug](https://www.npmjs.com/package/debug) libraries. Therefore in the browser console you need to enable debugging in order to see it:

This is how you would globally enable debugging:
```js
localStorage.debug = '*';
```

or just for particular namespace (and all subspaces)
```js
localStorage.debug = 'knalledge.collaboPluginsServices.*';
```

or just for the semantic-subspace (`error` in this case) of a for particular namespace:
```js
localStorage.debug = 'knalledge.collaboPluginsServices.*.error';
```

### Development deployment

#### server
Anything that should be served OUT of the dist/dev folder, should be mapped in the server config to be available: `src/frontend/tools/utils/code_change_tools.ts`

This is how we have enabled `bower_components` and images:

```js
let routes:any = {
  ...
  '/bower_components': 'bower_components',
  '/app/images': 'app/images'
};

```

### DefinitelyTyped conflicts

jQuery and Protractor (Seleinum) both use the same global variable: ```$```. There fore TypeScript compiler complains:

    ⨯ Unable to compile TypeScript

    typings/main/ambient/jquery/jquery.d.ts (3212,13): Subsequent variable declarations must have the same type.  Variable '$' must be of type 'cssSelectorHelper', but here has type 'JQueryStatic'. (2403)

At the moment there is no simple solution except remove it from some of the tools, etc.
We did remove it manually:

Here are

# Installing new machine (problems)

+ get backup of working machine
+ git clone ...
+ copy/overwrite folders/files
    + frontend
        + bower_components
        + node_modules
        + tools/manual_typings
        + typings
        + typings.json
    + backend
        + it should work fine so just
            + cd backend
            + npm install
                + cd modules/topiChat
                + npm install
                + cd modules/topiChat-knalledge
                + npm install
        + or do it faster by copying/overwriting folders/files
            + node_modules
            + modules/topiChat/node_modules
            + modules/topiChat-knalledge/node_modules
+ now you can do symbolic linking

## Proxying

### system rerouting 80 -> 8088

- http://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode
- http://eastmond.org/blog/?p=45

#### One time

```sh
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8088
```

#### Continuous

```sh
joe /etc/rc.local
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8088
```
Enable it
sudo chown root /etc/rc.local
sudo chmod 755 /etc/rc.local
sudo /etc/init.d/rc.local start
Check services and ports

### Proxying - node-fork

(`/etc/init/knalledge-fork.conf`)

```sh
start/status/stop knalledge-fork
```

or in a testing mode:

```sh
/usr/bin/nodejs /var/www/web_fork/index.js
exec sudo -u www-data /usr/bin/nodejs /var/www/web_fork/index.js
```

check port listening processes:
```sh
sudo netstat -tulpn | grep ':80'
sudo netstat -tulpn | grep ':8088'
```

[more info](http://www.cyberciti.biz/faq/what-process-has-open-linux-port/)

### Proxying - Nginx

+ http://stackoverflow.com/questions/33055212/nginx-multiple-server-blocks-listening-to-same-port
+ http://stackoverflow.com/questions/11773544/nginx-different-domains-on-same-ip
+ https://laracasts.com/discuss/channels/forge/two-sites-on-same-server

Install the nginx proxy and:

+ remove default from sites-enabled

```
api.colabo.space
```
# TopiChat
server {
  listen 80;
  # alias for two subdomains
  server_name topichat.colabo.space;

  location / {
    proxy_pass http://localhost:8002;
  }
}

# API
server {
  listen 80;
  # alias for two subdomains
  server_name api.colabo.space;

  location / {
    proxy_pass http://localhost:8001;
  }
}

server {
  listen 80;
  # alias for two subdomains
  server_name cf.colabo.space framework.colabo.space map.colabo.space;
  # root /var/www/domain1;

  location / {
    proxy_pass http://localhost:8000;
  }
}
```

​```sh
cd /etc/nginx
rm /sites-available/default
joe /sites-enabled/framework.colabo.space
ln -s  ../sites-available/framework.colabo.space framework.colabo.space
# test configuration
nginx -t
sudo service nginx restart
# if necessary
sudo shutdown -h now
```

## Errors

### Could not build the server_names_hash, you should increase server_names_hash_bucket_size

+ http://charles.lescampeurs.org/2008/11/14/fix-nginx-increase-server_names_hash_bucket_size

```sh
joe /etc/nginx/nginx.conf
```

uncoment and increase
```
http{
  server_names_hash_bucket_size 256;
}
```

# Big files

[How to Find Out Top Directories and Files](http://www.tecmint.com/find-top-large-directories-and-files-sizes-in-linux/)

```sh
du -a | sort -n -r | head -n 5
du -hs * | sort -rh | head -5
# To display the largest folders/files including the sub-directories, run:
du -Sh | sort -rh | head -5
# Top File Sizes Only
find -type f -exec du -Sh {} + | sort -rh | head -n 5
```
