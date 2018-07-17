import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {RimaService} from '../rima-register/rima.service';
import {UserData} from '../rima-register/userData';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private rimaService: RimaService
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

  onSubmit( ){
    console.log(this.form);
    let userData:UserData = new UserData();
    userData.email = this.form.value.email;
    //TODO: this.form.value.password;
    // this.rimaService.createNewUser(userData, this.userCreated);
  }

}
