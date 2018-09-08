import { Component, OnInit, Input, Output } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'dialogame-card',
  templateUrl: './dialogame-card.component.html',
  styleUrls: ['./dialogame-card.component.css']
})
export class DialogameCardComponent implements OnInit {
  @Input() cardData:KNode;

  constructor() { }

  ngOnInit() {
    console.log("cardData", this.cardData);
  }

}
