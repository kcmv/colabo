# Info

This is a ColaboFlow service puzzle of the backend part of the Colabo.Space ecosystem.

It provides access to local or remote Colabo.Space services (workers)from other Colabo.Space or independant code.

# Config

Config file is a JS file through `@colabo-utils/b-config` puzzle.

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