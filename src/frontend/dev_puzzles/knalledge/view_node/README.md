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

+ https://github.com/doxiaodong/ng2-simplemde
    + https://doxiaodong.github.io/ng2-simplemde/
+ Alternative
    + https://www.npmjs.com/package/@sarunint/angular-simplemde
    + https://github.com/sarunint/angular-simplemde
    + https://stackblitz.com/edit/angular-simplemde-sample?file=app%2Fapp.module.ts