import { Component } from '@angular/core';
import {SDGsService} from './select-sdgs/sdgs.service';
import {RimaService} from './rima-register/rima.service';

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
    private rimaService: RimaService,
  ){
    console.log('AppComponent:constructor');
  }

  ngOnInit() {
    //this.sDGsService.
  }
}
