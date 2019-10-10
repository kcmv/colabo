# Intro

This is the Talk Extension of the TopiChat service.

TopiChat is semantic and structured dialogue service.

Talk puzzle provides a real-time chating support with possibility of building a structural knowledge out of dialogue

To add it, you need first to initialize topiChat component:

```ts
// TopiChat
import {TopiChat} from '@colabo-topichat/b-core';
var topiChat = new TopiChat('Colabo.Space');
```

and then we can provide the talk plugin:

```ts
import {TopiChatTalk} from '@colabo-topichat/b-talk';
var topiChatTalk = new TopiChatTalk(topiChat);
```

the example can be seen in `colabo/src/backend/apps/colabo-space/index.ts`

# Export

```sh
# It will create globaly accessable npm package `@colabo-topichat/b-talk`
npm link
```

# Import

```sh
# Imports it in the local node_modules space of the hosting app
npm link @colabo-topichat/b-talk
```