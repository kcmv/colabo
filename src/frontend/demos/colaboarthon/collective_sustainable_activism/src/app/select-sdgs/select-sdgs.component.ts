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
  sdgs:KNode[] = [];
  constructor(
    private sDGsService: SDGsService
  ) { }

  ngOnInit() {
    this.sdgs = this.sDGsService.getSDGs();
    this.sDGsService.loadSDGs();
  }

}
