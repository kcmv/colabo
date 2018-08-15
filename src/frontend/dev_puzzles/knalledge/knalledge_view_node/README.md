# Intro

knalledge_view_node is a Colabo puzzle that provides visualization of a knowledge ***node content*** the KnAllEdge system.

# INSTALL

If you are integrating with angular CLI you should add in `.angular-cli.json`
- JS files
- CSS files

All of them are specified in `config.js` file. With our Colabo builder that is colabo-puzzle-friendly we do not need to do that

You also need to install puzzle's interal dependencies. This is necessary only while package is local only (not published on npm services and not installed through npm services): `yarn install`

# Problems

## SimpleMDE

CSS styles are not working with it.

So inside the `module.ts` the code 

```ts
// import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import 'simplemde/dist/simplemde.min.css';
```

is not injecting CSS, probably some tree-shaking, or ... not sure.

Therefore we did

```ts
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde/no-style'
```

and added css style in the `index.html`:

```html
<link href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css" rel="stylesheet">
```