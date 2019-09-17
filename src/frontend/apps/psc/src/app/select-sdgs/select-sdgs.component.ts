import { MatDialog, MatDialogRef } from "@angular/material";
import { Dialog1Btn, Dialog2Btn, DialogData } from "../util/dialog";

import { Component, OnInit } from "@angular/core";

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

  constructor(
    private rimaAAAService: RimaAAAService,
    private sDGsService: SDGsService,
    public dialog: MatDialog
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

    this.sDGsService
      .getMySDGSelections()
      .subscribe(this.mySDGSelectionsReceived.bind(this));
    //.subscribe(sdgs => this.sdgs);
    //this.sdgs = this.sDGsService.getSDGs();
    //this.sDGsService.loadSDGs();
  }

  private mySDGSelectionsReceived(selections: KEdge[]): void {
    // this.sdgs = sdgsD;
    console.log("[mySDGSelectionsReceived] selections:", selections);
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

  correctSelection(): boolean {
    return this.sDGsService.selectedSDGsIDs.length == SDGS_TO_SELECT;
  }

  getActionMessage(): string {
    let msg: string = "";
    if (this.saved) {
      msg = "you have finished this phase";
    } else {
      if (this.sDGsService.selectedSDGsIDs.length < SDGS_TO_SELECT) {
        msg =
          "Select " +
          (SDGS_TO_SELECT - this.sDGsService.selectedSDGsIDs.length) +
          " more SDGs";
      } else if (this.sDGsService.selectedSDGsIDs.length == SDGS_TO_SELECT) {
        msg = "Great! Please, submit ";
      } else {
        msg =
          "Too many SDGs selected! " +
          SDGS_TO_SELECT +
          " SDGs, not " +
          this.sDGsService.selectedSDGsIDs.length;
      }
    }
    return msg;
  }

  isSdgSelected(sdgId: string): boolean {
    return this.sDGsService.isSdgSelected(sdgId);
  }

  canSubmit(): boolean {
    return !this.saved && this.correctSelection();
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
      )
    );
    //window.alert("Your selection is successfully saved");
  }

  /**
   * depends on `mySDGSelectionsReceived` to receive results first
   * @param sdgsD
   */
  private sdgsReceived(sdgsD: any[]): void {
    this.sdgs = sdgsD;
    // for (var sdg in this.sdgs) {
    // console.log(item); // 0,1,2
  }
  // console.log('sdgsReceived:', this.sdgs)

  onToggled(state: boolean, id: string): void {
    this.sDGsService.changeSDGsSelectionState(state, id);
  }
}
