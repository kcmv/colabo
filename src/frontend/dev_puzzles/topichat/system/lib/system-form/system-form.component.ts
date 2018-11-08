import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {TopiChatSystemService, TopiChatSystemEvents, TopiChatPackage, ColaboPubSubPlugin} from '../topiChat-system.service';

@Component({
  selector: 'topiChat-system-form',
  templateUrl: './system-form.component.html',
  styleUrls: ['./system-form.component.css']
})
export class TopiChatSystemForm implements OnInit {

  public messages = [
    {
      meta: {
        timestamp: "010101"
      },
      from: {
        name: "Лазар"
      },
      content: {
        text: "load_users"
      }
    },
    {
      meta: {
        timestamp: "010102"
      },
      from: {
        name: "Бојана"
      },
      content: {
        text: "go_to_next_round!"
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
    private topiChatSystemService: TopiChatSystemService
  ) {
  }

  ngOnInit() {
      // called on helo message
      function clientTalk(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatSystemForm:clientTalk] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t payload: %s', JSON.stringify(tcPackage.payload));
          this.messages.push(tcPackage.payload);
      }

      // registering system plugin
      let talkPluginOptions:ColaboPubSubPlugin = {
          name: "topiChat-system-form",
          events: {}
      };
      talkPluginOptions.events[TopiChatSystemEvents.ChatMessage] = clientTalk.bind(this);
      this.topiChatSystemService.registerPlugin(talkPluginOptions);
  }

  sendMessage(action:string){
      switch(action){
        case '':
          break;        
      }
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
      console.log('[TopiChatSystemForm:sendMessage] sending message: %s', this.messageContent);
      this.topiChatSystemService.emit(TopiChatSystemEvents.ChatMessage, msg);
      this.messageContent = "";
  }
}
