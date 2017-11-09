import { Component, NgModule } from '@angular/core';

var moduleImports = [];

@NgModule({
  imports: moduleImports
})

@Component({
  selector: 'knalledge-view',
  templateUrl: './knalledgeView.component.tpl.html'
  // styleUrls: ['./app.component.css']
})

export class KnalledgeViewComponent {
  public title: string = 'FDB Knowledge Graph';

  constructor() {}

  getMapName():string{
    return "FDB"
  }

  get following(): string {
    return "";
  }

  userPanel(){
  }

  toggleOptionsFullscreen(){

  }
}
