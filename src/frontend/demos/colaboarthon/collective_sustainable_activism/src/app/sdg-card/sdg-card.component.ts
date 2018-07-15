import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'sdg-card',
  templateUrl: './sdg-card.component.html',
  styleUrls: ['./sdg-card.component.css']
})
export class SdgCardComponent implements OnInit {

  @Input() sdg: KNode;
  
  constructor() { }

  ngOnInit() {
  }

}
