import { Component, OnInit, Input } from '@angular/core';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';

@Component({
  selector: 'participant-profile',
  templateUrl: './participant-profile.component.html',
  styleUrls: ['./participant-profile.component.css']
})
export class ParticipantProfileComponent implements OnInit {
  @Input() userData: KNode;

  constructor() { }

  ngOnInit() {
    //console.log('ParticipantProfileComponent');
  }
}
