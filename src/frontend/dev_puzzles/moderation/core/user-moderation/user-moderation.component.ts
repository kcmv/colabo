import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {ModerationService} from '../moderation.service';
@Component({
  selector: 'user-moderation',
  templateUrl: './user-moderation.component.html',
  styleUrls: ['./user-moderation.component.css']
})
export class UserModerationComponent implements OnInit {
  @Input() user:KNode;

  constructor(
    private moderationService:ModerationService
  ) { }

  ngOnInit() {
  }


  deleteUser():void{
    if(window.confirm("Are you sure you want to delete this user?")){
      this.moderationService.deleteUser(this.user._id).subscribe(this.userDeleted.bind(this));
    }
  }

  userDeleted(success:boolean):void{
    console.log('userDeleted',success);
  }

}
