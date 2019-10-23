// https://material.angular.io/components/dialog/api
// https://stackblitz.com/angular/lrampyldvly?file=app%2Fdialog-overview-example.ts

import { Component, Inject, Output } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

export class DialogData {
  title: string;
  info: string;
  button1: string;
  button2: string;
  progressBar: boolean;

  constructor(
    title: string,
    info: string,
    button1: string,
    button2: string = null,
    progressBar: boolean = false
  ) {
    this.title = title;
    this.info = info;
    this.button1 = button1;
    this.button2 = button2;
    this.progressBar = progressBar;
  }
}

export class Dialog {
  static open(
    dialog: MatDialog,
    buttons: number,
    data: DialogData,
    options: any = null,
    afterClosed: (value: any) => void = null
  ): MatDialogRef<Dialog1Btn | Dialog2Btn, any> {
    if (options === null) {
      options = {};
    }
    options["width"] = "95%";
    options["data"] = data;
    console.log("openDialog", options);
    let dialogRef: MatDialogRef<Dialog1Btn | Dialog2Btn, any> = dialog.open(
      buttons == 1 ? Dialog1Btn : Dialog2Btn,
      options
    );
    if (afterClosed) {
      dialogRef.afterClosed().subscribe(afterClosed);
    }
    return dialogRef;
  }
}

@Component({
  selector: "dialog1Btn",
  templateUrl: "dialog1Btn.html"
})
export class Dialog1Btn {
  constructor(
    public dialogRef: MatDialogRef<Dialog1Btn>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(value: any): void {
    this.dialogRef.close(value);
  }
}

@Component({
  selector: "dialog2Btn",
  templateUrl: "dialog2Btn.html"
})
export class Dialog2Btn {
  constructor(
    public dialogRef: MatDialogRef<Dialog2Btn>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(value: any): void {
    this.dialogRef.close(value);
  }

  // on1stClick(value:any): void {
  //   this.dialogRef.close(value);
  // }
}
