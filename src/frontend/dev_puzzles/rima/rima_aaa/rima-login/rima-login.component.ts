import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/rima_aaa/userData';
import { KNode } from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

@Component({
  selector: 'app-rima-login',
  templateUrl: './rima-login.component.html',
  styleUrls: ['./rima-login.component.css']
})
export class RimaLoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private RimaAAAService: RimaAAAService
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

  get isLoggedIn():boolean{
    return this.RimaAAAService.getUser() !== null;
  }

  get isErrorLogingIn():boolean{
      return this.RimaAAAService.isErrorLogingIn;
  }

  get errorLogingMsg():string{
      return this.RimaAAAService.errorLogingMsg;
  }

  get loggedUser(): KNode {
    return this.RimaAAAService.getUser();
  }

  logOut(){
    this.RimaAAAService.logOut();
  }

  userChecked(newNode: KNode){

  }

  onSubmit(){
    console.log(this.form);
    let userData:UserData = new UserData();
    userData.email = this.form.value.email;
    userData.password = this.form.value.password;
    this.RimaAAAService.checkUser(userData).subscribe(this.userChecked.bind(this));;
  }
}
