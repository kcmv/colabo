import { Component, OnInit } from '@angular/core';
import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
//import { OrderPipe } from 'ngx-order-pipe';
// import { Pipe, PipeTransform } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe'; //https://github.com/VadimDez/ngx-order-pipe
// const MAP_ID = "5b8a5260f8b8e40f3f250f9d"; //TEF
const MAP_ID = "5b49e7f736390f03580ac9a7"; //Forum Vlasina

@Component({
  selector: 'registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.css']
})
export class RegisteredUsersComponent implements OnInit {

  //users:KNode[];
  users:any[] = []; //[{name:'tes1'},{name:'tes2'},{name:'tes3'}];

  constructor(
    private rimaAAAService: RimaAAAService
  ) {
  }

  ngOnInit() {
    this.rimaAAAService.getRegisteredUsers(MAP_ID).subscribe(this.usersReceived.bind(this));
  }

  private usersReceived(users:any[]):void{
    //console.log('usersReceived', users);
    this.users = users;
  }

}
