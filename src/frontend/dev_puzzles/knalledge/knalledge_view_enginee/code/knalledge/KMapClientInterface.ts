declare var knalledge:any;
declare var window:Window;

/**
 * API Interface for the knalledge.Map object and sub objects
 * It is provided from the map hosting directive to knalledge.Map instance
 * mostly as a callback for "external world" actions required by the knalledge.Map instance
 * @interface kMapClientInterface
 * @memberof knalledge
 */
export class KMapClientInterface {
  private PRESENTER_CHANGED:string;

  constructor(
    private $routeParams,
    private $route,

    private GlobalEmitterServicesArray,
    private KnalledgeMapPolicyService,
    private KnalledgeMapVOsService,
    private KnAllEdgeSelectItemService,
    private RimaService,

    private knalledgeMap,

    private changeKnalledgePropertyEvent,
    private selectedNodeChangedEvent,
    private mapEntitySelectedEvent,
    private nodeMediaClickedEvent
  ){
    this.PRESENTER_CHANGED = "PRESENTER_CHANGED";
    this.GlobalEmitterServicesArray.register(this.PRESENTER_CHANGED);
  }

  /**
   * Propagates clicked node to parent directive and
   * broadcasts node's property (content)
   * @function nodeClicked
   * @name kMapClientInterface#nodeClicked
   * **TODO**: make nodeUnselected and nodeSelected (instead)
   * @param  {knalledge.VKNode} vkNode - clicked node
   * @param  {DOM} dom - dom of the clicked node
   */
  nodeClicked(vkNode, dom) {
    if (vkNode) this.nodeSelected(vkNode, dom);
    else this.nodeUnselected(vkNode, dom);
  };

  /**
   * Reacts to clicking media content inside the node
   * @function nodeMediaClicked
   * @name kMapClientInterface#nodeMediaClicked
   * @param  {knalledge.VKNode} vkNode - clicked node
   */
  nodeMediaClicked(vkNode) {
    if (vkNode) {
      this.GlobalEmitterServicesArray.get(this.nodeMediaClickedEvent).broadcast('knalledgeMap', vkNode);
    }
  }

  /**
   * Propagates selected node to parent directive and
   * broadcasts node's property (content)
   * @function nodeSelected
   * @name kMapClientInterface#nodeSelected
   * @param  {knalledge.VKNode} vkNode - clicked node
   * @param  {DOM} dom - dom of the clicked node
   * @param  {string} selectionSource - source of node selection (internal, external)
   */
  nodeSelected(vkNode, dom, selectionSource:string=null) {
    if (selectionSource === knalledge.Map.INTERNAL_SOURCE &&
      (!this.KnalledgeMapPolicyService || !this.KnalledgeMapPolicyService.mustFollowPresenter())) {
      if(this.KnalledgeMapPolicyService) this.KnalledgeMapPolicyService.provider.config.broadcasting.receiveNavigation = false;
    }

    var processNodeSelected = function() {
      // Referencing DOM nodes in Angular expressions is disallowed!
      dom = null;

      // here we call a parent directive listener interested
      // in clicking the node
      // This is mostly used in the case when top directive provides map data and listens for response from the this (this.knalledgeMap) directive
      this.nodeSelected({
        "vkNode": vkNode,
        "dom": dom
      });
      var property = undefined;
      var propertyType = undefined;

      // get property and broadcast it
      // at the moment `knalledgeMapList` directive listens for this event
      // and presents the property inside the editor
      if (vkNode) {
        if (this.$routeParams.node_id !== vkNode.kNode._id) {
          this.$routeParams.node_id = vkNode.kNode._id;
          this.$route.updateParams(this.$routeParams);
        }
        // http://www.historyrundown.com/did-galileo-really-say-and-yet-it-moves/
        if (vkNode.kNode.dataContent){
          property = vkNode.kNode.dataContent.property;
          propertyType = vkNode.kNode.dataContent.propertyType;
        }
        console.log("[kMapClientInterface::nodeClicked'] vkNode[%s](%s): property: %s", vkNode.id, vkNode.kNode._id, property);
      } else {
        console.log("[kMapClientInterface::nodeClicked'] node is not provided. property: %s", property);
      }

      var nodeContent = {
        node: vkNode,
        property: property,
        propertyType: propertyType
      };

      this.GlobalEmitterServicesArray.get(this.changeKnalledgePropertyEvent).broadcast('knalledgeMap', nodeContent);
      this.GlobalEmitterServicesArray.get(this.selectedNodeChangedEvent).broadcast('knalledgeMap', vkNode);
    }

    // scope.$apply (before)
    processNodeSelected();
  }

  /**
   * Propagates unselected node to parent directive and
   * broadcasts node's property (content)
   * @function nodeUnselected
   * @name kMapClientInterface#nodeUnselected
   * @param  {knalledge.VKNode} vkNode - clicked node
   * @param  {DOM} dom - dom of the clicked node
   */
  nodeUnselected(vkNode, dom, selectionSource:string=null) {
    var processNodeUnselected = function() {
      // Referencing DOM nodes in Angular expressions is disallowed!
      dom = null;

      // here we call a parent directive listener interested
      // in clicking the node
      // This is mostly used in the case when top directive provides map data and listens for response from the this (this.knalledgeMap) directive
      this.nodeSelected({
        "vkNode": null,
        "dom": dom
      });
      var property = "";

      // get property and broadcast it
      // at the moment `knalledgeMapList` directive listens for this event
      // and presents the property inside the editor
      var nodeContent = {
        node: null,
        property: undefined,
        propertyType: undefined
      };

      this.GlobalEmitterServicesArray.get(this.changeKnalledgePropertyEvent).broadcast('knalledgeMap', nodeContent);
    }

    // scope.$apply (before)
    processNodeUnselected();
  }

  searchNodeByName() {
    // scope.$apply (before)
    var labels = {
      itemName: "Node",
      itemNames: "Nodes"
    };

    var itemType = "vkNode";

    var selectionOfItemFinished = function(item) {
      var vkNode = item;
      if (itemType == 'kNode') {
        this.knalledgeMap.mapStructure.getVKNodeByKId(item._id);
      }
      this.knalledgeMap.nodeSelected(vkNode);
    };

    // var items = this.KnalledgeMapVOsService.getNodesList();
    var items = this.knalledgeMap.mapStructure.getNodesList();

    this.KnAllEdgeSelectItemService.openSelectItem(items, labels, selectionOfItemFinished, itemType);
  }

  toggleModerator() {
    // scope.$apply (before)
    if(this.KnalledgeMapPolicyService) this.KnalledgeMapPolicyService.provider.config.moderating.enabled = !this.KnalledgeMapPolicyService.provider.config.moderating.enabled;
    if (this.KnalledgeMapPolicyService && this.KnalledgeMapPolicyService.provider.config.moderating.enabled){
      if(window.confirm('Do you want to create a new session?')) {
        //TODO: this code is probably temporary, so even registration is put here:
        var SETUP_SESSION_REQUEST_EVENT = "SETUP_SESSION_REQUEST_EVENT";
        this.GlobalEmitterServicesArray.register(SETUP_SESSION_REQUEST_EVENT);
        this.GlobalEmitterServicesArray.get(SETUP_SESSION_REQUEST_EVENT).broadcast('KnalledgeMap');
      }
    }else{
      if(this.RimaService) this.RimaService.setActiveUser(this.RimaService.getWhoAmI());
    }
  }

  togglePresenter() {
    // scope.$apply (before)
    var rimaUserId = "unknown_iAm_ID";
    if(this.RimaService) rimaUserId = this.RimaService.getWhoAmIid();
    var broadcastingEnabled = true;
    if(this.KnalledgeMapPolicyService){
      broadcastingEnabled = !this.KnalledgeMapPolicyService.provider.config.broadcasting.enabled;
    }
    this.GlobalEmitterServicesArray.get(this.PRESENTER_CHANGED)
    .broadcast('KnalledgeMapMain', {'user': rimaUserId, 'value': broadcastingEnabled});
  }

  mapEntityClicked(mapEntity /*, mapEntityDom*/ ) {
    // scope.$apply (before)
    //var mapEntityClicked = mapEntity;
    this.GlobalEmitterServicesArray.get(this.mapEntitySelectedEvent).broadcast('knalledgeMap', mapEntity);
  }

  addImage(vkNode, callback) {
    // TODO: Broken, not translated into NG2, need to be rewritten later into a pure NG2
    // https://github.com/Cha-OS/KnAllEdge/issues/293
    // scope.$apply (before)

    /*
    if (vkNode) {
      console.log("Adding image");
      var directiveScope = $scope.$new(); // $new is not super necessary
      // create popup directive
      var directiveLink = $compile("<div knalledge-map-image-editing class='knalledge-map-image-editing'></div>");
      // link HTML containing the directive
      var directiveElement = directiveLink(directiveScope);

      $element.append(directiveElement);
      directiveScope.image =
        (('dataContent' in vkNode.kNode) && ('image' in vkNode.kNode.dataContent)) ?
        vkNode.kNode.dataContent.image : null;

      directiveScope.addedImage = function(image) {
        console.log("Adding image");
        if (!vkNode.kNode.dataContent) {
          vkNode.kNode.dataContent = {};
        }
        // http://localhost:8888/knodes/one/5526855ac4f4db29446bd183.json
        vkNode.kNode.dataContent.image = {
          url: image.url,
          width: image.width,
          height: image.height
        };
        var updated = function(kNodeFromServer) {
          console.log("[kMapClientInterface::addImage::addedImage::updated'] updateKNode: " + kNodeFromServer);
          if (callback) {
            callback(vkNode);
          }
          this.knalledgeMap.update(vkNode);
        };
        this.KnalledgeMapVOsService.updateNode(vkNode.kNode, knalledge.KNode.UPDATE_TYPE_IMAGE).$promise
          .then(updated);
      }.bind(this);

    }
    */
  }
}
