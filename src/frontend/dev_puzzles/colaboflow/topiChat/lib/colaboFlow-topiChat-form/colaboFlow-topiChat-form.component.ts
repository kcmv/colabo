import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {ColaboFlowTopiChatService, ColaboFlowTopiChatEvents, TopiChatPackage, ColaboPubSubPlugin} from '../colaboFlow-topiChat.service';

@Component({
  selector: 'colaboFlow-topiChat-form',
  templateUrl: './colaboFlow-topiChat-form.component.html',
  styleUrls: ['./colaboFlow-topiChat-form.component.css']
})
export class ColaboFlowTopiChatForm implements OnInit {

  public messages = [
    {
      meta: {
        timestamp: "010101"
      },
      from: {
        name: "Саша"
      },
      content: {
        text: "Здраво, Колабо!"
      }
    },
    {
      meta: {
        timestamp: "010102"
      },
      from: {
        name: "Синиша"
      },
      content: {
        text: "Ћао, Колабо!"
      }
    },
    {
      meta: {
        timestamp: "010103"
      },
      from: {
        name: "Colabo"
      },
      content: {
        text: "Ћао, другари!"
      }
    }
  ];
  public messageContent:string;

  constructor(
    private ColaboFlowTopiChatService: ColaboFlowTopiChatService
  ) {
  }

  ngOnInit() {
      // called on helo message
      function clientTalk(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[ColaboFlowTopiChatForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
          this.messages.push(tcPackage.msg);
      }

      // registering system plugin
      let talkPluginOptions:ColaboPubSubPlugin = {
          name: "topiChat-talk-form",
          events: {}
      };
      talkPluginOptions.events[ColaboFlowTopiChatEvents.ChatMessage] = clientTalk.bind(this);
      this.ColaboFlowTopiChatService.registerPlugin(talkPluginOptions);
  }

  sendMessage(){
      var msg:any = {
        meta: {
          timestamp: Math.floor(new Date().getTime() / 1000)
        },
        from: {
          name: "Саша"
        },
        content: {
          text: this.messageContent
        }
      };
      console.log('[ColaboFlowTopiChatForm:sendMessage] sending message: %s', this.messageContent);
      this.ColaboFlowTopiChatService.emit(ColaboFlowTopiChatEvents.ChatMessage, msg);
      this.messageContent = "";
  }
}
