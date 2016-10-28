import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, Inject, ViewChild, OnInit} from '@angular/core';
import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {SessionService} from "./session.service";
import {Session, SessionPhaseNames, SessionPhase} from './session';

//declare var knalledge;
declare var window;

export interface ITabData {
    title: string;
}

@Component({
    selector: 'session-form',
    moduleId: module.id,
    templateUrl: 'partials/session-form.component.tpl.html',
    providers: [
    // MATERIAL_PROVIDERS,
    //    SessionService
    ],
    directives: [
        MATERIAL_DIRECTIVES
    ]
})
export class SessionFormComponent implements OnInit{
    public sessionFormActive = true;
    //model = new knalledge.KMap();
    SETUP_SESSION_REQUEST_EVENT: string = "SETUP_SESSION_REQUEST_EVENT";
    public model: Session = new Session();
    public readyForNewPhase: boolean = true;

    @ViewChild(MdDialog) private mdDialog: MdDialog;

    private tabData: ITabData[] = [
        {
            title: SessionPhaseNames.ACTIVE,
        },
        {
            title: SessionPhaseNames.PAUSED,
        },
        {
            title: SessionPhaseNames.FINISHED
        }
    ];

    constructor(
        private sessionService: SessionService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
        ) {
        this.globalEmitterServicesArray.register(this.SETUP_SESSION_REQUEST_EVENT);
        this.globalEmitterServicesArray.get(this.SETUP_SESSION_REQUEST_EVENT).subscribe('SessionFormComponent', this.show.bind(this));
        //window.alert("[SessionFormComponent] " + this.SessionService.test);
    }

    ngOnInit() {
      this.sessionService.init();
    }

    getTitle(tabIndex: number): string {
        return this.tabData[tabIndex].title;
    }

    onSubmit(selectedIndex: number) {
        console.log('[onSubmit]');
        this.changePhase(selectedIndex + 1);
        this.mdDialog.close();
        this.readyForNewPhase = true;
        this.sessionService.setUpSessionChange();
        this.sessionService.session.fill(this.model);
        this.sessionService.sendSession(this.sessionSent.bind(this));
    }

    public changePhase(phase) {
        this.model.phase = phase;
    }


    get diagnostic() { return JSON.stringify(this.model); }

    // get debugging(){
    //   return
    // }

    show() {
      this.model = Session.factory(this.sessionService.session);
      if(this.model.phase === SessionPhase.INACTIVE && window.localStorage && window.localStorage['session']){
        console.log("show:: window.localStorage['session']",window.localStorage['session']);
        if(window.confirm("Do you want to preload saved session?")){
          this.model = Session.factory(JSON.parse(window.localStorage['session']));
        }
      }

      this.mdDialog.show();
      this.sessionFormActive = false;
      setTimeout(() => this.sessionFormActive = true, 2);
      if (this.readyForNewPhase) {
          this.model.nextPhase();
          this.readyForNewPhase = false;
      }
    }

    showStartFinish(selectedIndex): boolean {
        return (selectedIndex+1) !== SessionPhase.FINISHED;
    }

    restart(): void {
        if (confirm('Are you sure?')) {
            this.sessionService.restart();
            // this.model.nextPhase();
            // this.readyForNewPhase = false;
            this.readyForNewPhase = true;
            //this.close(false);
            this.show();
        }
    }

    selectedIndex(): number {
        return Math.max(Math.min(this.tabData.length - 1, this.model.phase - 1), 0);
    }

    isDisabled(selectedIndex: number): boolean {
        return selectedIndex > this.model.phase;
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

    finishSession(){
      this.mdDialog.close();
      this.sessionService.finishSession();
    }

    close(confirm: boolean = false) {
        console.log("[SessionFormComponent].close:", confirm);
        this.mdDialog.close();
        if(!confirm){
          this.model.previousPhase();
          this.readyForNewPhase = true;
        }
    }

    private sessionSent(result: boolean, error?: any): void {
        console.log("[sessionSent]", result, error);
    }
}
