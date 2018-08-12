# INSTALL

## Colabo packages

This packages come from the Colabo Ecosystem and from its [Colabo github repository](https://github.com/cha-os/knalledge).

You need to:

1. install it locally
2. export each of used packages as global npm packages (with `npm local` command)
3. import them in this project with:

```sh
npm link @colabo-knalledge/knalledge-storage-mongo
npm link @colabo-media/media-upload
npm link @colabo-rima/rima-connect
```

# Test

```sh
http://localhost:8001/kmaps/all.json
http://localhost:8001/knodes/one/default/59d3d92d73a8d7b33b00970b
http://localhost:8001/knodes/one/default/59d3b3f90d1f92de005c858e
```

# Changes

`node-inspector` is removed since it is making problems

```json
"devDependencies": {
  "node-inspector": "~1.1.1"
}
```

