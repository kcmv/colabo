import { Component, OnInit } from '@angular/core';
import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/rima_aaa/userData';
import { KNode } from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private RimaAAAService: RimaAAAService
  ) {
  }

  ngOnInit() {
  }

  get isLoggedIn():Boolean{
    return this.RimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.RimaAAAService.getUser();
  }

  logOut(){
    this.RimaAAAService.logOut();
  }

}
