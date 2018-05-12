import { Component, OnInit, Input } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';
import {GlobalEmitterServicesArray} from '@colabo-puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';

@Component({
  selector: 'prompts-presentation',
  templateUrl: './prompts-presentation.component.html',
  styleUrls: ['./prompts-presentation.component.css'],
  animations: [
    trigger('promptState', [
      state('invisible', style({
        backgroundColor: '#eee'
      })),
      state('visible',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1) rotateY(180deg) rotateZ(90deg)'
      })),
      transition('invisible => visible', animate('100ms ease-in')),
      transition('visible => invisible', animate('100ms ease-out'))
    ])
  ]
})
export class PromptsPresentationComponent implements OnInit {
  pictures = [
    {
      id: 1,
      title: 'A natural view',
      state: 'invisible',
      img: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/8V46UZCS0V.jpg'
    },
    {
      id: 2,
      title: 'Newspaper',
      state: 'invisible',
      img: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/LTLE4QGRVQ.jpg'
    },
    {
      id: 3,
      title: 'Favourite pizza',
      state: 'invisible',
      img: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/R926LU1YEA.jpg'
    },
    {
      id: 4,
      title: 'Abstract design',
      state: 'invisible',
      img: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/U9PP3KXXY2.jpg'
    },
    {
      id: 5,
      title: 'Tech',
      state: 'invisible',
      img: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/NO9CN3QYR3.jpg'
    },
    {
      id: 6,
      title: 'Nightlife',
      state: 'invisible',
      img: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/X1UK6NLGRU.jpg'
    },
  ];

  constructor(
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmitterServicesArray
  ) { }

  ngOnInit() {

  }

  // get groups():KNode[]{
  get prompts():KNode[]{
    // return this.usersProfilingService.groups;
    return [];
  }

  pictureToggleState(picture:any){
    picture.state = picture.state === 'visible' ? 'invisible' : 'visible';
  }
}
