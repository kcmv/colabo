# Backend building procedures

You need to be located in the backend folder

```sh
cdd
cd KnAllEdge/src/backend
```

**NOTE**: for scripts to work, deploying folders (described with `$deploy_folder_sub` variable) on server must exist (`prod` and `beta`).

## Deploying to server

To build and push new zip

on **production** server run
```sh
./scripts/deploy-backend prod
```
after this, you will be informed that you have to execute the following commands on your own:
```
ssh mprinc@knalledge.org
su
restart knalledge-b
exit
exit
```

and on **beta** server run
```sh
./scripts/deploy-backend
```
after this, you will be informed that you have to execute the following commands on your own:
```
ssh mprinc@knalledge.org
su
restart knalledge-b-beta
exit
exit
```

## Pushing built production to server

To push built and zipped file

on **production** server run
```sh
./scripts/push-backend prod <ZIP-FILE-NAME>
```

and on **beta** server run
```sh
./scripts/push-backend beta <ZIP-FILE-NAME>
```

where  <ZIP-FILE-NAME> is the name of the zip file produced in build/deploy phase.
