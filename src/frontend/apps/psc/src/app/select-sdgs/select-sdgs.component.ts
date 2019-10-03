import { MatDialog, MatDialogRef } from "@angular/material";
import { Dialog1Btn, Dialog2Btn, DialogData } from "../util/dialog";

import { Component, OnInit } from "@angular/core";

import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { BottomShDgData, BottomShDg } from "@colabo-utils/f-notifications";
import { MatSnackBar } from "@angular/material";

import {
  SDGsService,
  SDG_SELECTION_NAME,
  SDG_SELECTION_TYPE,
  SDGS_TO_SELECT
} from "./sdgs.service";
import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { KNode } from "@colabo-knalledge/f-core/code/knalledge/kNode";
import { KEdge } from "@colabo-knalledge/f-core/code/knalledge/kEdge";

@Component({
  selector: "app-select-sdgs",
  templateUrl: "./select-sdgs.component.html",
  styleUrls: ["./select-sdgs.component.css"]
})
export class SelectSdgsComponent implements OnInit {
  // mprinc: added to avoid AOT error
  sdgs: any[] = [];
  saved: boolean = false;
  dialogRef: any; //TODO: type: MatDialogRef;
  loadingSDGs: boolean = true;

  constructor(
    private rimaAAAService: RimaAAAService,
    private sDGsService: SDGsService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    //TODO: add loading of user's sdgs selections (and setting up states of sdg-cards) - if the user has already selected them in a previous session
    //TODO: add deleting of old selections before submitting new ones () - if the user has already selected them in a previous session

    // this.sdgs = [{
    //   name: "sdg a"
    // }, {
    //   name: "sdg b"
    // },
    // {
    //   name: "sdg b"
    // }];
    //TODO: !! we should migrate to the App-persisten Service this server-loads. RIGHT NOW each time we open this component, it loads it:

    // this.loadingSDGs = true;
    this.sDGsService
      .getMySDGSelections()
      .subscribe(this.mySDGsSelectionsReceived.bind(this));
    //.subscribe(sdgs => this.sdgs);
    //this.sdgs = this.sDGsService.getSDGs();
    //this.sDGsService.loadSDGs();
  }

  private mySDGsSelectionsReceived(selections: KEdge[]): void {
    console.log("[mySDGsSelectionsReceived] selections:", selections);
    // console.log(item); // 0,1,2
    if (selections && selections.length > 0) {
      this.saved = true;
    }
    this.sDGsService.getSDGs().subscribe(this.sdgsReceived.bind(this));
  }

  public selectionDisabled(): boolean {
    return this.saved;
  }

  userName(): string {
    return this.rimaAAAService.getUser() !== null
      ? this.rimaAAAService.getUser().name
      : "not logged in";
  }

  get isLoggedIn(): Boolean {
    return this.rimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.rimaAAAService.getUser();
  }

  deleteSDGSelection(): void {
    let BottomShDgData: BottomShDgData = {
      title: "SDGs selections",
      message: "You want to delete your selection?",
      btn1: "Yes",
      btn2: "No",
      callback: this.deleteConfirmation.bind(this)
    };
    let bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(BottomShDg, {
      data: BottomShDgData
    }); //, disableClose: true
  }

  protected deleteConfirmation(btnOrder: number): void {
    if (btnOrder === 1) {
      this.sDGsService
        .deleteSDGSelection(this.rimaAAAService.getUserId())
        .subscribe(result => {
          this.saved = false;
        });
    }
  }

  protected openDialog(
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

  protected isCorrectSelection(): boolean {
    return this.sDGsService.selectedSDGsIDs.length == SDGS_TO_SELECT;
  }

  getActionMessage(): string {
    let msg: string = "";
    if (this.saved) {
      msg = "you have finished this phase";
    } else {
      if (this.sDGsService.selectedSDGsIDs.length < SDGS_TO_SELECT) {
        msg = this.selectMoreMsg;
      } else if (this.isCorrectSelection()) {
        msg = "Great! Please, submit ";
      } else {
        msg = this.tooManySDGsMessage[0] + ", " + this.tooManySDGsMessage[1];
      }
    }
    return msg;
  }

  isSdgSelected(sdgId: string): boolean {
    return this.sDGsService.isSdgSelected(sdgId);
  }

  canSubmit(): boolean {
    return !this.saved && this.isCorrectSelection();
  }

  onSubmit() {
    this.saved = false;
    console.log("submit");
    this.openDialog(
      1,
      new DialogData("Submitting", "please wait ...", "Cancel", null, true),
      { disableClose: true },
      function() {
        console.log("The dialog NEW was closed");
        //this.animal = result;
      }
    );
    this.sDGsService
      .saveSDGsSelection(this.sDGsService.selectedSDGsIDs)
      .subscribe(this.sdgsSaved.bind(this));
  }

  private sdgsSaved(): void {
    console.log("SelectSdgsComponent::sdgsSaved");
    this.saved = true; //TODO: see if we want to keep this
    this.dialogRef.close();
    this.openDialog(
      1,
      new DialogData(
        "Submitted",
        "Thank you for your SDGs selection. You've finished this phase",
        "OK"
      ),
      { disableClose: true }
    );
    //window.alert("Your selection is successfully saved");
  }

  /**
   * depends on `mySDGsSelectionsReceived` to receive results first
   * @param sdgsD
   */
  protected sdgsReceived(sdgsD: any[]): void {
    this.loadingSDGs = false;
    this.sdgs = sdgsD;
    // for (var sdg in this.sdgs) {
    // console.log(item); // 0,1,2
  }
  // console.log('sdgsReceived:', this.sdgs)

  protected get tooManySDGsMessage(): string[] {
    return [
      "You've selected " + this.sDGsService.selectedSDGsIDs.length + " SDGs",
      "unselect " +
        (this.sDGsService.selectedSDGsIDs.length - SDGS_TO_SELECT) +
        " SDG" +
        (this.sDGsService.selectedSDGsIDs.length - SDGS_TO_SELECT > 1
          ? "s"
          : "")
    ];
  }

  protected get selectMoreMsg(): string {
    return (
      "Select " +
      (SDGS_TO_SELECT - this.sDGsService.selectedSDGsIDs.length) +
      " more SDG" +
      (SDGS_TO_SELECT - this.sDGsService.selectedSDGsIDs.length > 1 ? "s" : "")
    );
  }

  onToggled(state: boolean, id: string): void {
    this.sDGsService.changeSDGsSelectionState(state, id);
    if (this.canSubmit()) {
      let BottomShDgData: BottomShDgData = {
        title: "You've selected all " + SDGS_TO_SELECT + " SDGs",
        message: "Are you ready to submit your selection?",
        btn1: "Submit",
        btn2: "I'm still checking SDGs ...",
        callback: this.submitConfirmation.bind(this)
      };
      let bottomSheetRef: MatBottomSheetRef = this.bottomSheet.open(
        BottomShDg,
        {
          data: BottomShDgData,
          disableClose: true
        }
      );
    } else {
      if (this.sDGsService.selectedSDGsIDs.length > SDGS_TO_SELECT) {
        this.snackBar.open(
          this.tooManySDGsMessage[0],
          this.tooManySDGsMessage[1],
          { duration: 2000 }
        );
      } else {
        this.snackBar.open(
          state ? "You've selected this one" : "You've unselected this one",
          this.selectMoreMsg,
          { duration: 2000 }
        );
      }
    }
  }

  protected submitConfirmation(buttonNo: number): void {
    if (buttonNo === 1) {
      if (this.canSubmit()) {
        this.onSubmit();
      }
    } else {
      this.snackBar.open(
        "OK. When you're ready",
        "click the 'Submit' button on top",
        { duration: 2000 }
      );
    }
  }
}
