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

#### Port forking

(`/etc/init/knalledge-fork.conf`)

```sh
start/status/stop knalledge-fork
```

or in a testing mode:

```sh
exec sudo -u www-data /usr/bin/nodejs /var/www/web_fork/index.js
```

check port listening processes:
```sh
sudo netstat -tulpn | grep ':80'
sudo netstat -tulpn | grep ':8088'
```

[more info](http://www.cyberciti.biz/faq/what-process-has-open-linux-port/)

#### Database (MongoDB)

[official install](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

+ log: `/var/log/mongodb/*`
+ upstart config: `/etc/mongod.conf`
+ mongod config: `etc/init/mongod.conf `
+ data: ``
+ service: `/etc/init.d/mongod`

repair:

```sh
rm /data/db/mongod.lock
rm /var/lib/mongodb/mongod.lock
mongod --repair
```

relevant files:

/var/log/upstart/
/data/db/mongod.lock
/etc/init.d/.#mongod
/usr/bin/mongod
/var/lib/mongodb
/var/lib/mongodb/EarthCube.0
/var/log/mongodb

services:
```sh
chkconfig --list
runlevel
```

Upstart logs your service execution in a log file by the same name in `/var/log/upstart/your-service-name.log`. It should be helpful.

service
```sh
status mongodb
stop mongodb
start mongodb
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
