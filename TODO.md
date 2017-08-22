# Packages problems
- ng2lint@0.0.10
  - https://www.npmjs.com/package/ng2lint
  - not compatible with tslint@5.6.0
  - i have disabled it in `KnAllEdge/src/frontend/tslint.json` until they update it
  - maybe codelyzer could replace
    - https://www.npmjs.com/package/codelyzer
    - https://stackoverflow.com/questions/39943403/how-to-use-codelyzer-in-angular-2#
    - https://github.com/mgechev/codelyzer
- checking availability of packages
  - https://registry.npmjs.org/ansi-styles/-/ansi-styles-2.2.0.tgz

- gulp-typescript
  gulp-typescript: ts(tsProject) has been deprecated - use .pipe(tsProject()) instead
    As of gulp-typescript 3.0, .pipe(ts(tsProject)) should be written as .pipe(tsProject()).
    More information: http://dev.ivogabe.com/gulp-typescript-3/

- Backend problematic packages
- Updating (partially) angular will produce error like `Error: Can't resolve all parameters for Storage: (?, ?)`
  - https://github.com/ionic-team/ionic-storage/issues/71
  - https://github.com/angular/angular-cli/issues/5007

```sh
npm WARN deprecated lingo@0.0.5: This project is abandoned
npm WARN deprecated mongodb@1.4.12: Please upgrade to 2.2.19 or higher
npm WARN deprecated ghooks@2.0.0: Use npmjs.com/husky instead, see https://github.com/gtramontina/ghooks/issues/166
```

- Frontend problematic packages

```sh
npm WARN deprecated es6-module-loader@0.17.11: This project has been deprecated for "npm install es-module-loader" based on the newer loader spec.

npm WARN deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue

npm WARN deprecated minimatch@0.2.14: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue

npm WARN deprecated graceful-fs@1.2.3: graceful-fs v3.0.0 and before will fail on node releases >= v7.0. Please update to graceful-fs@^4.0.0 as soon as possible. Use 'npm ls graceful-fs' to find it in the tree.

npm WARN deprecated gulp-tslint-stylish@1.1.1: Replaced by core tslint formatter

npm WARN deprecated ghooks@2.0.0: Use npmjs.com/husky instead, see https://github.com/gtramontina/ghooks/issues/166

npm WARN deprecated typings@2.1.1: Typings is deprecated in favor of NPM @types -- see README for more information

npm WARN deprecated babel@6.23.0: In 6.x, the babel package has been deprecated in favor of babel-cli. Check https://opencollective.com/babel to support the Babel maintainers

npm WARN deprecated express@2.5.11: express 2.x series is deprecated

npm WARN deprecated connect@1.9.2: connect 1.x series is deprecated

npm WARN deprecated minimatch@0.4.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue

npm WARN prefer global node-gyp@3.6.2 should be installed with -g
```

in addition compatibility issues:

```sh
npm WARN bootstrap@4.0.0-beta requires a peer of jquery@>=3.0.0 but none was installed.
npm WARN bootstrap@4.0.0-beta requires a peer of popper.js@^1.11.0 but none was installed.
npm WARN @ng-bootstrap/ng-bootstrap@1.0.0-beta.1 requires a peer of @angular/core@^4.0.3 but none was installed.
npm WARN @ng-bootstrap/ng-bootstrap@1.0.0-beta.1 requires a peer of @angular/common@^4.0.3 but none was installed.
npm WARN @ng-bootstrap/ng-bootstrap@1.0.0-beta.1 requires a peer of @angular/forms@^4.0.3 but none was installed.
npm WARN @angular/core@2.4.10 requires a peer of zone.js@^0.7.2 but none was installed.
npm WARN ng2lint@0.0.10 requires a peer of tslint@^3.5.0 but none was installed.
npm WARN ng2lint@0.0.10 requires a peer of typescript@~1.8.0 but none was installed.
```



# Critical developer packages for updating

- https://www.npmjs.com/package/typescript
- https://www.npmjs.com/package/ts-node
- https://www.npmjs.com/package/gulp-typescript
- https://www.npmjs.com/package/tslint
- https://www.npmjs.com/package/gulp-tslint
- https://www.npmjs.com/package/gulp-tslint-stylish
- https://www.npmjs.com/package/babel
- https://www.npmjs.com/package/ghooks
- https://www.npmjs.com/package/gulp
- https://www.npmjs.com/package/gulp-typedoc
- https://www.npmjs.com/package/gulp-uglify
- https://www.npmjs.com/package/gulp-util
- https://www.npmjs.com/package/traceur
- https://www.npmjs.com/package/typedoc
- https://www.npmjs.com/package/@types/core-js
- https://www.npmjs.com/package/@types/node
- https://www.npmjs.com/package/typescript-require

# RIMA

Sasa Rudan: gledam malo za ono map->rima
Sasa Rudan: nije naivno (smiley)
Sasa Rudan: mislim nije problem da se izvede
Sasa Rudan: ali je problem kako pristupiti problemu (smiley)
Sasa Rudan: KO je tu GLAVNI koji odlucuje, itd
Sasa Rudan: po meni je najlogicnije da RIMA ne radi nista (to mozemo i konfigurisati kao ponasanje) dok KnAlledge Map servis ne ucita mapu, i tada samo proslijedi listu usera koji nas interesuju RIMA servisu i tada ih on povuce
Sasa Rudan: mada za sada mislim da nemamo RIMA poziv ka serveru koji prima listu usera, mada nam to naravno treba

---

# MISC

+ export
  + to PDF
    + http://pdfkit.org/docs/images.html
    + https://parall.ax/products/jspdf
+ conflict
  if we both are presenters
+ editor
  + double-click => editing
  + support for text colors and formats
    + https://en.wikipedia.org/wiki/Lightweight_markup_language
    + https://en.wikipedia.org/wiki/Markdown#Markdown_Extra
    + https://en.wikipedia.org/wiki/Markdown#CommonMark
    + https://en.wikipedia.org/wiki/ReStructuredText
    + https://en.wikipedia.org/wiki/MultiMarkdown
    + https://en.wikipedia.org/wiki/Comparison_of_document_markup_languages
      +
+ properties
  + show node name
  + show node type
  + show node parent edge(s) type
  + make link
+ Structuring
  + move nodes hierarchy with mouse
  + on removing node with children offer options
    + add children to parent of removed node
    + let them hang in the air
    + ask to move them manually before removing
  + disable system nodes for editing, etc, so you cannot add to the presentations or presentation node manually
+ IBIS
  + [done] show number of voters
  + redesign interface (red should not be sum :) )
+ icon for properties of node doesn't have popup explanation
+ Presentation
  + add support for multiple presentations
  + extend/use to form linear textual book, article, ... i can use it for dissertation
  + make youtube support
  + make next/previous slide navigation buttons
  + make it impossible to add nodes to Presentation(s) nodes
  + make it impossible to add root node to presentations and create circular loops
  + problem with expanded content after presentation mode
    + in `<md-sidenav-layout _ngcontent-tfh-1="" class="main-content" flex="" layout="row" style="overflow: auto; height: 100%; display: block;">` the ` display: block;` is added and not removed after closing presentation mode
  + images
    + support resizing with standard image format (translate markdown into img tag on the fly?)
  + background support
+ Discussion (Oleg)
  + limitation on number of votes, etc
+ map
  + button to position to the currently selected node
+ Search
  + show context, paths to nodes (when there are duplicates, or not sure which one)
  + make popup to go over all CF components, not just map
  + searching through all nodes in all maps
+ Photos
  + make it easier to upload to flickr and extract url
  + support non-public flickr photos through url accessible only photos
+ Connectivity
  + System is showing offline icon when we are offline but at the same time connected to the local CF server and normally saving

Optimizing the Collective Mind
Self-organizing Collective Mind

  - we are component
  - technology
  - collective mind is possible to evolve

Academic Form
- this said this, this said that
- reflect to them and say
- we are doing this and this
- they (academics) feel comfortable
  -


- потресаюшча
  -

Poliscopy
- make information that serves society
- information is everything
- action is information
  - information is aspect
  - deffinition is abastract
- we have freedom of designing perspectives
- they are conventions
  - by definition/convention information is recorded experience
  - chair is not information but it is record of experience
    - it has encoded how to make it, how to sit on it
- poliscopy
- prototip
  - it is the main object of the science
  - same as experiment and theory is conventional object
  - we do not create a model but a prototype
  - in a real science
  - book is a prototype
    - of writing
    - it is a prototype of type of informaction
    - it is not real and objectiveness of world, but it affecting world through its information
- systemic epistemology
  - how
