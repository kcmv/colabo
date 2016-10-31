import {Component, Inject, OnInit, OnDestroy} from '@angular/core';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

import {CfPuzzlesCoevoludensServices} from './cf.puzzles.coevoludens.service'

@Component({
    selector: 'presentation-list',
    providers: [
    ],
    moduleId: module.id,
    templateUrl: 'partials/presentation-list.tpl.html',
    styles: [`
    `]
})
export class PresentationList implements OnInit, OnDestroy {
  public items:Array<any> = [];
  public commandsVisible:boolean = true;
  public selectedSlide; // :knalledge.VKNode
  private viewConfig:any;
  private policyConfig:any;
  private changeSelectedNodeEvent: string = "changeSelectedNodeEvent";
  private selectedNodeChangedEvent: string = "selectedNodeChangedEvent";

  constructor(
    private service:CfPuzzlesCoevoludensServices,
    @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
    @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ) {
      // this.items = this.service.getTypes();
      // this.selectedItem = this.service.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.changeSelectedNodeEvent);
      this.globalEmitterServicesArray.register(this.selectedNodeChangedEvent);
    	this.globalEmitterServicesArray.get(this.selectedNodeChangedEvent).subscribe(
       'cf.puzzles.presentation.PresentationList', this.selectPotentialSlide.bind(this));
  }

  ngOnInit() {
    this.service.enable();
  }

  ngOnDestroy() {
    this.service.disable();
  }

  selectedItem(){ // :knalledge.VKNode
    var selectedItem = this.service.getSelectedItem();
    return selectedItem;
  }

  isSelectedItemInSlides():boolean{
    var selectedItem = this.service.getSelectedItem();
    if(!selectedItem) return false;
    return this.service.isNodeInSlides(selectedItem);
  }

  getSlides(){
    return this.service.getSlides();
  }

  addSlide(){
    this.service.addSlide();
  }

  removeSlide(){
    this.service.removeSlide();
  }

  isFirst():boolean {
    if(!this.selectedSlide) return false;
    let slides = this.getSlides();
    if(slides.length <= 0) return false;
    return this.selectedSlide === this.getSlides()[0];
  }

  isLast ():boolean {
    if(!this.selectedSlide) return false;
    let slides = this.getSlides();
    if(slides.length <= 0) return false;
    return this.selectedSlide === slides[slides.length-1];
  }

  slideMoveUp (){
    this.service.slideMoveUp();
  }

  slideMoveDown (){
    this.service.slideMoveDown();
  }

  showPresentation(){
    this.service.showPresentation();
  }

  showPresentationFromCurrentSlide(){
    this.service.showPresentationFromCurrentSlide();
  }

  selectPotentialSlide (slide) {
    if(this.service.isNodeInSlides(slide)){
      this.selectSlide(slide, true);
    }
  }

  selectSlide (slide, dontBroadcastEvent?:boolean) {
    this.selectedSlide = slide;

    if(!dontBroadcastEvent) this.globalEmitterServicesArray.get(this.changeSelectedNodeEvent).broadcast('cf.puzzles.presentation.PresentationList', this.selectedSlide);
  }

  hideShowCommands(){
    this.commandsVisible = !this.commandsVisible;
  }
}
