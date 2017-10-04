# Creating map

+ name: <choose the one you want> CF-SandBox
+ map type: `CollaboArte/CollaboScience/CollaboBusiness`
+ root node type: `type_knowledge`
+ parent map ID: empty
+ map version: 1
+ authors: text with list of names of authors responsible for the map

# Links

+ [main](http://colabo.space/app/index-dev.html#/)
+ [maps](http://colabo.space/app/index-dev.html#/maps)
+ [a map](http://colabo.space/app/index-dev.html#/map/id/5566f25867a6d01e65beddde)
+ Users
    + [login user - sasha](http://colabo.space/app/index-dev.html#/login/iAmId/556760847125996dc1a4a241)
    + [login user - sinisha](http://colabo.space/app/index-dev.html#/login/iAmId/556760847125996dc1a4a24f)
    + [logout user](http://colabo.space/app/index-dev.html#/logout)
+ RIMA
    + [whoAmI](http://colabo.space/app/index-dev.html#/whoAmI)
    + [rima-insights](http://colabo.space/app/index-dev.html#/rima-insights)
    + [rima-insights-map](http://colabo.space/app/index-dev.html#/rima-insights-map)
    + [plugins](http://colabo.space/app/index-dev.html#/plugins)

## Windows

### Database (MongoDB)

Navigate to `c:/mongodb/bin/`in command prompt and start the server:

```sh
c:
cd c:\mongodb\bin\
mongod
```

### Server (Backend)

Naviagate to `KnAllEdge/src/backend` and start the server:

```sh
npm start
```


### Server (Frontend)

Naviagate to `KnAllEdge/src/frontend` and start the server:

```sh
npm start
```

### Linux server


#### Database (MongoDB)

service
```sh
status mongodb
stop mongodb
start mongodb
```
temporary:
```sh
mongod --fork --config /etc/mongod.conf
```
#### backend

(`/etc/init/knalledge-b-beta.conf` or `/etc/init/knalledge-b.conf`)

```sh
start/status/stop knalledge-b-beta
```

or

```sh
start/status/stop knalledge-b
```

# Server troubleshooting

+ TODO: add some non-Database page responding with HELO to se if server is alive
+ proxy
  - the main proxy that dispatches HTTP connections (port 80) either to Apache or other (mostly node.js) deamons
  - it is necessary to make it possible to have multiple deamons listening at the same port 80 (only guaranteed behind a firewall), but different (sub)domains
  - if none of colabo.space websites are not available this is the reason
  - `sudo status knalledge-fork`
  - `sudo start knalledge-fork`
+ if CF is not showing the map try to check if server is working
  - open `http://api.colabo.space/whatAmIs/all.json` and se if it is showing and how it is responding
  - it might be that
  - `sudo ps -ax | grep mongo`
    - `sudo kill -TERM <mongo_pid>`
    - `sudo mongod --fork --config /etc/mongod.conf`
  - `sudo restart knalledge-b-beta`
  - `sudo restart knalledge-b`
  - from `/etc/init/knalledge-b.conf`
    - `sudo -u www-data /usr/bin/nodejs /var/www/knalledge/src/backend/prod/KnAllEdgeBackend.js 8001 8002` /var/www/knalledge/src/backend/prod/KnAllEdgeBackend.js 8001 8002`
