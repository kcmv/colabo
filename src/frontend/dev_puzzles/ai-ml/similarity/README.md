# @colabo-ai-ml/similarity

# Intro

Provides core support for AI and ML Services

# Installing

```sh
npm run build
npm link
```

***NOTE***: In your app you need to extend the `src/polyfills.ts` file, because of the [problem with the `socket.io-client` package](https://github.com/socketio/socket.io-client/issues/1166):

```ts
// https://github.com/socketio/socket.io-client/issues/1166
if(!(window as any).global) (window as any).global = window;
```
