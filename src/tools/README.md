# Colabo Tools

These are the tools to manage the [Colabo.Space ecosystem](www.Colabo.Space) or other systems that follow Colabo principles of healthy development:

+ Code modularization
+ Separating modules into independent (as much as possible) components that are possible to install separatelly as npm packages

NOTE: Before installing Colabo.Space ecosystem you need to install Colabo tools as necessary for further installation phases. It is similar with other Colabo-enabled systems. 

# Install

Standard way of installing the tool is to run:

```
npm install -g @colabo/cli
```

After that the colabo tools are available simply by typing `colabo` in terminal.

# Running

***NOTE***: Very often colabo tools will be embedded in the build process of the project (for example, in the `scripts.prepare` property of the project's `package.json` file) and you do not need to deal with them manually.

```sh
# Show info of the colabo aspect of the backend part of the project
colabo ../backend/colabo.config.js puzzless-info

# Offer colabo puzzles to the local system
# (basically `npm link` for all puzles listed as offers in the `colabo.config.js`)
colabo colabo.config.js puzzless-offer

# Install inside the project all puzzles required for project
# (basically `npm link <npm_package_main_id>` for all puzles listed as dependencies in the `colabo.config.js`)
colabo puzzless-install
```

# Help

To see all available commands, you can run:

```sh
colabo --help
```

To see details on a speciffic commands (for example `puzzle-create`), you can run:

```sh
colabo puzzle-create --help
```

# Alternatives

Here we are exploring alternatives

## Yeoman

```sh
# install yo
npm install --global yo

# install a generator
npm install --global generator-webapp

# run it
yo webapp
```

+ [yeoman/yo](https://github.com/yeoman/yo)
+ [Yo Generator](https://yeoman.github.io/generator/)
+ [Generating code with Yeoman js](https://itnext.io/generating-code-with-yeoman-js-f13e0da87374)
+ [Yeoman Environment](https://yeoman.github.io/environment/)

```sh
npm install --save yeoman-environment
```

```js
var yeoman = require('yeoman-environment');
var env = yeoman.createEnv();

// The #lookup() method will search the user computer for installed generators.
// The search if done from the current working directory.
env.lookup(function () {
  env.run('webapp', {'skip-install': true}, function (err) {
    console.log('done');
  });
});
```

## Other

+ [Hygen](https://github.com/jondot/hygen)

# TODO

## Templating

+ Exclude files, folders, extensions