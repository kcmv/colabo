import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {InsightsService} from '../insights.service';

@Component({
  selector: 'participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
   private _userData:KNode;

  @Input() set userData(ud:KNode){
    this._userData = ud;
    this.getSDGSelections();
  }

  get userData():KNode{
    return this._userData;
  }

  get userOptions():any{
    return {
      'bio':true
    }
  }

  selectedSDGs:KNode[] = [];
  constructor(
    private insightsService:InsightsService
  ) { }

  ngOnInit() {
    //console.log('ParticipantProfileComponent');
  }

  getSDGSelections():void{
    this.insightsService.getSDGSelections(false).subscribe(this.sDGSelectionsReceived.bind(this));
  }

  //TODO: use a method for getting only this user SDGs
  sDGSelectionsReceived(sdgs:KEdge[]):void{
    console.log('sDGSelectionsReceived',sdgs);

    for(var s:number = 0; s < sdgs.length; s++){
      
        if(sdgs[s].iAmId === this.userData._id){
          this.selectedSDGs.push((sdgs[s].targetId as any));
        }
    }
    console.log('this.selectedSDGs',this.selectedSDGs);
  }
}
