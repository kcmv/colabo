# Intro

This is a TopiChat core puzzle of the backend part of the Colabo.Space ecosystem.

It provides a foundation for the TopiChat service. 

## Plugins

Plugins provides additional features on the top of the TopiChat.

Topichat supports various events that plugins can register to and send/receive events with messages.

Each message passes through this (the core) part of the system, before being dispatched to others interested plugins.

## Hooks

Hooks are similar to plugins, but working on lower level. TopiChat plugins are a layer higher than topichat core. They are topichat "applications" that are driving through topichat core protocol. 

On the other hand, hooks are not. Hooks are sitting at the same level as the topichat core, but they are extending it. Plugins can use topichat (core) features that are provided through hooks.

# Export

```sh
# It will create globaly accessable npm package `@colabo-topichat/b-core`
npm link
```

# Import

```sh
# Imports it in the local node_modules space of the hosting app
npm link @colabo-topichat/b-core
```