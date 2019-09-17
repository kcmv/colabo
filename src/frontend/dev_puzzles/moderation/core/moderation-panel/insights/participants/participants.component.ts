import { HttpClient } from '@angular/common/http'; //for loading participants file
import { Observable } from 'rxjs';
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

   constructor(private http: HttpClient) {
  }

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
      'bio':true,
      "country":true
    }
  }

  ngOnInit() {
    this.getParticipants().subscribe(participants => {
        console.log('participants from file: ',participants);
        this._participants = participants;
    });

    // this.getParticipantsHardcoded();
    
  }

  private getParticipants(): Observable<any> {
    let filePath:string = './assets/colaboarthon_poets.json';
    console.log('getParticipants')
    return this.http.get(filePath);
    }

  private getParticipantsHardcoded():void{
    // this.insightsService.getSDGSelections(false).subscribe(this.sDGSelectionsReceived.bind(this));
    this._participants = [
      {
        'name': 'HARDCODED: Bob Holman',
        dataContent: {
          bio:"HARDCODED: Founder of the Bowery Poetry Club and the author of 17 poetry collections (print/audio/video), most recently The Cutouts (Matisse) (PeKaBoo Press) and Sing This One Back to Me (Coffee House Press), Bob Holman has taught at Princeton, Columbia, NYU, Bard, and The New School. He is the producer/director/host of various films, including \"The United States of Poetry,\" and \"On the Road with Bob Holman.\" His film, \"Language Matters with Bob Holman,\" winner of the Berkeley Film Festival's Documentary of the Year award, was produced by David Grubin and aired nationally on PBS. He is a co-founder of the Endangered Language Alliance, and recipient of the Chambra D’oc Award for language revitalization.",
          avatar: 'assets/images/avatars/user.avatar-5bebf6ddbc7b170b18a38384.jpg'
        },
        mapId: null,
        decorations: null
      },
      {
        'name': 'Ivanka Radmanovic',
        dataContent: {
          bio:'HARDCODED: Ivanka Radmanovic started her professional .....',
          avatar: 'assets/images/avatars/user.avatar-5bebf71cbc7b170b18a38388.jpg'
        },
        mapId: null,
        decorations: null
      }
    ]
  }

  // TODO: use a method for getting only this user SDGs
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
