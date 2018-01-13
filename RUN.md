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
**<u>*NOTE*</u>**: After restarting the DB server, you need to **restart** all services listening to it

#### frontend

it is running through apache, so it should be fine but you can always play with it



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

# Server troubleshooting

TODO: add some non-Database page responding with HELO to se if server is alive

## PROBLEM - all servers are unavailable

if none of colabo.space websites are not available this is the reason

### proxy

- info
  - the main proxy that dispatches HTTP connections (port 80) either to Apache or other (mostly node.js) deamons
  - it is necessary to make it possible to have multiple deamons listening at the same port 80 (only guaranteed behind a firewall), but different (sub)domains

#### SOLUTION

```sh
sudo status knalledge-fork
sudo start knalledge-fork
```

### Apache

You can restart the apache server if the above doesn't resolve access to the servers

```sh
sudo apache2ctl restart
sudo apache2ctl status
```





## PROBLEM - map is not visible

if CF is not showing the map try to check if server is working

TEST: open http://api.colabo.space/whatAmIs/all.json and see if it is showing and how it is responding

### SOLUTION

**<u>NOTE</u>**: currently the backend has to be started **after** the DB is up and running

```sh
sudo restart knalledge-b-beta
sudo restart knalledge-b
```

Starting manually (from the `/etc/init/knalledge-b.conf`):

```sh
sudo -u www-data /usr/bin/nodejs /var/www/knalledge/src/backend/prod/KnAllEdgeBackend.js 8001 8002
```

### PROBLEM - DB is not responding

```sh
# Test
sudo ps -ax | grep mongo
# Kill
sudo kill -TERM <mongo_pid>
# manual start in the background
# not the best way
# but that is how it is working now since service is crashing
sudo mongod --fork --config /etc/mongod.conf
```