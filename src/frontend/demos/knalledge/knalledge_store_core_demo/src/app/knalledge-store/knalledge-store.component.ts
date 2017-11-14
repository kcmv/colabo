import { Component, OnInit } from '@angular/core';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';

@Component({
  selector: 'app-knalledge-store',
  templateUrl: './knalledge-store.component.html',
  styleUrls: ['./knalledge-store.component.css']
})
export class KnalledgeStoreComponent implements OnInit {

  constructor(private knalledgeEdgeService:KnalledgeEdgeService) { }

  ngOnInit() {
  }

}
