import { Component } from '@angular/core';

import {ColabowareRFIDService} from '@colabo-colaboware/colaboware_rfid/ColabowareRFIDService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // testing namespacing access,
  // as it will be in code written in JS

  constructor(colabowareRFIDService:ColabowareRFIDService){
    console.log('AppComponent:constructor');
  }
}
