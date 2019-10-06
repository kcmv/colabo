import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CardDecorator } from "./cardDecorator";
import { MatDialog, MatDialogRef } from "@angular/material";
import {
  Dialog1Btn,
  Dialog2Btn,
  DialogData
} from "@colabo-utils/f-notifications";
//import {DialoGameService} from '../dialo-game.service';

@Component({
  selector: "card-decorator",
  templateUrl: "./card-decorator.component.html",
  styleUrls: ["./card-decorator.component.css"]
})
export class CardDecoratorComponent implements OnInit {
  @Input() decoratorData: CardDecorator;
  dialogRef: any; //TODO: type: MatDialogRef;

  @Output()
  action = new EventEmitter<string>();

  constructor(
    //private dialoGameService: DialoGameService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  onClick() {
    this.deleteInit();
  }

  deleteInit(): void {
    this.openDialog(
      2,
      new DialogData(
        "Delete",
        "Do you want to delete this decorator?",
        "No",
        "Yes"
      ),
      null,
      this.delete.bind(this)
    );
  }

  delete(result: any): void {
    console.log("The dialog was closed", result);
    if (result) {
      console.log("delete ", this.decoratorData.decorator);
      this.action.emit("delete");
    }
  }

  openDialog(
    buttons: number,
    data: DialogData,
    options: any = null,
    afterClosed: Function = null
  ): void {
    if (options === null) {
      options = {};
    }
    options["width"] = "95%";
    options["data"] = data;
    console.log("openDialog", options);
    this.dialogRef = this.dialog.open(
      buttons == 1 ? Dialog1Btn : Dialog2Btn,
      options
    );
    if (afterClosed) {
      this.dialogRef.afterClosed().subscribe(afterClosed);
    }
  }
}
