# @colabo-flow/f-audit [frontend]

## Creation

```sh
pwd
# /Users/sasha/Documents/data/development/colabo.space/colabo/src/frontend

colabo puzzle-create -c colabo.config.js
CoLabo CLI tools
============
Environment Info:
	configFile:  /Users/sasha/Documents/data/development/colabo.space/colabo/src/frontend/colabo.config.js
	current script folder:  /Users/sasha/Documents/data/development/colabo.space/colabo/src/tools/dist
? Puzzle type: frontend
? Puzzle name: @colabo-flow/f-audit
? Puzzle path (folder): dev_puzzles/flow/audit
? Puzzle description: A frontend part of the ColaboFlow Audit support for the Colabo.Space ecosystem
? Puzzle version: 0.3.1
? Puzzle repository: https://github.com/Cha-OS/colabo
? Are you satisfied with your answers? Yes
Creating puzzle: 'dev_puzzles/flow/audit' in folder '/Users/sasha/Documents/data/development/colabo.space/colabo/src/frontend/dev_puzzles/flow/audit'
Templates folder: '/Users/sasha/Documents/data/development/colabo.space/colabo/src/tools/templates'
```

## Results

`colabo/src/frontend/dev_puzzles/flow/audit/package.json`:

```json
{
    "name": "@colabo-flow/f-audit",
    "version": "0.3.1",
    "description": "A frontend part of the ColaboFlow Audit support for the Colabo.Space ecosystem",
    "private": false,
    "publishConfig": {
        "access": "public"
    },
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "https://github.com/Cha-OS/colabo"
    },
    "scripts": {
        "build": "tsc"
    },
    "main": "dist/index.js",
    "module": "dist/index.js",
    "dependencies": {},
    "peerDependenciesLocal": {},
    "devDependencies": {}
}
```

# @colabo-flow/b-audit [backend]

## Creation


```sh
pwd
# /Users/sasha/Documents/data/development/colabo.space/colabo/src/backend

colabo puzzle-create -c colabo.config.js

CoLabo CLI tools
============
Environment Info:
	configFile:  /Users/sasha/Documents/data/development/colabo.space/colabo/src/backend/colabo.config.js
	current script folder:  /Users/sasha/Documents/data/development/colabo.space/colabo/src/tools/dist
? Puzzle type: backend
? Puzzle name: @colabo-flow/b-audit
? Puzzle path (folder): dev_puzzles/flow/audit
? Puzzle description: A backend part of the ColaboFlow Audit support for the Colabo.Space ecosystem
? Puzzle version: 0.3.1
? Puzzle repository: https://github.com/Cha-OS/colabo
? Are you satisfied with your answers? Yes
Creating puzzle: 'dev_puzzles/flow/audit' in folder '/Users/sasha/Documents/data/development/colabo.space/colabo/src/backend/dev_puzzles/flow/audit'
Templates folder: '/Users/sasha/Documents/data/development/colabo.space/colabo/src/tools/templates'
```

## Results

`colabo/src/backend/dev_puzzles/flow/audit/package.json`:

```json
{
    "name": "@colabo-flow/b-audit",
    "version": "0.3.1",
    "description": "A backend part of the ColaboFlow Audit support for the Colabo.Space ecosystem",
    "private": false,
    "publishConfig": {
        "access": "public"
    },
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "https://github.com/Cha-OS/colabo"
    },
    "scripts": {
        "build": "tsc"
    },
    "main": "dist/index.js",
    "module": "dist/index.js",
    "dependencies": {},
    "peerDependenciesLocal": {},
    "devDependencies": {}
}
```