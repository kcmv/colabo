# Info

This is a ColaboFlow topiChat puzzle of the backend part of the Colabo.Space ecosystem.

It enables frontend Colabo.Space components to talk and coordinate services (workers) through topiChat plugin.

# Config

Config file is a JS file through `@colabo-utils/i-config` puzzle.

# Example

We have also provided a simple client of this class: `demo.ts`.

It helps you to understand how you can access local/remote Colabo.Space services from your own code (either part of Colabo.Space or independant).

# Export

```sh
# It will create globaly accessable npm package `@colabo-flow/b-services`
npm link
```

# Import

```sh
# Imports it in the local node_modules space of the hosting app
npm link @colabo-flow/b-services
```