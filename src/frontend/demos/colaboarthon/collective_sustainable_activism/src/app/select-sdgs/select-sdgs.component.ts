import { MatDialog } from '@angular/material';
import {Dialog2Btn} from '../util/dialog2Btn';

import { Component, OnInit } from '@angular/core';

import {SDGsService, SDG_SELECTION_NAME, SDG_SELECTION_TYPE, SDGS_TO_SELECT } from './sdgs.service'
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';

@Component({
  selector: 'app-select-sdgs',
  templateUrl: './select-sdgs.component.html',
  styleUrls: ['./select-sdgs.component.css']
})
export class SelectSdgsComponent implements OnInit {

  // mprinc: added to avoid AOT error
  sdgs:any[] = [];
  saved:boolean = false;

  selectedSDGs:string[] = [];
  constructor(
    private sDGsService: SDGsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    //TODO: add loading of user's sdgs selections (and setting up states of sdg-cards) - if the user has already selected them in a previous session
    //TODO: add deleting of old selections before submitting new ones () - if the user has already selected them in a previous session

    // this.sdgs = [{
    //   name: "sdg a"
    // }, {
    //   name: "sdg b"
    // },
    // {
    //   name: "sdg b"
    // }];
    //TODO: !! we should migrate to the App-persisten Service this server-loads. RIGHT NOW each time we open this component, it loads it:
    this.sDGsService.getSDGs().subscribe(this.sdgsReceived.bind(this));
      //.subscribe(sdgs => this.sdgs);
    //this.sdgs = this.sDGsService.getSDGs();
    //this.sDGsService.loadSDGs();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(Dialog2Btn, {
      width: '80%',
      disableClose: true,
      data: {title: 'Submitting ...', info: 'please wait ...', button1: 'Cancel', button2: 'OK'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  correctSelection():boolean{
    return this.selectedSDGs.length == SDGS_TO_SELECT;
  }

  getActionMessage():string{
    let msg:string='';

    if(this.selectedSDGs.length < SDGS_TO_SELECT){
        msg = 'You need to select ' + (SDGS_TO_SELECT - this.selectedSDGs.length) + ' more SDGs';
    } else if (this.selectedSDGs.length == SDGS_TO_SELECT) {
        msg = 'You have selected all SDGs. Please, submit now';
    } else {
        msg = 'You have selected ' + this.selectedSDGs.length + ' SDGs. You must select maximum of ' + SDGS_TO_SELECT;
    }
    return msg;
  }

  canSubmit():boolean{
      return !this.saved && this.correctSelection();
  }

  submit(){
    console.log('submit');
    this.sDGsService.saveSDGsSelection(this.selectedSDGs).subscribe(this.sdgsSaved.bind(this));
  }

  private sdgsSaved():void{
    console.log('SelectSdgsComponent::sdgsSaved');
    this.saved = true; //TODO: see if we want to keep this
    window.alert("Your selection is successfully saved");
  }

  private sdgsReceived(sdgsD:any[]):void{
    this.sdgs = sdgsD;
    // for (var sdg in this.sdgs) {
    // console.log(item); // 0,1,2
  }
    // console.log('sdgsReceived:', this.sdgs)

  onToggled(state: boolean, id:string) {
    console.log('SelectSdgsComponent::onToggled',state, id);
    if(state){
      this.selectedSDGs.push(id);
    }
    else{
      let index = this.selectedSDGs.indexOf(id);
      if (index !== -1) this.selectedSDGs.splice(index, 1);
    }
    console.log(this.selectedSDGs.toString());
  }

}
