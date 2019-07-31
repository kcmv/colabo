import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {InsightsService} from '../insights.service';

export enum ParticipationType{
  SDGS = 1,
  WRITER = 2
}

@Component({
  selector: 'participant-profile',
  templateUrl: './participant-profile.component.html',
  styleUrls: ['./participant-profile.component.css']
})
export class ParticipantProfileComponent implements OnInit {
   private _participantData:KNode;

  @Input() displayOptions:any;
  @Input() set participantData(ud:KNode){
    this._participantData = ud;
    console.log('this._participantData:',this._participantData);
    if(this.displayOptions.type == ParticipationType.SDGS){
      this.getSDGSelections();
    }
  }

  get participantData():KNode{
    return this._participantData;
  }

  get participantOptions():any{
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
      
        if(sdgs[s].iAmId === this.participantData._id){
          this.selectedSDGs.push((sdgs[s].targetId as any));
        }
    }
    console.log('this.selectedSDGs',this.selectedSDGs);
  }
}
