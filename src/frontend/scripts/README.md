# Frontend building procedures

You need to be located in the frontend folder

```sh
cdd
cd KnAllEdge/src/frontend
```

**NOTE**: for scripts to work, deploying folders (described with `$deploy_folder_sub` variable) on server must exist (`prod` and `beta`).

## Deploying to server

To build and push new zip

on **production** server run
```sh
./scripts/deploy-frontend-prod
```

and on **beta** server run
```sh
./scripts/deploy-frontend-beta
```

## Pushing built production to server

To push built and zipped file

on **production** server run
```sh
./scripts/push-frontend-prod <ZIP-FILE-NAME>
```

and on **beta** server run
```sh
./scripts/push-frontend-beta <ZIP-FILE-NAME>
```

where  <ZIP-FILE-NAME> is the name of the zip file produced in build/deploy phase.
