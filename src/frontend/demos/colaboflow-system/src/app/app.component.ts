import { Component } from '@angular/core';
import {SDGsService} from './select-sdgs/sdgs.service';
import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';
import {CWCService} from './cwc/cwc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // testing namespacing access,
  // as it will be in code written in JS

  constructor(
    private sDGsService: SDGsService,
    private RimaAAAService: RimaAAAService,
    private cwcService: CWCService
  ){
    console.log('AppComponent:constructor');
  }

  ngOnInit() {
    //this.sDGsService.
  }
}
