import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription }     from 'rxjs/Subscription';

import {GlobalEmittersArrayService} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

import {CfPuzzlesKnalledgeListService} from './cf.puzzles.knalledge_list.service';

declare var knalledge;
declare var window;
declare var marked:Function;

@Component({
    selector: 'knalledge-list',
    moduleId: module.id,
    templateUrl: 'partials/knalledge-list.component.tpl.html',
    providers: [
      CfPuzzlesKnalledgeListService
    ],
})
export class KnalledgeListComponent implements OnInit, OnDestroy{
  public showOnlyBrainstorming: boolean = true;
  public itemContainer = {
    children: [
      {
        node: {
            kNode: {
              name: "Hello"
            }
        }
      },
      {
        node: {
            kNode: {
              name: "CF"
            }
        }
      }
    ]
  };
  // private paramsSub:Subscription;

    constructor(
      @Inject('GlobalEmittersArrayService') private globalEmitterServicesArray:GlobalEmittersArrayService,
      private service:CfPuzzlesKnalledgeListService
      // private route: ActivatedRoute
        ) {
          //console.log("[KnalledgeListComponent] created");

          // let selectedNodeChangedEventName = "selectedNodeChangedEvent";
          // this.globalEmitterServicesArray.register(selectedNodeChangedEventName);
        	// this.globalEmitterServicesArray.get(selectedNodeChangedEventName).subscribe(
          //  'SuggestionComponent', this.selectedNodeChanged.bind(this));
          //

					var modelLoadedEventName = "modelLoadedEvent";
					//console.log("result:" + JSON.stringify(result));
					this.globalEmitterServicesArray.register(modelLoadedEventName);
					this.globalEmitterServicesArray.get(modelLoadedEventName).subscribe('KnalledgeListComponent', this.updateChildren.bind(this));
    }

    ngOnInit() {
      // https://angular-2-training-book.rangle.io/handout/routing/routeparams.html

      // this.paramsSub = this.route.params.subscribe(params => {
      //   window.alert(params['id']);
      // });

      this.service.loadMapWithId('57e8cd10da65cbe16f8aab24');
    }

    ngOnDestroy() {
      // this.paramsSub.unsubscribe();
    }

    // show() {
    //   this.init();
    // }

    init(): void{
    }

    updateChildren(){
      this.itemContainer.children = [];
      var nodes = this.service.getNodes();
      for(var i=0; i<nodes.length; i++){
        this.itemContainer.children.push({node: nodes[i]});
      }
    }

    onBackClicked(){
      this.service.goBack();
      this.updateChildren();
    }

    onEnterItemClicked(item: any){
      console.log("[KnalledgeListComponent] item clicked:", item.node.kNode.name);
      this.service.selectNode(item.node);
        // this.enterItem.emit(item);
      this.updateChildren();
    }

    getProperty(item):String{
      var property = null;
      if(item && item.node && item.node.kNode && item.node.kNode.dataContent && item.node.kNode.dataContent.property){
        property = marked(item.node.kNode.dataContent.property);
      }
      return property;
    }

    getAuthor(item):String{
      return this.service.getAuthor(item.node);
    }

    getType(item):String{
      return this.service.getType(item.node);
    }
}
