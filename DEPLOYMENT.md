# Backend deployment

## info

Production backend server is manged through service script at: `/etc/init/knalledge-b.conf`.

Beta backend server is manged through service script at: `/etc/init/knalledge-b-beta.conf`.
## Procedure

Follow instructions in the src/backend/scripts/README.md

#### Compress on the local machine

```sh
cdd
cd KnAllEdge/src
cp -r backend backend_archive
rm -r backend_archive/node_modules
rm -r backend_archive/modules/topiChat/node_modules
rm -r backend_archive/modules/topiChat-knalledge/node_modules
rm -r backend_archive/tools/node_modules

zip -r -X prod-backend-2016.07.07-1.zip backend_archive
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

// this is dangerous:
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

if not, continue straight here:

```
cd /var/www/knalledge/src/backend/
unzip prod-backend-2016.07.07-1.zip
rm -r config/ continuousServer.sh info.txt KnAllEdgeBackend.js models/ modules/ package.json tools/

mv backend_archive/* .
rm -r backend_archive/

chmod -R o+rx .
chmod -R g+wrx .

cp -r ../node_modules_backup/tC/* modules/topiChat
cp -r ../node_modules_backup/tCK/* modules/topiChat-knalledge
cp -r ../node_modules_backup/tools/* tools


su
status knalledge-b

stop knalledge-b
nodejs KnAllEdgeBackend.js 8888
start knalledge-b

status knalledge-b
restart knalledge-b
exit
```

### Production deployment
There are two groups of actions to be done. First on local machine, then on the server

#### Build system on the local machine:

```sh
cdd
cd KnAllEdge/src/frontend
npm run build.prod
zip -r -X prod-frontend-2016.07.06-2.zip dist/prod
```

#### Upload on the server

Open the folder with zip file at your local machine:

```sh
open .
```
Start a SFTP client and upload the zip file to a production folder on server:
`/var/www/knalledge_frontend/prod`

Login to the server and unpack CF system and configure it:

```sh
ssh mprinc@knalledge.org
cd /var/www/knalledge_frontend/prod
rm -rf components/ css/ data/ dist/ fonts/ images/ js/ sass/
unzip prod-frontend-2016.07.06-2.zip
mv dist/prod/* .
rm -r dist/

chmod -R o+rx .
chmod -R g+wrx .

cd /var/www/knalledge_frontend

# replace
# `env=envs.localhost` -> `env=envs.server`
sed -i 's/env\s*\=\s*envs\.localhost/env\=envs\.server/g' prod/js/shims_bundle.js
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

Upload all the 'font files' (MaterialIcons-Regular...) from the folder `src/frontend/node_modules/ng2-material/font` to the
`/var/www/knalledge_frontend/prod/css/`

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
zip -r -X prod-frontend-2016.07.06-2.zip dist/prod
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
unzip prod-frontend-2016.07.06-2.zip
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

## Host prod build on local server

First be sure you have instaled [local web server](https://www.npmjs.com/package/http-server):
```sh
sudo npm install http-server -g
```

build production:
```sh
cdd
cd EarthCube/McMap/src/frontend
npm run build.prod
```

run local server and open it:
```sh
cd dist/prod
http-server
```

Navigate to [the localhost](http://localhost:8080/)
