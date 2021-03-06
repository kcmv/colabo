import { Component, OnInit } from '@angular/core';

import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {

  constructor(
    private RimaAAAService: RimaAAAService
  ) { }

  get isLoggedIn(): Boolean {
    return this.RimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.RimaAAAService.getUser();
  }

  ngOnInit() {
  }

}
