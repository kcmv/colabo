import { Component, OnInit, Input } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

declare var window;

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
      state('visible', style({
        backgroundColor: '#eee'
      })),
      state('hide', style({
        backgroundColor: '#cfd8dc',
        transform: 'rotateY(90deg)'
      })),
      state('show', style({
        backgroundColor: '#cfd8dc',
        transform: 'rotateY(360deg)'
      })),
      transition('visible => hide', animate('1000ms ease-in')),
      transition('hide => show', animate('1000ms ease-out'))
    ])
  ]
})
export class PromptsPresentationComponent implements OnInit {
  prompts = [
    {
      id: 1,
      title: 'PROPOSTA 1',
      contact: '+39 33 999 57 57 5',
      message: 'REP  1  tuo_verso',
      state: 'visible',
      img: 'http://colabo.space/colaboarthon/FIPM/prompt-1.png',
      text: {
        it: `i nostri occhi
sono terribilmente enormi
perché ...`,
        eng: `Our eyes
are frightfully huge
because ...`
      }
    },
    {
      id: 2,
      title: 'PROPOSTA 2',
      contact: '+39 33 999 57 57 5',
      message: 'REP 2 tuo_verso',
      state: 'visible',
      img: 'http://colabo.space/colaboarthon/FIPM/prompt-2.png',
      text: {
        it: `Negli occhi dei migranti, persino. Ci guardano come immortali, perché ...`,
        eng: `I see Europe in immigrant’s eyes. They look at us, as immortals, because ...`
      }
    },
    {
      id: 3,
      title: 'PROPOSTA 3',
      contact: '+39 33 999 57 57 5',
      message: 'REP 3 tuo_verso',
      state: 'visible',
      img: 'http://colabo.space/colaboarthon/FIPM/prompt-3.png',
      text: {
        it: `Dove sei diretto?
Perché vergognarsi di morire sulla tua porta di casa? Perché ...`,
        eng: `Where are you headed?
Why so ashamed to die on your own doorstep? Because ...`
      }

    }
  ];
  selectedPromptId:number = 0;
  selectedPrompt = this.prompts[this.selectedPromptId];

  constructor(
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmitterServicesArray
  ) { }

  ngOnInit() {
    window.setTimeout(this.promptNext.bind(this), 7000);
  }

  promptToggleState(prompt:any){
    prompt.state = prompt.state === 'visible' ? 'invisible' : 'visible';
  }

  promptNext(prompt:any){
    this.selectedPrompt.state = 'hide';
  }

  promptAnimationFinished(event){
    if(this.selectedPrompt.state === 'hide'){
      // alert("promptAnimationFinished: this.selectedPrompt.state=" + this.selectedPrompt.state);
      // this.selectedPrompt.state = 'show';

      this.selectedPromptId = (this.selectedPromptId+1) % this.prompts.length;
      var oldPrompt = this.selectedPrompt;
      var nextPrompt = this.prompts[this.selectedPromptId];

      nextPrompt.state = 'show';
      this.selectedPrompt = nextPrompt;
      oldPrompt.state = 'show';

      window.setTimeout(this.promptNext.bind(this), 7000);
    }
  }
}
