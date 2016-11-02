import {NgForm} from '@angular/forms';
import { Component, Inject, ViewChild, OnInit} from '@angular/core';
import {Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

//declare var knalledge;
declare var window;

export interface ITabData {
    title: string;
}

@Component({
    selector: 'coevoludens-trendspyramid',
    moduleId: module.id,
    templateUrl: 'partials/trendspyramid.component.tpl.html',
    providers: [
    // MATERIAL_PROVIDERS,
    //    BrainstormingService
    ],
})
export class TrendspyramidComponent implements OnInit{
    public brainstormingFormActive = true;
    //model = new knalledge.KMap();
    setUpBroadcastingRequest: string = "setUpBroadcastingRequest";
    public readyForNewPhase: boolean = true;

    @ViewChild(MdDialog) private mdDialog: MdDialog;

    private tabData: ITabData[] = [
        {
            title: "",
        },
        {
            title: ""
        },
        {
            title: ""
        },
        {
            title: ""
        },
        {
            title: ""
        }
    ];

    constructor(
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
        ) {
        this.globalEmitterServicesArray.register(this.setUpBroadcastingRequest);
        this.globalEmitterServicesArray.get(this.setUpBroadcastingRequest).subscribe('TrendspyramidComponent', this.show.bind(this));
        //window.alert("[TrendspyramidComponent] " + this.brainstormingService.test);
    }

    ngOnInit() {
    }

    getTitle(tabIndex: number): string {
        return this.tabData[tabIndex].title;
    }

    onSubmit(selectedIndex: number) {
        console.log('[onSubmit]');
        this.changePhase(selectedIndex + 1);
        this.mdDialog.close();
        this.readyForNewPhase = true;
    }

    public changePhase(phase) {
    }


    get diagnostic() { return 0;}

    // get debugging(){
    //   return
    // }

    show() {
      console.log("[TrendspyramidComponent].show");
      this.brainstormingFormActive = false;
      setTimeout(() => this.brainstormingFormActive = true, 2);
    }

    showStartFinish(selectedIndex): boolean {
      return true;
    }

    restart(): void {
        if (confirm('Are you sure?')) {
            // this.model.nextPhase();
            // this.readyForNewPhase = false;
            this.readyForNewPhase = true;
            //this.close(false);
            this.show();
        }
    }

    selectedIndex(): number {
        return 0;
    }

    isDisabled(selectedIndex: number): boolean {
      return true;
    }

    // nextPhase(){
    //   this.model.nextPhase();
    // }

    focusChanged(tabIndex) {
        console.log("focusChanged", tabIndex);
        //this._selectedIndex = tabIndex;
        //this.tabData[tabIndex].newItems = 0;
    }

    selectedChanged(event) {
        console.log("selectedChanged", event);
        //this._selectedIndex = event;
    }

    finishBrainstorming(){
      this.mdDialog.close();
    }

    testOntovFilter(){
    }

    close(confirm: boolean = false) {
        console.log("[TrendspyramidComponent].close:", confirm);
        this.mdDialog.close();
        if(!confirm){
        }
    }

    private brainstormingSent(result: boolean, error?: any): void {
        console.log("[brainstormingSent]", result, error);
    }
}
