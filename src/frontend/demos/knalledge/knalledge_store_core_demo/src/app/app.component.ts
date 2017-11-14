import { Component, NgModule, Inject } from '@angular/core';
import {VERSION} from '@angular/material';
import {MaterialModule} from './materialModule';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

var moduleImports = [];
moduleImports.push(MaterialModule);

@NgModule({
  imports: moduleImports
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public title: string = 'FDB Knowledge Graph';
  public version: any = VERSION;

  // injecting the MatDialog service
  constructor(public dialog: MatDialog) {
    console.log('Test');
  }

  getMapName():string{
    return "FDB"
  }

  get following(): string {
    return "";
  }

  userPanel(){
    let dialogRef = this.dialog.open(DialogNotImplemented, {
      width: '350px',
      data: { title: "User Management", message: "Not implemented yet" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  toggleOptionsFullscreen(){

  }
}

@Component({
  selector: 'dialog-not-implemented',
  templateUrl: 'dialog-not-implemented.html',
})
export class DialogNotImplemented {

  constructor(
    public dialogRef: MatDialogRef<DialogNotImplemented>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
