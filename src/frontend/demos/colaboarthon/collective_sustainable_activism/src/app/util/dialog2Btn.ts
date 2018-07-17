// https://material.angular.io/components/dialog/api
// https://stackblitz.com/angular/lrampyldvly?file=app%2Fdialog-overview-example.ts

import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  title: string;
  info: string;
  button1: string;
  button2: string;
}

@Component({
  selector: 'dialog2Btn',
  templateUrl: 'dialog2Btn.html',
})
export class Dialog2Btn {

  constructor(
    public dialogRef: MatDialogRef<Dialog2Btn>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
