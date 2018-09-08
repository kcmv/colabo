import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {TopiChatCoreService} from '../topiChat-core.service';

@Component({
  selector: 'topiChat-simple-message-form',
  templateUrl: './simple-message-form.component.html',
  styleUrls: ['./simple-message-form.component.css']
})
export class TopiChatSimpleMessageForm implements OnInit {

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private TopiChatCoreService: TopiChatCoreService
  ) {
    this.form = fb.group({
        "email": ['', [Validators.required, Validators.email]],
        "password":["", [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
  }

  reset() {
      this.form.reset();
  }

  get isLoggedIn():Boolean{
    return true;
  }

  get isErrorLogingIn():Boolean{
      return false;
  }

  get errorLogingMsg():String{
      return "No error";
  }

  get loggedUser(): any {
    return null;
  }

  onSubmit(){
    console.log(this.form);
    let userData;
    // let userData:UserData = new UserData();
    // userData.email = this.form.value.email;
    // userData.password = this.form.value.password;
    // this.TopiChatCoreService.checkUser(userData).subscribe(this.userChecked.bind(this));;
  }
}
