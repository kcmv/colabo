import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() userData: KNode;
  @Input() displayOptions: any;

  constructor() { }

  ngOnInit() {
    //console.log('UserCardComponent');
    console.log("UserCardComponent:: displayOptions", this.displayOptions);
  }

  public imgPath():string{
    return (this.userData && ('avatar' in this.userData.dataContent)) ? this.userData.dataContent.avatar : 'https://fv.colabo.space/assets/images/user_icons/performer.jpg';
  }

}
