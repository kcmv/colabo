import { Component, Inject, OnInit } from '@angular/core';

import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';


import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
		selector: 'rima-actions-form',
		providers: [
				//MATERIAL_PROVIDERS
		],
		moduleId: module.id,
		templateUrl: 'partials/rima-actions-form.tpl.html',
		styles: [`
		`]
})

export class RimaActionsForm implements OnInit {
  public kNodesTypes:Array<any> = [];

  public selectedWhoAmI: any;
  public searching: boolean = false;
  public searchFailed: boolean = false;
  public rimaUsersSearchBouded: Function;
  public editingUser:boolean = false;

  private componentShown:boolean = true;
  private viewConfig:any;
  private policyConfig:any;
  private knalledgeNodeCreatorChanged: string = "knalledgeNodeCreatorChanged";

  constructor(
    @Inject('IbisTypesService') _IbisTypesService_,
    @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
    @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,
    @Inject('RimaService') private rimaService
  ) {
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('RimaActionsForm', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
      this.rimaUsersSearchBouded = this.rimaUsersSearch.bind(this);
      this.globalEmitterServicesArray.register(this.knalledgeNodeCreatorChanged);
  }

  ngOnInit() {
    this.selectedWhoAmI = this.rimaService.getActiveUser();
  }

  rimaUsersSearch(text$: Observable<string>){
    var that = this;
    return text$
      // .debounceTime(300)
      .distinctUntilChanged()
      .do(() => that.searching = true)
      .switchMap(term => {
        let items:Array<any> = that.rimaService.whoAmIs;
        that.searchFailed = !!items;
        var results = items ? items : [];
        results = results.filter(v => new RegExp(term, 'gi').test(v.displayName)).slice(0, 10);
        return Observable.of(results);
      })
      .do(() => that.searching = false);
  }

  rimaUsersFormatter(rimaUser) {
    return rimaUser.displayName;
  }

  rimaUsersSelected(event:NgbTypeaheadSelectItemEvent){
    let whoAmI = event.item;
    this.selectedWhoAmI = whoAmI;
    this.editingUser = false;

    if(this.policyConfig.moderating.enabled){
      this.rimaService.setActiveUser(whoAmI);

      if(this.viewConfig.states.editingNode){
        this.globalEmitterServicesArray.get(this.knalledgeNodeCreatorChanged)
        .broadcast('RimaActionForm',{node:this.viewConfig.states.editingNode,creator:whoAmI._id});
      }
    }

  }
}
