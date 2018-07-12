import { Injectable, Inject } from '@angular/core';
import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

declare var knalledge;

export interface ISearchParam {
    searchArr:Array<any>;
    operationType:Number; // 1 - and, 0 - or
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
    @Inject('GlobalEmittersArrayService') private globalEmitterServicesArray: GlobalEmittersArrayService,
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

    this.registerFacet("4Me", {
      getFacetMatches: this._getFacetMatches_4Me.bind(this),
      doesMatch: this._doesMatch_4Me.bind(this)
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

    this.registerFacet("Voting", {
      getFacetMatches: this._getFacetMatches_Voting.bind(this),
      doesMatch: this._doesMatch_Voting.bind(this)
    });

    this.registerFacet("RimaWhoWhat", {
      getFacetMatches: this._getFacetMatches_RimaWhoWhat.bind(this),
      doesMatch: this._doesMatch_RimaWhoWhat.bind(this)
    });

    this.collaboPluginsService.provideApi("ontov", {
      name: "ontov",
      items: {
        setSearch: this.setSearch.bind(this),
        addSearchItem: this.addSearchItem.bind(this),
        removeSearchItem: this.removeSearchItem.bind(this),
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


/**
 * This method sets search facets for ontov. It completely replaces old facets
 * @param  {Array}     searchArr array of search parameters. Each param/facet is of the type
 * ```js
 * {
 *  category: 'iAmId',
 *  value: '556760847125996dc1a4a241'
 * }
 * ```
 */
  setSearch(searchArr:Array<any>){
    this.searchParam.searchArr = searchArr;
    this.filterByFacets(this.searchParam.searchArr);

    if(typeof this.setSearchCallback === 'function'){
      this.setSearchCallback(searchArr);
    }
  }

  /**
   * Returns search facets
   * @return {Array} Array of facets sets in ontov
   */
  getSearchArray(){
    return this.searchParam.searchArr;
  }

  /**
   * Adds search facet to the existing array of search facets
   * @param  {Object} searchItem it is of a form
   * ```js
   * {
   *  category: 'iAmId',
   *  value: '556760847125996dc1a4a241'
   * }
   * ```
   */
  addSearchItem(searchItem){
    this.searchParam.searchArr.push(searchItem);

    this.filterByFacets(this.searchParam.searchArr);

    if(typeof this.setSearchCallback === 'function'){
      this.setSearchCallback(this.searchParam.searchArr);
    }
  }

  /**
   * It removes provided searchItem
   * @param  {Object} searchItem It is of a form
   * ```js
   * {
   *  category: 'iAmId',
   *  value: '556760847125996dc1a4a241'
   * }
   * ```
   * If it is provided only category, it removes any facet that conforms to the category,
   * otherwise it matches both category and value
   */
  removeSearchItem(searchItem){
    for(var i=this.searchParam.searchArr.length-1; i>=0; i--){
      let lSearchItem = this.searchParam.searchArr[i];
      if((lSearchItem.category === searchItem.category) &&
      (!('value' in searchItem) || (lSearchItem.value === searchItem.value))){
        this.searchParam.searchArr.splice(i, 1);
      }
    }
    this.filterByFacets(this.searchParam.searchArr);

    if(typeof this.setSearchCallback === 'function'){
      this.setSearchCallback(this.searchParam.searchArr);
    }
  }


  /**
   * Sets operational mode of the ontov facet filtering
   * @param  {string} operationType 1 - and, 0 - or
   */
  setOperation(operationType:Number){
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

  getFacetMatches(facet: string, searchTerm: any) {
    if (facet in this.registeredFacets) {
      return this.registeredFacets[facet].getFacetMatches(searchTerm);
    } else {
      return ['<ERROR: UNKNOWN_FACET>'];
    }
  }

  doesFacetMatches(facet: string, searchTerm: any, vkNode) {
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

    var vkNode;
    // there are facet filters active
    if (searchCollectionArray.length > 0) {
      for (let id in nodesById) {
        vkNode = nodesById[id];
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
        vkNode = nodesById[id];
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

  /**
   * Name
   * Filteres and keeps nodes with specific name
   * {
   *   category: 'Name',
   *   value: 'hello'
   * }
   */

  _getFacetMatches_Name(searchTerm: any) {
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
  _doesMatch_Name(searchTerm: any, vkNode) {
    return vkNode.kNode.name === searchTerm;
  }

  /**
   * Type
   * Filteres and keeps nodes with specific type
   * {
   *   category: 'Type',
   *   value: 'type_ibis_question'
   * }
   */

  _getFacetMatches_Type(searchTerm: any) {
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
  _doesMatch_Type(searchTerm: any, vkNode) {
    return vkNode.kNode.type === searchTerm;
  }

  /**
   * 4Me
   * Filteres and keeps nodes with specific type
   * that have any content as a sub-child from some another author
   * {
   *   category: '4Me',
   *   value: 'type_ibis_question'
   * }
   *
   * In addition to all node types, value can be a special value: 'any'
   * Which keeps nodes of any type if they confirm with condition
   */

  _getFacetMatches_4Me(searchTerm: any) {
    var typeToName = {
      'type_knowledge': 'kn:KnAllEdge',
      'type_ibis_question': 'ibis:QUESTION',
      'type_ibis_idea': 'ibis:IDEA',
      'type_ibis_argument': 'ibis:ARGUMENT',
      'type_ibis_comment': 'ibis:COMMENT'
    };

    // get active user
    var iAmId = this.rimaService.getActiveUserId();
    if(!iAmId){
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }

    if (this.mapStructure) {
      var nodeNameObj = {};
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];

        // check if parent is created by active user
        var vkParents = this.mapStructure.getParentNodes(vkNode);
        if(vkParents.length <= 0) continue;
        var vkParent = vkParents[0];
        if(vkParent.kNode.iAmId !== iAmId) continue;
        if(vkNode.kNode.iAmId === iAmId) continue;

        // set type as available
        nodeNameObj[vkNode.kNode.type] = true;
      }
      var existing4Mes = [];
      for(var type in nodeNameObj){
        existing4Mes.push({
          label: typeToName[type],
          value: type
        });
      }
      if(existing4Mes.length <= 0){
        existing4Mes.push({
          label: 'There is nothing for you at the moment. Please check again!',
          value: null
        });
      }
      existing4Mes.push({
        label: 'Any',
        value: 'any'
      });
      return existing4Mes;
    } else {
      return [{
        label: 'SERVICE_UNVAILABLE. PLEASE TRY LATER.',
        value: null
      }];
    }

  }
  _doesMatch_4Me(searchTerm: any, vkNode) {
    // get active user
    var iAmId = this.rimaService.getActiveUserId();
    if(!iAmId){
      return true;
    }

    // check if parent is created by active user
    var vkParents = this.mapStructure.getParentNodes(vkNode);
    if(vkParents.length <= 0) return false;
    var vkParent = vkParents[0];
    if(vkParent.kNode.iAmId !== iAmId) return false;
    if(vkNode.kNode.iAmId === iAmId) return false;

    return searchTerm === 'any' ? true : vkNode.kNode.type === searchTerm;
  }

  /**
   * Who
   * Filteres and keeps nodes with specific author (displayName)
   * {
   *   category: 'Who',
   *   value: 'John'
   * }
   */
  _getFacetMatches_Who(searchTerm: any) {
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
  _doesMatch_Who(searchTerm: any, vkNode) {
    return vkNode.kNode.iAmId === searchTerm;
  }

  /**
   * Voting
   * Filteres and keeps nodes with specific values of votes
   * {
   *   category: 'Voting',
   *   value: '5'
   * }
   *
   * will keep only votes with total voting >= 5
   */
  _getFacetMatches_Voting(searchTerm: any) {
    if (this.mapStructure) {
      var votingObj = {};
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];
        var votes:number = 0;
        if(vkNode.kNode.dataContent && vkNode.kNode.dataContent.ibis && vkNode.kNode.dataContent.ibis.votes){
          for(let vI in vkNode.kNode.dataContent.ibis.votes){
            votes += vkNode.kNode.dataContent.ibis.votes[vI];
          }
        }
        votingObj[(""+votes)] = true;
      }
      var votings = [];
      for (let voting in votingObj) {
        let votingLabel = ">= " + voting;
        votings.push({
          label: votingLabel,
          value: voting
        });
      }
      // sort in descending order
      votings.sort(function(a, b){
        return parseInt(b.value)-parseInt(a.value);
      });
      return votings;
    } else {
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }
  }
  _doesMatch_Voting(searchTerm: any, vkNode) {
    let votes:number = 0;
    if(vkNode.kNode.dataContent && vkNode.kNode.dataContent.ibis && vkNode.kNode.dataContent.ibis.votes){
      for(let vI in vkNode.kNode.dataContent.ibis.votes){
        votes += vkNode.kNode.dataContent.ibis.votes[vI];
      }
    }
    return votes >= parseInt(searchTerm);
  }

  /**
   * iAmId
   * Filteres and keeps nodes with specific user ids
   * {
   *   category: 'iAmId',
   *   value: '556760847125996dc1a4a241'
   * }
   *
   * will keep only nodes with author id === `556760847125996dc1a4a241`
   */

    _getFacetMatches_iAmId(searchTerm: any) {
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
  _doesMatch_iAmId(searchTerm: any, vkNode) {
    return vkNode.kNode.iAmId === searchTerm;
  }

  /**
   * What
   * Filteres and keeps nodes with specific whats
   * {
   *   category: 'What',
   *   value: 'todo'
   * }
   *
   * will keep only nodes with whats === 'todo'
   */

  _getFacetMatches_What(searchTerm: any) {
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

  _doesMatch_What(searchTerm: any, vkNode) {
    if(vkNode.kNode.dataContent && vkNode.kNode.dataContent.rima && vkNode.kNode.dataContent.rima.whats){
      for(var what of vkNode.kNode.dataContent.rima.whats){
        if(what.name === searchTerm) return true;
      }
      return false;
    }else{
      return false;
    }
  }

  /**
   * Tree
   * Filteres and keeps nodes whose parent is a specified node
   * {
   *   category: 'Tree',
   *   value: 'hello'
   * }
   *
   * will keep only nodes parent that has name === 'hello'
   */

  _getFacetMatches_Tree(searchTerm: any) {
    return this._getFacetMatches_Name(searchTerm);
  }
  _doesMatch_Tree(searchTerm: any, vkNode) {
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

  /**
   * RimaWhoWhat
   * Filteres and keeps nodes with specific whats
   * {
   *   category: 'RimaWhoWhat',
   *   value: 'todo'
   * }
   *
   * will keep only nodes with whats === 'todo'
   */

  _getFacetMatches_RimaWhoWhat(searchTerm: any) {
    var whoAmIs = {};
    if (this.mapStructure) {
      for (let id in this.mapStructure.nodesById) {
        var vkNode = this.mapStructure.nodesById[id];
        if(!(vkNode.kNode.iAmId in whoAmIs)){
          var whoAmI = this.rimaService.getUserById(vkNode.kNode.iAmId);
          whoAmIs[vkNode.kNode.iAmId] = whoAmI;
        }
      }
      return Object.keys(['test', 'test2']);
    } else {
      return ['SERVICE_UNVAILABLE. PLEASE TRY LATER.'];
    }
  }

  _doesMatch_RimaWhoWhat(searchTerm: any, vkNode) {
    if(vkNode.kNode.dataContent && vkNode.kNode.dataContent.rima && vkNode.kNode.dataContent.rima.whats){
      for(var what of vkNode.kNode.dataContent.rima.whats){
        if(what.name === searchTerm) return true;
      }
      return false;
    }else{
      return false;
    }
  }
}
