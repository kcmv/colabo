# Intro

knalledge_view_enginee is a Colabo puzzle that provides visualization of a knowledge inside the KnAllEdge system.

It is generic component in a sense it provides general support for visualizing knowledge, which should be supported with more speciffic visualization like knalledge_map, knalledge_list, ...)

# TODO

+ provide in peerDependencies or in dependencies references for:
  - d3
- do .bind() for all local functions that use this.
- fix the rest of $scope methods
- move inside the puzzle: knalledgeMapPolicyService.ts and knalledgeMapViewService.ts
- figure out how it will work without NG1+NG2 hybrid
  - for example, there will be NO NG1 system nor user services ($injector, RimaService, ...)
- go inside inner classes of knalledge.Map (MapLayout, ...) and check
  - what do they depend on from the NG1 world
  - what services that might not be availalbe they crash on
  - are there any NG1 service that we really need?
