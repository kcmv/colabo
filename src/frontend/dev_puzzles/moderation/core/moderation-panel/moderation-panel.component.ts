import { Component, OnInit } from '@angular/core';
import {ColaboFlowComponent} from '@colabo-colaboflow/core/lib/colabo-flow.component';
import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';

@Component({
  selector: 'app-moderation-panel',
  templateUrl: './moderation-panel.component.html',
  styleUrls: ['./moderation-panel.component.css']
})
export class ModerationPanelComponent implements OnInit {

  constructor(
    private rimaAAAService: RimaAAAService,
  ) { }

  ngOnInit() {
  }

  get isLoggedIn():Boolean{
    return this.rimaAAAService.getUser() !== null;
  }
}
