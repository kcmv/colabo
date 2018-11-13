import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/f-aaa/userData';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';
import * as config from '@colabo-utils/i-config';

@Component({
  selector: 'app-rima-login',
  templateUrl: './rima-login.component.html',
  styleUrls: ['./rima-login.component.css']
})
export class RimaLoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private rimaAAAService: RimaAAAService
  ) {
    this.form = fb.group({
        "email": ['', [Validators.required, Validators.email]],
        "password":["", [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
  }

  get avatarImage():string{
    return config.GetGeneral('imagesFolder') + '/user.avatar-' + this.rimaAAAService.getUserId() + '.jpg';
  }
  reset() {
      this.form.reset();
  }

  get isLoggedIn():boolean{
    return this.rimaAAAService.getUser() !== null;
  }

  get isErrorLogingIn():boolean{
      return this.rimaAAAService.isErrorLogingIn;
  }

  get errorLogingMsg():string{
      return this.rimaAAAService.errorLogingMsg;
  }

  get loggedUser(): KNode {
    return this.rimaAAAService.getUser();
  }

  logOut(){
    this.rimaAAAService.logOut();
  }

  userChecked(newNode: KNode){

  }

  onSubmit(){
    console.log(this.form);
    let userData:UserData = new UserData();
    userData.email = this.form.value.email;
    userData.password = this.form.value.password;
    this.rimaAAAService.checkUser(userData).subscribe(this.userChecked.bind(this));;
  }
}
