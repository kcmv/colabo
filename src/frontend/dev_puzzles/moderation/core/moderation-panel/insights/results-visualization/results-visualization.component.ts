import { Component, OnInit } from '@angular/core';
import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {Observable} from 'rxjs';

@Component({
  selector: 'results-visualization',
  templateUrl: './results-visualization.component.html',
  styleUrls: ['./results-visualization.component.css']
})
export class ResultsVisualizationComponent implements OnInit {

  constructor(
    private rimaAAAService: RimaAAAService
  ) { }

  ngOnInit() {
  }

  get isLoggedIn():Boolean{
    return this.rimaAAAService.getUser() !== null;
  }

  // userImg():string{
  //   return 'assets/images/user_icons/performer.jpg';
  // }

  userName():string{
    return this.rimaAAAService.getUser() !== null ? this.rimaAAAService.getUser().name : 'not logged in';
  }

  public userAvatar():Observable<string>{
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }

}
