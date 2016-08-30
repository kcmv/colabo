import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, Inject, ViewChild, OnInit} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
//import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs';
import {CfPuzzlesPresentationServices} from "./cf.puzzles.presentation.service";

//declare var knalledge;
declare var window;

@Component({
    selector: 'presentation-show',
    moduleId: module.id,
    templateUrl: 'partials/presentation-show.tpl.html',
    providers: [
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        MD_TABS_DIRECTIVES
    ]
})
export class PresentationShow implements OnInit{

    @ViewChild(MdDialog) private mdDialog: MdDialog;

    constructor(
        private service: CfPuzzlesPresentationServices
        ) {
    }

    ngOnInit() {
    }

    getTitle(tabIndex: number): string {
        return "";
    }

    onSubmit(selectedIndex: number) {
        console.log('[onSubmit]');
        this.mdDialog.close();
        // this.service.previousPhase = this.service.brainstorming.phase;
    }

    show() {
      console.log("[PresentationShow].show");
      this.mdDialog.show();
    }

    showStartFinish(selectedIndex): boolean {
        return false;
    }

    restart(): void {
        if (confirm('Are you sure?')) {
            this.service.restart();
            this.show();
        }
    }

    selectedIndex(): number {
        return 0;
    }

    selectedChanged(event) {
        console.log("selectedChanged", event);
        //this._selectedIndex = event;
    }

    finish(){
      this.mdDialog.close();
      this.service.finish();
    }

    close(confirm: boolean = false) {
        console.log("[PresentationShow].close:", confirm);
        this.mdDialog.close();
        if(!confirm){
        }
    }
}
