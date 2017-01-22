# Creating map

+ name: <choose the one you want> CF-SandBox
+ map type: `CollaboArte/CollaboScience/CollaboBusiness`
+ root node type: `type_knowledge`
+ parent map ID: empty
+ map version: 1
+ authors: text with list of names of authors responsible for the map

# Links

+ [main](http://KnAllEdge.org/app/index-dev.html#/)
+ [maps](http://KnAllEdge.org/app/index-dev.html#/maps)
+ [a map](http://knalledge.org/app/index-dev.html#/map/id/5566f25867a6d01e65beddde)
+ Users
    + [login user - sasha](http://knalledge.org/app/index-dev.html#/login/iAmId/556760847125996dc1a4a241)
    + [login user - sinisha](http://knalledge.org/app/index-dev.html#/login/iAmId/556760847125996dc1a4a24f)
    + [logout user](http://knalledge.org/app/index-dev.html#/logout)
+ RIMA
    + [whoAmI](http://KnAllEdge.org/app/index-dev.html#/whoAmI)
    + [rima-insights](http://KnAllEdge.org/app/index-dev.html#/rima-insights)
    + [rima-insights-map](http://KnAllEdge.org/app/index-dev.html#/rima-insights-map)
    + [plugins](http://KnAllEdge.org/app/index-dev.html#/plugins)

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
