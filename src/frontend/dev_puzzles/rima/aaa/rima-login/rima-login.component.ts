import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {RimaAAAService} from '@colabo-rima/f-aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/f-aaa/userData';
import { KNode } from '@colabo-knalledge/f-core/code/knalledge/kNode';
import * as config from '@colabo-utils/i-config';
import {Observable} from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-rima-login',
  templateUrl: './rima-login.component.html',
  styleUrls: ['./rima-login.component.css']
})
export class RimaLoginComponent implements OnInit {

  form: FormGroup;
  hide = true; //for password visibility

  constructor(
    fb: FormBuilder,
    private rimaAAAService: RimaAAAService
  ) {
    this.form = fb.group({
        "email": ['', [Validators.required, Validators.email]],
        "password":["", [Validators.required, Validators.minLength(3)]]
    });

    this.form.valueChanges
    .pipe(filter((value) => this.form.valid)) //validating while filling the form
  }

  ngOnInit() {
    this.reset();
  }

  // get avatarImage():string{
  //   return config.GetGeneral('imagesFolder') + '/user.avatar-' + this.rimaAAAService.getUserId() + '.jpg';
  // }
  public userAvatar():Observable<string>{
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }

  isValid():boolean{
    return this.form.valid;
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
    // TEST-carefully! User's PRIVATE DATA: console.log(this.form);
    if(this.form.valid)
    {
      let userData:UserData = new UserData();
      userData.email = this.form.value.email;
      userData.password = this.form.value.password;
      this.rimaAAAService.checkUser(userData).subscribe(this.userChecked.bind(this));;
    }else{
      console.log('cannot submit! The form is not valid');
    }
  }
}
