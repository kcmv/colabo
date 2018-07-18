import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import {RimaService} from '../rima-register/rima.service';
import {CWCService, CWCData} from './cwc.service';

@Component({
  selector: 'app-cwc',
  templateUrl: './cwc.component.html',
  styleUrls: ['./cwc.component.css']
})
export class CwcComponent implements OnInit {
  form: FormGroup;
  cwcs: CWCData;

  constructor(
    fb: FormBuilder,
    private cwcService: CWCService,
    private rimaService: RimaService
  ) {
      this.form = fb.group({
          "cwcVision1":["", [Validators.required, Validators.minLength(2)]],
          "cwcVision2":["", [Validators.required, Validators.minLength(2)]],
          "cwcVision3":["", [Validators.required, Validators.minLength(2)]]
      });

      this.form.valueChanges
        // example .map((value) => {
        //     value.firstName = value.firstName.toUpperCase();
        //     return value;
        // })
        .filter((value) => this.form.valid)
        .subscribe((value) => {
           console.log("Model Driven Form valid value: vm = ",
                       JSON.stringify(value));
        });
      //TODO: check if the user's email is already existing (offer sign-in instead and data updating)
  }

  reset() {
      this.form.reset();
  }

  onSubmit( ){
    console.log("the CWC form is submitted", this.form);
    this.cwcs = new CWCData([this.form.value.cwcVision1, this.form.value.cwcVision2, this.form.value.cwcVision3]);

    //TODO: this.form.value.password;
    this.cwcService.saveCWCs(this.cwcs).subscribe(this.cwcsSaved.bind(this));
  }

  cwcsSaved():void{
    console.log('cwcsSaved');
  }

  ngOnInit() {
  }

}
