import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import {InsightsService} from '../insights.service';
import {ParticipationType} from '../participant-profile/participant-profile.component';

@Component({
  selector: 'participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  public displayOptions:any = {
    type: ParticipationType.WRITER
  }
   private _participants:any[] = []; //KNode

  // @Input() set userData(ud:KNode){
  //   this._userData = ud;
  //   this.getSDGSelections();
  // }

  // get userData():KNode{
  //   return this._userData;
  // }

  get participants():any[]{
    return this._participants;
  }
  get userOptions():any{
    return {
      'bio':true
    }
  }

  ngOnInit() {
    this.getParticipants();
  }

  private getParticipants():void{
    // this.insightsService.getSDGSelections(false).subscribe(this.sDGSelectionsReceived.bind(this));
    this._participants = [
      {
        'name': 'Bob Holman',
        dataContent: {
          bio:'Bob Holman created BAS .....',
          avatar: 'assets/images/avatars/user.avatar-5bebf6ddbc7b170b18a38384.jpg'
        },
        mapId: null,
        decorations: null
      },
      {
        'name': 'Ivanka Radmanovic',
        dataContent: {
          bio:'Ivanka Radmanovic started her professional .....',
          avatar: 'assets/images/avatars/user.avatar-5bebf71cbc7b170b18a38388.jpg'
        },
        mapId: null,
        decorations: null
      }
    ]
  }

  //TODO: use a method for getting only this user SDGs
  // sDGSelectionsReceived(sdgs:KEdge[]):void{
  //   console.log('sDGSelectionsReceived',sdgs);

  //   for(var s:number = 0; s < sdgs.length; s++){
      
  //       if(sdgs[s].iAmId === this.userData._id){
  //         this.selectedSDGs.push((sdgs[s].targetId as any));
  //       }
  //   }
  //   console.log('this.selectedSDGs',this.selectedSDGs);
  // }
}
