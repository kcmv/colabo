import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {ModerationService} from '../moderation.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'user-moderation',
  templateUrl: './user-moderation.component.html',
  styleUrls: ['./user-moderation.component.css']
})
export class UserModerationComponent implements OnInit {
  @Input() user:KNode;
  @Output() deleted = new EventEmitter<string>();

  constructor(
    private moderationService:ModerationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }


  deleteUser():void{
    if(window.confirm("Are you sure you want to delete user " + this.user.name + '?')){
      this.moderationService.deleteUser(this.user._id).subscribe(this.userDeleted.bind(this));
    }
  }

  userDeleted(success:boolean):void{
    console.log('userDeleted',success);
    this.deleted.emit(this.user._id);
    this.snackBar.open("User deleted", "", {duration: 2000});
  }

}
