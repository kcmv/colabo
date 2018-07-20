import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RimaAAAService } from '@colabo-rima/rima_aaa/rima-aaa.service';
import {UserData} from '@colabo-rima/rima_aaa/userData';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private RimaAAAService: RimaAAAService
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
    // this.RimaAAAService.createNewUser(userData, this.userCreated);
  }

}