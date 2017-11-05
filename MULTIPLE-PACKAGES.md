+ Lerna
  - https://lernajs.io/
  - babel
    - https://github.com/babel/babel/blob/master/lerna.json
    - https://github.com/babel/babel/tree/master/packages/babel-cli
    - https://www.npmjs.com/package/@babel/cli
+ bazel
  + `brew install bazel`
+ Angular examples
  + https://github.com/angular/angular/blob/0f5c70d563b6943623a5940036a52fe077ad3fac/docs/BAZEL.md
  + publishing packages
    - https://github.com/angular/angular/blob/0f5c70d563b6943623a5940036a52fe077ad3fac/scripts/ci/publish-build-artifacts.sh#L99
  + https://yarnpkg.com/en/
    - https://yarnpkg.com/lang/en/docs/migrating-from-npm/
    - https://scotch.io/tutorials/yarn-package-manager-an-improvement-over-npm
    - https://www.sitepoint.com/yarn-vs-npm/
    - https://code.facebook.com/posts/1840075619545360
    - Both NPM and Yarn have a lockfile, which ensures that dependencies only change when the lockfile changes. Users are strongly encouraged to use the locking mechanism in their package manager. References:
    - npm: https://docs.npmjs.com/files/package-lock.json
    - yarn: https://yarnpkg.com/lang/en/docs/yarn-lock/
+ scoped npm packages
  + for example https://www.npmjs.com/package/angular2 moved to https://www.npmjs.com/~angular
  + https://docs.npmjs.com/misc/scope
  + https://docs.npmjs.com/getting-started/scoped-packages
+ Mulitpile local modules linked together
  + [Setup multiple local modules with npm link + dedupe](https://github.com/npm/npm/issues/7742)
  + [Centralise node_modules in project with subproject](https://stackoverflow.com/questions/15225865/centralise-node-modules-in-project-with-subproject)
+ TypeScript
  + [How to create a TypeScript Nodejs module spanning multiple files](https://stackoverflow.com/questions/18909799/how-to-create-a-typescript-nodejs-module-spanning-multiple-files)
  + [How to Create and Publish an npm module in TypeScript](https://codeburst.io/https-chidume-nnamdi-com-npm-module-in-typescript-12b3b22f0724)
  + https://docs.npmjs.com/cli/link
  + https://docs.npmjs.com/cli/dedupe
+ monorepo
  + [Advantages of monolithic version control](https://danluu.com/monorepo/)
  + [Scaling Mercurial at Facebook](https://code.facebook.com/posts/218678814984400/scaling-mercurial-at-facebook/)
  + [Atlasion - Bitbucket - Monorepos in Git](https://developer.atlassian.com/blog/2015/10/monorepos-in-git/)
  + [Why you should use a single repository for all your company’s projects](http://www.drmaciver.com/2016/10/why-you-should-use-a-single-repository-for-all-your-companys-projects/)
+ questions
  + [What's the best practice for putting multiple projects in a git repository?](https://stackoverflow.com/questions/14679614/whats-the-best-practice-for-putting-multiple-projects-in-a-git-repository)
  + [How to publish multiple NPM modules from a single node project?](https://stackoverflow.com/questions/30957131/how-to-publish-multiple-npm-modules-from-a-single-node-project)
  + [Why you should use a single repository for all your company’s projects](http://www.drmaciver.com/2016/10/why-you-should-use-a-single-repository-for-all-your-companys-projects/)
+ rollup.js
  + https://rollupjs.org/
  + Rollup is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application. It uses the new standardized format for code modules included in the ES6 revision of JavaScript, instead of previous idiosyncratic solutions such as CommonJS and AMD. ES6 modules let you freely and seamlessly combine the most useful individual functions from your favorite libraries. This will eventually be possible natively, but Rollup lets you do it today.

## To Explore
+ https://bazel.build/
  + Build and test software of any size, quickly and reliably
  + https://github.com/bazelbuild
  + https://github.com/bazelbuild/rules_nodejs
  + https://github.com/bazelbuild/rules_sass
  + https://github.com/bazelbuild/rules_docker
  + https://docs.bazel.build/versions/master/tutorial/java.html
  + https://github.com/angular/angular/blob/0f5c70d563b6943623a5940036a52fe077ad3fac/docs/BAZEL.md
+ BrowserStack
  + https://www.browserstack.com/automate
    + Selenium cloud testing on Desktop and Mobile Browsers
+ CircleCI
  + https://circleci.com/
  + Build Faster. Test More. Fail Less.
  + Automate the software development process using continuous integration and continuous delivery so you can focus on what matters—building great things—not waiting for great things to build.
+ https://saucelabs.com/
  - TESTING AT THE SPEED OF AWESOME.
  - Accelerate your software development and bring your great ideas to market faster with the world's largest automated testing cloud for web and mobile apps.
  - https://docs.travis-ci.com/user/sauce-connect/
+ Jenkins
  - https://circleci.com/migrate-jenkins-to-circleci/
  - https://jenkins.io/index.html
  - https://en.wikipedia.org/wiki/Jenkins_(software)
