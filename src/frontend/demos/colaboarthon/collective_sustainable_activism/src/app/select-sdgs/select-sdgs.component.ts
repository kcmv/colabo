import { Component, OnInit } from '@angular/core';

import {SDGsService} from './sdgs.service'

@Component({
  selector: 'app-select-sdgs',
  templateUrl: './select-sdgs.component.html',
  styleUrls: ['./select-sdgs.component.css']
})
export class SelectSdgsComponent implements OnInit {

  constructor(
    private sDGsService: SDGsService
  ) { }

  ngOnInit() {
    this.sDGsService.getSDGs();
  }

}
