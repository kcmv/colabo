import { Injectable, Inject } from '@angular/core';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

declare var knalledge;

export interface ISearchParam {
    searchArr:Array<any>;
    operationType:Number;
}

@Injectable()
export class OntovService {
  searchFacets = [];
  public mapUpdate: Function;
  public positionToDatum: Function;
  public searchParam:ISearchParam = {
    searchArr: [],
    operationType: 0
  };
  private ontovPluginInfo: any;
  private knAllEdgeRealTimeService: any;
  private registeredFacets: any = {};
  private mapStructure: any;
  private setSearchCallback:Function;

  /**
   * Service constructor
   * @constructor
   */
  constructor(
    @Inject('$injector') private $injector,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
    @Inject('RimaService') private rimaService,
    @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
    let that = this;

    // globalEmitterServicesArray.register(this.showSubComponentInBottomPanelEvent);

    // this.knAllEdgeRealTimeService = this.$injector.get('KnAllEdgeRealTimeService');
    // let requestPluginOptions: any = {
    //     name: "RequestService",
    //     events: {
    //     }
    // };
    // if (this.knAllEdgeRealTimeService) {
    //     requestPluginOptions.events[Event.BRAINSTORMING_CHANGED] = this.receivedBrainstormingChange.bind(this);
    //     this.knAllEdgeRealTimeService.registerPlugin(requestPluginOptions);
    // }

    //this.collaboPluginsService = this.$injector.get('CollaboPluginsService');
    this.ontovPluginInfo = {
      name: "brainstorming",
      components: {

      },
      references: {
        mapVOsService: {
          items: {
            nodesById: {},
            edgesById: {},
          },
          $resolved: false,
          callback: null,
          $promise: null
        },
        map: {
          items: {
            mapStructure: {
              nodesById: {},
              edgesById: {}
            }
          },
          $resolved: false,
          callback: null,
          $promise: null
        }
      },
      apis: {
        map: {
          items: {
            update: null,
            nodeSelected: null,
            positionToDatum: null
          },
          $resolved: false,
          callback: null,
          $promise: null
        }
      }
    };

    // this.ontovPluginInfo.references.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
    this.ontovPluginInfo.references.map.callback = function() {
      that.ontovPluginInfo.references.map.$resolved = true;
      that.mapStructure = that.ontovPluginInfo.references.map.items.mapStructure;
      // resolve(that.ontovPluginInfo.references.map);
      // reject('not allowed');
    };
    // });
    //
    // this.ontovPluginInfo.apis.map.$promise = $q(function(resolve, reject) { /*jshint unused:false*/
    this.ontovPluginInfo.apis.map.callback = function() {
      that.ontovPluginInfo.apis.map.$resolved = true;
      that.mapUpdate = that.ontovPluginInfo.apis.map.items.update;
      that.positionToDatum = that.ontovPluginInfo.apis.map.items.positionToDatum;
      // resolve(that.ontovPluginInfo.apis.map);
      // reject('not allowed');
    };
    // });
    //

    this.collaboPluginsService.registerPlugin(this.ontovPluginInfo);

    this.registerFacet("Name", {
      getFacetMatches: this._getFacetMatches_Name.bind(this),
      doesMatch: this._doesMatch_Name.bind(this)
    });

    this.registerFacet("Type", {
      getFacetMatches: this._getFacetMatches_Type.bind(this),
      doesMatch: this._doesMatch_Type.bind(this)
    });

    this.registerFacet("Who", {
      getFacetMatches: this._getFacetMatches_Who.bind(this),
      doesMatch: this._doesMatch_Who.bind(this)
    });

    this.registerFacet("iAmId", {
      getFacetMatches: this._getFacetMatches_iAmId.bind(this),
      doesMatch: this._doesMatch_iAmId.bind(this)
    });

    this.registerFacet("What", {
      getFacetMatches: this._getFacetMatches_What.bind(this),
      doesMatch: this._doesMatch_What.bind(this)
    });

    this.registerFacet("Tree", {
      getFacetMatches: this._getFacetMatches_Tree.bind(this),
      doesMatch: this._doesMatch_Tree.bind(this)
    });

    this.collaboPluginsService.provideApi("ontov", {
      name: "ontov",
      items: {
        setSearch: this.setSearch.bind(this),
        getSearchArray: this.getSearchArray.bind(this),
        setOperation: this.setOperation.bind(this)
      }
    });
  }

  registerSetSearchCallback(setSearchCallback:Function){
    this.setSearchCallback = setSearchCallback;
    if(this.searchParam.searchArr){
      this.setSearchCallback(this.searchParam.searchArr);
      this.filterByFacets(this.searchParam.searchArr);
    }
  }

  /* ontov API:start */
  setSearch(searchArr){
    this.searchParam.searchArr = searchArr;
    this.filterByFacets(this.searchParam.searchArr);

    if(typeof this.setSearchCallback === 'function'){
      this.setSearchCallback(searchArr);
    }
  }

  getSearchArray(){
    return this.searchParam.searchArr;
  }

  setOperation(operationType){
    this.searchParam.operationType = operationType;
    this.filterByFacets(this.searchParam.searchArr);
  }
  /* ontov API:end */

  updateSearchValuesFromComponent(searchArr:Array<any>){
    this.searchParam.searchArr = searchArr;
  }

  // TODO
  searchValStr2Obj(searchStr){

  }

  searchValObj2Str(searchArr):String{
    var searchStr = "";
    for(var i=0; i<searchArr.length; i++){
      var searchParam = searchArr[i];
      searchStr += " " + searchParam.category + ": \"" +
      searchParam.value + "\"";
    }
    return searchStr;
  }

  getFacets() {
    return this.searchFacets;
  }

  getFacetMatches(facet: string, searchTerm: string) {
    if (facet in this.registeredFacets) {
      return this.registeredFacets[facet].getFacetMatches(searchTerm);
    } else {
      return ['<ERROR: UNKNOWN_FACET>'];
    }
  }

  doesFacetMatches(facet: string, searchTerm: string, vkNode) {
    if (facet in this.registeredFacets) {
      return this.registeredFacets[facet].doesMatch(searchTerm, vkNode);
    } else {
      return false;
    }
  }

  getNodesById() {
    if (this.mapStructure) {
      return this.mapStructure.nodesById;
    }
  }

  // filters based on provided facet search criteria
  filterByFacets(searchCollectionArray?:any[]) {
    if(typeof searchCollectionArray === 'undefined'){
      searchCollectionArray = this.searchParam.searchArr;
    }

    var nodesById = this.getNodesById();

    // there are facet filters active
    if (searchCollectionArray.length > 0) {
      for (let id in nodesById) {
        var vkNode = nodesById[id];
        // 0 - or, 1 - and
        var visible =
          this.searchParam.operationType ? true : false;
        for (var sC of searchCollectionArray) {
          let doesMatch = this.doesFacetMatches(sC.category, sC.value, vkNode);
          visible =
            this.searchParam.operationType ?
              visible && doesMatch :
              visible || doesMatch;
          // }else{ // TODO FOR AND SCENARIO
          //   visible = false;
        }
        if (visible) {
          delete vkNode.visible;

          // making visible all ancestor nodes of a visible node
          var ancestorsHash = this.mapStructure
            .getAllAncestorsPaths(vkNode);
          for (var aI in ancestorsHash) {
            var ancestorVkNode = ancestorsHash[aI];
            delete ancestorVkNode.visible;
          }
        } else {
          vkNode.visible = false;
        }
      }
    } else {
      for (let id in nodesById) {
        var vkNode = nodesById[id];
        delete vkNode.visible;
      }
    }
    if(this.mapUpdate) this.mapUpdate(undefined, this.positionToDatum);
  }

  // Registers new factet (each facet like name, who, what, ... have to get registered)
  // that can be sed to search through and reduce knalledge space
  registerFacet(facet: string, options: any) {
    console.log("[ontov.OntovService] new facet is registered: ", facet);
    this.registeredFacets[facet] = options;
    this.searchFacets.push(facet);
  }

  _getFacetMatches_Name(searchTerm: string) {
    if (this.mapStructure) {
      var nodeNameObj = {};
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];
        nodeNameObj[vkNode.kNode.name] = true;
      }
      return Object.keys(nodeNameObj);
    } else {
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }
  }
  _doesMatch_Name(searchTerm: string, vkNode) {
    return vkNode.kNode.name === searchTerm;
  }

  _getFacetMatches_Type(searchTerm: string) {
    var typeToName = {
      'type_knowledge': 'kn:KnAllEdge',
      'type_ibis_question': 'ibis:QUESTION',
      'type_ibis_idea': 'ibis:IDEA',
      'type_ibis_argument': 'ibis:ARGUMENT',
      'type_ibis_comment': 'ibis:COMMENT'
    };

    if (this.mapStructure) {
      var nodeNameObj = {};
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];
        nodeNameObj[vkNode.kNode.type] = true;
      }
      var existingTypes = [];
      for(var type in nodeNameObj){
        existingTypes.push({
          label: typeToName[type],
          value: type
        });
      }
      return existingTypes;
    } else {
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }

  }
  _doesMatch_Type(searchTerm: string, vkNode) {
    return vkNode.kNode.type === searchTerm;
  }

  _getFacetMatches_Who(searchTerm: string) {
    if (this.mapStructure) {
      var iAmIdObj = {};
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];
        iAmIdObj[vkNode.kNode.iAmId] = true;
      }
      var whos = [];
      for (let iAmId in iAmIdObj) {
        var whoAmI = this.rimaService.getUserById(iAmId);
        var who = this.rimaService.getNameFromUser(whoAmI);
        if(!who) who = "[unknown]";
        whos.push({
          label: who,
          value: iAmId
        });
      }
      return whos;
    } else {
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }
  }
  _doesMatch_Who(searchTerm: string, vkNode) {
    return vkNode.kNode.iAmId === searchTerm;
  }

  _getFacetMatches_iAmId(searchTerm: string) {
    if (this.mapStructure) {
      var iAmIdObj = {};
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];
        iAmIdObj[vkNode.kNode.iAmId] = true;
      }
      return Object.keys(iAmIdObj);
    } else {
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }
  }
  _doesMatch_iAmId(searchTerm: string, vkNode) {
    return vkNode.kNode.iAmId === searchTerm;
  }

  _getFacetMatches_What(searchTerm: string) {
    if (this.mapStructure) {
      var whatObj = {};
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];
        if(vkNode.kNode.dataContent && vkNode.kNode.dataContent.rima && vkNode.kNode.dataContent.rima.whats){
          for(var what of vkNode.kNode.dataContent.rima.whats){
            whatObj[what.name] = true;
          }
        }
      }
      return Object.keys(whatObj);
    } else {
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }
  }
  _doesMatch_What(searchTerm: string, vkNode) {
    if(vkNode.kNode.dataContent && vkNode.kNode.dataContent.rima && vkNode.kNode.dataContent.rima.whats){
      for(var what of vkNode.kNode.dataContent.rima.whats){
        if(what.name === searchTerm) return true;
      }
      return false;
    }else{
      return false;
    }
  }

  _getFacetMatches_Tree(searchTerm: string) {
    return this._getFacetMatches_Name(searchTerm);
  }
  _doesMatch_Tree(searchTerm: string, vkNode) {
    // making visible all ancestor nodes of a visible node
    var isInSubtree = false;
    var ancestorsHash = this.mapStructure
      .getAllAncestorsPaths(vkNode);
    for (var aI in ancestorsHash) {
      var ancestorVkNode = ancestorsHash[aI];
      if(ancestorVkNode.kNode.name === searchTerm) isInSubtree = true;
    }

    return isInSubtree;
  }
};
