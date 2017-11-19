import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // testing namespacing access,
  // as it will be in code written in JS

  constructor(){
    console.log('AppComponent:constructor');
  }
}
