import { Component, OnInit } from '@angular/core';

import {SDGsService} from './sdgs.service'
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'app-select-sdgs',
  templateUrl: './select-sdgs.component.html',
  styleUrls: ['./select-sdgs.component.css']
})
export class SelectSdgsComponent implements OnInit {

  // mprinc: added to avoid AOT error
  sdgs:any[] = [];

  selectedSDGs:any[] = [];
  constructor(
    private sDGsService: SDGsService
  ) { }

  ngOnInit() {
    //TODO: !! we should migrate to the App-persisten Service this server-loads. RIGHT NOW each time we open this component, it loads it:
    this.sDGsService.getSDGs().subscribe(this.sdgsReceived);
      //.subscribe(sdgs => this.sdgs);
    //this.sdgs = this.sDGsService.getSDGs();
    //this.sDGsService.loadSDGs();
  }

  private sdgsReceived(sdgsD:any[]):void{
    this.sdgs = sdgsD;
    console.log('sdgsReceived:', this.sdgs);
  }

  select(id:string):void{
      this.selectedSDGs.push(id);
  }

}
