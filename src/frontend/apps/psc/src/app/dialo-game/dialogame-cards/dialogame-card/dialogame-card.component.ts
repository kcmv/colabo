import { Component, OnInit, Input, Output } from '@angular/core';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';

@Component({
  selector: 'dialogame-card',
  templateUrl: './dialogame-card.component.html',
  styleUrls: ['./dialogame-card.component.css']
})
export class DialogameCardComponent implements OnInit {
  @Input() cardData:KNode;
  @Input() debugInfo:string='';
  //@Output()
  cardCreator:KNode;// = new KNode();

  userIconsPath:string = 'assets/images/user_icons/';

  constructor(
    private rimaAAAService: RimaAAAService
  ) { }

  ngOnInit() {
    console.log("cardData", this.cardData);
    if(this.cardData && 'iAmId' in this.cardData)
    {
      this.rimaAAAService.getUserById(this.cardData.iAmId).subscribe(this.userReceived.bind(this));
    }
  }

  userReceived(user:KNode):void{
    this.cardCreator = user;
    console.log(user, user.name);
  }

  getUserName():string{
    return this.cardCreator ? this.cardCreator.name : 'anonymous';
  }

  getIconImg():string{
    //TODO:
    return 'performer.jpg';
  }

}
