# Intro

knalledge_view_enginee is a Colabo puzzle that provides visualization of a knowledge inside the KnAllEdge system.

It is generic component in a sense it provides general support for visualizing knowledge, which should be supported with more speciffic visualization like knalledge_map, knalledge_list, ...)

# TODO

- do .bind() for all local functions that use this.
- fix the rest of $scope methods
- move inside the puzzle: knalledgeMapPolicyService.ts and knalledgeMapViewService.ts
- figure out how it will work without NG1+NG2 hybrid
- go inside inner classes of knalledge.Map (MapLayout, ...) and check
  - what services that might not be availalbe they crash on
  - are there any NG1 service that we really need?
- fine tune
  - remove timeouts for initialization
  - se on which hooks what can be run
    - for example accessing db and backend and generating data can be done earlier, but accessing DOM elements should be done in ngAfterViewInit() or afterwards, etc
    - providin a reference for the
- when migration is finished
  - migrate from ng1 into ng2 directive
  - remove
    - directives/knalledgeMap.js
    - partials/knalledgeMap.tpl.html
