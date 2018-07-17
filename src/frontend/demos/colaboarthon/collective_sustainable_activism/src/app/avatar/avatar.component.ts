import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {RimaService} from '../rima-register/rima.service';
import {UserData} from '../rima-register/userData';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private rimaService: RimaService
  ) {
    this.form = fb.group({
        // "cameraPhoto": ['', [Validators.required, Validators.email]],
        // "storagePhoto":["", [Validators.required, Validators.minLength(3)]]
        "cameraPhoto": ['', []],
        "storagePhoto":["", []]
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
    //TODO: userData.image.url = this.form.value.cameraPhoto;
    // this.rimaService.createNewUser(userData, this.userCreated);
  }

}
