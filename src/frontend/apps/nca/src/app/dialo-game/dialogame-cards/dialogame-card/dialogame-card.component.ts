import { Component, OnInit, Input, Output } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'dialogame-card',
  templateUrl: './dialogame-card.component.html',
  styleUrls: ['./dialogame-card.component.css']
})
export class DialogameCardComponent implements OnInit {
  @Input() cardData:KNode;

  userIconsPath:string = 'assets/images/user_icons/';

  constructor() { }

  ngOnInit() {
    console.log("cardData", this.cardData);
  }

  getUserName():string{
    return 'unknown user';
  }

  getIconImg():string{
    return 'performer.jpg';
  }

}
