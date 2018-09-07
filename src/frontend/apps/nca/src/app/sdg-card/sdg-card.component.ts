import { Component, OnInit, EventEmitter, Input, Output  } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'sdg-card',
  templateUrl: './sdg-card.component.html',
  styleUrls: ['./sdg-card.component.css']
})
export class SdgCardComponent implements OnInit {

  @Output() toggled = new EventEmitter<boolean>();
  @Input() sdg: KNode;
  selected:boolean = false;
  sdgImagesPath:string = 'assets/images/sdgs/s/';

  constructor() { }

  ngOnInit() {
    //console.log('SdgCardComponent');
  }

  getState():boolean{
    // console.log('getState:',this.selected);
    return this.selected;
  }

  onToggling():void{
    this.selected = !this.selected;
    console.log('onToggling:',this.selected);

    //TODO inform parent component:
    this.toggled.emit(this.selected);
  }

}
