import { Component, OnInit } from '@angular/core';
import {ColaboFlowMComponent} from '@colabo-flow/f-core/lib/moderation/colabo-flow-m.component';
import {InsightsComponent} from './insights/insights.component';
import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-moderation-panel',
  templateUrl: './moderation-panel.component.html',
  styleUrls: ['./moderation-panel.component.css']
})
export class ModerationPanelComponent implements OnInit {

  constructor(
    private rimaAAAService: RimaAAAService
  ) { }

  ngOnInit() {
  }

  get isLoggedIn():Boolean{
    return this.rimaAAAService.getUser() !== null;
  }

  get isModerator(){
    return this.rimaAAAService.isModerator();  
  }

  // userImg():string{
  //   return 'assets/images/user_icons/performer.jpg';
  // }

  userName():string{
    return this.rimaAAAService.userName();
  }

  public userAvatar():Observable<string>{
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }
}
