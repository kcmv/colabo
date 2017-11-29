# Intro

knalledge_view_enginee is a Colabo puzzle that provides visualization of a knowledge inside the KnAllEdge system.

It is generic component in a sense it provides general support for visualizing knowledge, which should be supported with more speciffic visualization like knalledge_map, knalledge_list, ...)

# INSTALL

If you are integrating with angular CLI you should add in `.angular-cli.json`
- JS files
- CSS files

both of them are specified in `config.js` file. With our Colabo builder that is colabo-puzzle-friendly we do not need to do that

you need also to install local dependencies while package is local only: `yarn install`

# TODO

- do .bind() for all local functions that use this.
- fix the rest of $scope methods
- move inside the puzzle: knalledgeMapPolicyService.ts and knalledgeMapViewService.ts
- figure out how it will work without NG1+NG2 hybrid
- fine tune
  - see on which hooks what can be run
    - for example accessing db and backend and generating data can be done earlier, but accessing DOM elements should be done in ngAfterViewInit() or afterwards, etc
    - providing a reference for the
- when migration is finished
  - migrate from ng1 into ng2 directive
  - remove
    - directives/knalledgeMap.js
    - partials/knalledgeMap.tpl.html
- figure out about `interaction/mapInteraction.ts` is it at the right place or should be in `knalledge_view_interaction/code/interaction`
