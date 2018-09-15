import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {TopiChatTalkService, TopiChatTalkEvents, TopiChatPackage, ColaboPubSubPlugin} from '../topiChat-talk.service';

@Component({
  selector: 'topiChat-talk-form',
  templateUrl: './talk-form.component.html',
  styleUrls: ['./talk-form.component.css']
})
export class TopiChatTalkForm implements OnInit {

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
  protected messageContent:string;

  constructor(
    private TopiChatTalkService: TopiChatTalkService
  ) {
  }

  ngOnInit() {
      // called on helo message
      function clientTalk(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatTalkForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
          this.messages.push(tcPackage.msg);
      }

      // registering system plugin
      let talkPluginOptions:ColaboPubSubPlugin = {
          name: "topiChat-talk-form",
          events: {}
      };
      talkPluginOptions.events[TopiChatTalkEvents.ChatMessage] = clientTalk.bind(this);
      this.TopiChatTalkService.registerPlugin(talkPluginOptions);
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
      console.log('[TopiChatTalkForm:sendMessage] sending message: %s', this.messageContent);
      this.TopiChatTalkService.emit(TopiChatTalkEvents.ChatMessage, msg);
      this.messageContent = "";
  }
}
