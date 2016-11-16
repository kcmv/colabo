import {Component, Inject, Input, OnInit, OnChanges} from '@angular/core';
import {KnalledgeMapViewService} from '../knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';


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
    selector: 'rima-voting-form',
    providers: [
        //MATERIAL_PROVIDERS
    ],
    moduleId: module.id,
    templateUrl: 'partials/rima-voting-form.tpl.html',
    styles: [`
    `]
})
export class RimaVotingForm  implements OnInit /* , OnChanges */ {
    @Input() node: any;
    votes = {
      up: 0,
      down: 0,
      users: []
    };

    private mapStructure:any;
    private pluginInfo:any;

    private componentShown: boolean = true;
    private viewConfig: any;
    private policyConfig: any;
    private knalledgeNodeCreatorChanged: string = "knalledgeNodeCreatorChanged";

    constructor(
        @Inject('IbisTypesService') _IbisTypesService_,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService: KnalledgeMapViewService,
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('RimaService') private rimaService,
        // @Inject('WhoAmIService') private whoAmIService,
        @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
      var that:RimaVotingForm = this;

        this.viewConfig = knalledgeMapViewService.get().config;
        this.policyConfig = knalledgeMapPolicyService.get().config;


        // access to CF internals through plugin mechanism
        this.pluginInfo = {
          name: "puzzles.presentation",
          components: {

          },
          references: {
            map: {
              items: {
                mapStructure: {
                }
              },
              $resolved: false,
              callback: null,
              $promise: null
            }
          },
        };

        this.pluginInfo.references.map.callback = function() {
          that.pluginInfo.references.map.$resolved = true;
          that.mapStructure = that.pluginInfo.references.map.items.mapStructure;
        };

        this.collaboPluginsService.registerPlugin(this.pluginInfo);
    }

    ngOnInit() {
      this.getVotes();
        // this.selectedWhoAmI = this.rimaService.getActiveUser();
    }

    ngOnChanges(){
      this.getVotes();
    }

    getVotes():any{
      this.votes.users.length = 0;
      this.votes.up = 0;
      this.votes.down = 0;
      if (this.node && this.node.kNode &&
        this.node.kNode.dataContent &&
        this.node.kNode.dataContent.ibis &&
        this.node.kNode.dataContent.ibis.votes){
          for(let voterId in this.node.kNode.dataContent.ibis.votes){
            let vote = this.node.kNode.dataContent.ibis.votes[voterId];
            if(vote > 0){ this.votes.up += vote;
            }else{this.votes.down += vote;}

            this.votes.users.push({
              whoAmI: this.rimaService.getUserById(voterId),
              score: vote
            });
          }
      }
      return this.votes;
    }
}
