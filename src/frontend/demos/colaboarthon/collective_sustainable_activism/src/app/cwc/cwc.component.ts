import { MatDialog, MatDialogRef } from '@angular/material';
import {Dialog1Btn, Dialog2Btn, DialogData} from '../util/dialog';

import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

// import {RimaAAAService} from '@colabo-rima/rima_aaa/rima-aaa.service';
import {CWCService, CWCData} from './cwc.service';

@Component({
  selector: 'app-cwc',
  templateUrl: './cwc.component.html',
  styleUrls: ['./cwc.component.css']
})
export class CwcComponent implements OnInit {
  form: FormGroup;
  cwcs: CWCData;

  saved:boolean = false;
  dialogRef: any; //TODO: type: MatDialogRef;

  constructor(
    fb: FormBuilder,
    private cwcService: CWCService,
    // private RimaAAAService: RimaAAAService,
    public dialog: MatDialog
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

  openDialog(buttons:number, data:DialogData, options:any = null, afterClosed:Function = null): void {
    if(options === null){
      options = {};
    }
    options['width'] = '95%'
    options['data'] = data;
    console.log('openDialog',options);
    this.dialogRef = this.dialog.open((buttons == 1 ? Dialog1Btn : Dialog2Btn), options);
    if(afterClosed){this.dialogRef.afterClosed().subscribe(afterClosed);}
  }

  // correctSelection():boolean{
  //   return this.selectedSDGs.length == SDGS_TO_SELECT;
  // }

  // canSubmit():boolean{
  //     return !this.saved;// && this.correctSelection();
  // }

  reset() {
      this.form.reset();
  }

  onSubmit( ){
    console.log("the CWC form is submitted", this.form);
    this.saved = false;
    this.openDialog(1, new DialogData('Submitting','please wait ...', 'Cancel'), {disableClose: true});

    this.cwcs = new CWCData([this.form.value.cwcVision1, this.form.value.cwcVision2, this.form.value.cwcVision3]);

    //TODO: this.form.value.password;
    this.cwcService.saveCWCs(this.cwcs).subscribe(this.cwcsSaved.bind(this));
  }

  cwcsSaved():void{
    console.log('cwcsSaved');
    this.saved = true; //TODO: see if we want to keep this
    this.dialogRef.close();
    this.openDialog(1, new DialogData('Submitted','Thank you for your CWC visions. You\'ve finished this phase', 'OK'));
  }

  ngOnInit() {
  }

}
