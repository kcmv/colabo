import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {TopiChatCoreService, TopiChatPackage, TopiChatSystemEvents, ColaboPubSubPlugin} from '../topiChat-core.service';

@Component({
  selector: 'topiChat-simple-message-form',
  templateUrl: './simple-message-form.component.html',
  styleUrls: ['./simple-message-form.component.css']
})
export class TopiChatSimpleMessageForm implements OnInit {
  messageContent:string;
  public messages = [
  ];

  constructor(
    private topiChatCoreService: TopiChatCoreService
  ) {
  }

  ngOnInit() {
      // called on helo message
      function clientEcho(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatSimpleMessageForm:clientEcho] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t payload: %s', JSON.stringify(tcPackage.payload));
          this.messages.push(tcPackage.payload);
      }

      // registering system plugin
      let echoPluginOptions:ColaboPubSubPlugin = {
          name: "simple-echo",
          events: {}
      };
      echoPluginOptions.events[TopiChatSystemEvents.ClientEcho] = clientEcho.bind(this);
      this.topiChatCoreService.registerPlugin(echoPluginOptions);    
  }

  sendMessage(){
      var msg:any = {
          timestamp: Math.floor(new Date().getTime() / 1000),
          text: this.messageContent
      };
      console.log('[TopiChatSimpleMessageForm:sendMessage] sending message: %s', this.messageContent);
      this.topiChatCoreService.emit(TopiChatSystemEvents.ClientEcho, msg);
      this.messageContent = "";
  }
}
