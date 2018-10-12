import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'pub-sub-info-form',
  templateUrl: './pub-sub-info.component.html',
  styleUrls: ['./pub-sub-info.component.css']
})
export class PubSubInfoForm implements OnInit {
  public messageContent:string;
  public messages = [
    {
      timestamp: "Tue 1st Jan",
      text: "Здраво корисниче!",
      receivedText: "Здраво, Колабо!"
    }
  ];

  constructor(
  ) {
  }

  ngOnInit() {
  }

sendMessage(messageContent:string){

}
  onSubmit(){
    let userData;
    // let userData:UserData = new UserData();
    // userData.email = this.form.value.email;
    // userData.password = this.form.value.password;
    // this.TopiChatCoreService.checkUser(userData).subscribe(this.userChecked.bind(this));;
  }
}
