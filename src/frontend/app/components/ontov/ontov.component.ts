import {Component, ViewEncapsulation, Inject, OnInit, OnDestroy} from '@angular/core';
// import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

import {OntovService, ISearchParam} from './ontov.service';

// VS is a visual search component
// http://documentcloud.github.io/visualsearch/
declare var VS;
declare var $;

/**
 * Directive that provides facet searching facility
 * Selector: `ontov`
 * @class OntovComponent
 * @memberof ontov
 * @constructor
*/

var componentDirectives = [
  // MATERIAL_DIRECTIVES
];

var componentProviders = [
  OntovService
];

@Component({
  selector: 'search-ontov',
  // encapsulation: ViewEncapsulation.None,
  // directives and providers are not explicitly provided but dynamically built and provided
  providers: componentProviders,
  // directives: componentDirectives,
  moduleId: module.id, // necessary for having relative paths for templateUrl
  templateUrl: 'partials/ontov.component.tpl.html'
})
export class OntovComponent implements OnInit {
  shown: boolean = true;
  visualSearch:any;
  operationType:number = 0.0;
  searchParam:ISearchParam;

  constructor(
    private ontovService:OntovService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
    ) {
      this.searchParam = this.ontovService.searchParam;

    var showSubComponentInOntovComponentEvent = "showSubComponentInOntovComponentEvent";
    this.globalEmitterServicesArray.register(showSubComponentInOntovComponentEvent);

    var hideOntovComponentEvent = "hideOntovComponentEvent";
    this.globalEmitterServicesArray.register(hideOntovComponentEvent);

    this.globalEmitterServicesArray.get(showSubComponentInOntovComponentEvent)
      .subscribe('knalledgeMap.OntovComponent',
      this.show.bind(this));

    this.globalEmitterServicesArray.get(hideOntovComponentEvent)
      .subscribe('knalledgeMap.OntovComponent',
      this.close.bind(this));
  }

  ngOnInit() {
    var that:OntovComponent = this;
    window.setTimeout(function() {
      that.vsInit();
    }, 3000);

  }

  ngOnDestroy() {

  }
  operationToggled() {
    this.searchParam.operationType = 1 - this.searchParam.operationType;
    this.ontovService.filterByFacets();
  }

  vsInit() {
    var that:OntovComponent = this;
    var container = $('.ontov_visual_search_new');
    this.visualSearch = VS.init({
      container: container,
      query: '',
      callbacks: {
        // callback after search is is finished by user
        search: function(searchString, searchCollection) {
          var searchCollectionArray = [];
          searchCollection.forEach(function(pill) {
            var category = pill.get("category");
            var value = pill.get("value");
            if (category === "text") {
            } else {
            }
            searchCollectionArray.push({
              category: category,
              value: value
            });
          });
          that.ontovService.updateSearchValuesFromComponent(searchCollectionArray);
          that.ontovService.filterByFacets();
        },
        facetMatches: function(callback) {
          // These are the facets that will be autocompleted in an empty input.
          var facets = that.ontovService.getFacets();
          callback(facets);
          // callback(pillNames);
        },
        valueMatches: function(facet, searchTerm, callback) {
          // These are the values that match specific categories, autocompleted
          // in a category's input field.  searchTerm can be used to filter the
          // list on the server-side, prior to providing a list to the widget
          var result = that.ontovService.getFacetMatches(facet, searchTerm);
          console.log("searchTerm: ", searchTerm, "result: ", result);
          callback(result);
        }
      } // end of callbacks
    }); // end of VS.init

    // TODO: find a better callback
    this.ontovService.registerSetSearchCallback(this.updateSearchValue.bind(this));
  }

  updateSearchValue(searchVal) {
    var searchStr;
    if(typeof searchVal !== 'string'){
      searchStr = this.ontovService.searchValObj2Str(searchVal);
    }else{
      searchStr = searchVal;
    }
    this.visualSearch.searchBox.value(searchStr);
  }

  show(path) {
    this.shown = true;
  }

  close() {
    this.shown = false;
  }
}
