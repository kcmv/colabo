import { Component, OnInit } from '@angular/core';

import {SDGsService} from './sdgs.service'
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

const SDGS_TO_SELECT:number = 3;

@Component({
  selector: 'app-select-sdgs',
  templateUrl: './select-sdgs.component.html',
  styleUrls: ['./select-sdgs.component.css']
})
export class SelectSdgsComponent implements OnInit {

  // mprinc: added to avoid AOT error
  sdgs:any[] = [];

  selectedSDGs:string[] = [];
  constructor(
    private sDGsService: SDGsService
  ) { }

  ngOnInit() {
    this.sdgs = [{
      name: "sdg a"
    }, {
      name: "sdg b"
    },
    {
      name: "sdg b"
    }];
    //TODO: !! we should migrate to the App-persisten Service this server-loads. RIGHT NOW each time we open this component, it loads it:
    this.sDGsService.getSDGs().subscribe(this.sdgsReceived.bind(this));
      //.subscribe(sdgs => this.sdgs);
    //this.sdgs = this.sDGsService.getSDGs();
    //this.sDGsService.loadSDGs();
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

  submit(){
    console.log('submit');
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
