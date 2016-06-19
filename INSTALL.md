# Building Process

The majority of server and client components are built on **MEAN stack** so the environment necessary for starting tool should be straightforward.

## Local machine

[fixing-npm-permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions)
`sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}`

Install tools:

```sh
npm install -g bower
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
# sudo npm install node-gyp -g

su
    # sudo npm install npm -g
    sudo npm install gulp -g
    sudo npm i typings -g
    sudo npm install -g typescript
    sudo npm install ts-node -g
    # sudo npm install typescript-node -g
    sudo npm install node-gyp -g
    sudo npm install marked -g

cd src/backend/
    npm install --production

    # sudo npm cache clean
    # rm -rf node_modules

joe /etc/apache2/sites-enabled/knalledge.org
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

### Backend deployment

#### Compress on the local machine

```sh
cdd
cd KnAllEdge/src
cp -r backend backend_archive
rm -r backend_archive/node_modules
rm -r backend_archive/modules/topiChat/node_modules
rm -r backend_archive/modules/topiChat-knalledge/node_modules
rm -r backend_archive/tools/node_modules

zip -r -X prod-2016.06.19.zip backend_archive
open .
```

#### Upload on the server

+ load with a SFTP client and upload the prod zip to a temp folder or `/var/www/knalledge/src/backend/`

```sh
ssh mprinc@knalledge.org
```

If there is a new module required you need to install them and backup node_modules folders:

```js
cd /var/www/knalledge/src/backend

npm install --production
cd /var/www/knalledge/src/
rm -r node_modules_backup
mkdir -p node_modules_backup node_modules_backup/tC node_modules_backup/tCK node_modules_backup/tools

cp -r backend/node_modules node_modules_backup
cp -r backend/modules/topiChat/node_modules node_modules_backup/tC
cp -r backend/modules/topiChat-knalledge/node_modules node_modules_backup/tCK
cp -r backend/tools/node_modules node_modules_backup/tools

ls node_modules_backup
ls node_modules_backup/tC
```

```
cd /var/www/knalledge/src/backend/
unzip prod-2016.06.19.zip
rm -r config/ continuousServer.sh info.txt KnAllEdgeBackend.js models/ modules/ package.json tools/

mv backend_archive/* .
rm -r backend_archive/

chmod -R o+rx .
chmod -R g+wrx .

cp -r ../node_modules_backup/tC/* modules/topiChat
cp -r ../node_modules_backup/tCK/* modules/topiChat-knalledge
cp -r ../node_modules_backup/tools/* tools

nodejs KnAllEdgeBackend.js 8888

su
status knalledge-b
stop knalledge-b
status knalledge-b

start knalledge-b
status knalledge-b

restart knalledge-b
status knalledge-b
```

### Production deployment
There are two groups of actions to be done. First on local machine, then on the server

#### Build system on the local machine:

```sh
cdd
cd KnAllEdge/src/frontend
npm run build.prod
zip -r -X prod-2016.06.19.zip dist/prod
```

#### Upload on the server

Open the folder with zip file at your local machine:

```sh
open .
```
Start a SFTP client and upload the zip file to a production folder on server:  `/var/www/knalledge_frontend/prod`

Login to the server and unpack CF system and configure it:

```sh
ssh mprinc@knalledge.org
cd /var/www/knalledge_frontend/prod
rm -rf components/ css/ data/ dist/ fonts/ images/ js/ sass/
unzip prod-2016.06.19.zip
mv dist/prod/* .
rm -r dist/

chmod -R o+rx .
chmod -R g+wrx .

cd /var/www/knalledge_frontend

# replace
# `env=envs.localhost` -> `env=envs.server`
sed -i 's/env\=envs\.localhost/env\=envs\.server/g' prod/js/shims_bundle.js
sed -i 's/base\ href\=\"\/\"/base\ href\=\"\/prod\/\"/' prod/index.html

#optional commenting:
joe prod/index.html
# var disableLog = true;

```

Copy angular-material fonts from the local machine to the server.

Back on the local machine:

```sh
open ./node_modules/ng2-material/font
```

Upload all the 'font files' (MaterialIcons-Regular...) from the folder `src/frontend/node_modules/ng2-material/font` to the `/var/www/knalledge_frontend/prod/css/`

Upload `KnAllEdge/src/frontend/dist/prod/css/all.css` to the `/var/www/knalledge_frontend/prod/css/` folder

```sh
cdd
cd KnAllEdge/src/frontend
open ./dist/prod/css/
```


### TestProduction deployment
There are two groups of actions to be done. First on local machine, then on the server

#### Build system on the local machine:

```sh
cdd
cd KnAllEdge/src/frontend
npm run build.prod
zip -r -X prod-2016.06.19.zip dist/prod
```

#### Upload on the server

Open the folder with zip file at your local machine:

```sh
open .
```
Start a SFTP client and upload the zip file to a production folder on server:  `/var/www/knalledge_frontend/prod`

Login to the server and unpack CF system and configure it:

```sh
ssh mprinc@knalledge.org
cd /var/www/knalledge_frontend/prod
rm -rf components/ css/ data/ dist/ fonts/ images/ js/ sass/
unzip prod-2016.06.19.zip
mv dist/prod/* .
rm -r dist/

chmod -R o+rx .
chmod -R g+wrx .

cd /var/www/knalledge_frontend

# replace
# `env=envs.localhost` -> `env=envs.server`
sed -i 's/env\=envs\.localhost/env\=envs\.server/g' prod/js/shims_bundle.js
sed -i 's/base\ href\=\"\/\"/base\ href\=\"\/prod\/\"/' prod/index.html

#optional commenting:
joe prod/index.html
# var disableLog = true;

```

Copy angular-material fonts from the local machine to the server.

Back on the local machine:

```sh
open ./node_modules/ng2-material/font
```

Upload all the 'font files' (MaterialIcons-Regular...) from the folder `src/frontend/node_modules/ng2-material/font` to the `/var/www/knalledge_frontend/prod/css/`

Upload `KnAllEdge/src/frontend/dist/prod/css/all.css` to the `/var/www/knalledge_frontend/prod/css/` folder

# TypeScript

sudo npm install -g ts-node
sudo npm install -g typescript
rm -r typings
npm run postinstall

Precompile tools at one machine
`tsc`
copy them to Sinisha's machine

## Typings
  typings install open --ambient --save
  typings install merge-stream --ambient --save

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

**NOTE**: Backend needs a special ```express-resource``` package on steroids. You can download it as a separate package [here](http://magicheads.info/downloads/express-resource.zip). After or even before issuing ```npm install``` you should (re)place the content of the archive:

in your ```backend/node_modules``` folder

It is similar with deep-assign package which you can find [here](http://magicheads.info/downloads/deep-assign.zip).

then you should go to 2. in ```backend/modules/topiChat```
and do npm install there

and (re)start the server

    npm start

## Collabo Server

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
