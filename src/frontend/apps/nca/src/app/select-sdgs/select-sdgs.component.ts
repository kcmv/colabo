import { MatDialog, MatDialogRef } from "@angular/material";
import { Dialog, DialogData } from "@colabo-utils/f-notifications";

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

  selectedSDGs: string[] = [];
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
    this.sDGsService.getSDGs().subscribe(this.sdgsReceived.bind(this));
    //.subscribe(sdgs => this.sdgs);
    //this.sdgs = this.sDGsService.getSDGs();
    //this.sDGsService.loadSDGs();
  }

  get isLoggedIn(): Boolean {
    return this.rimaAAAService.getUser() !== null;
  }

  get loggedUser(): KNode {
    return this.rimaAAAService.getUser();
  }

  correctSelection(): boolean {
    return this.selectedSDGs.length == SDGS_TO_SELECT;
  }

  getActionMessage(): string {
    let msg: string = "";
    if (this.saved) {
      msg = "you have finished this phase";
    } else {
      if (this.selectedSDGs.length < SDGS_TO_SELECT) {
        msg =
          "Select " +
          (SDGS_TO_SELECT - this.selectedSDGs.length) +
          " more SDGs";
      } else if (this.selectedSDGs.length == SDGS_TO_SELECT) {
        msg = "Great! Please, submit ";
      } else {
        msg =
          "Too many SDGs selected! " +
          SDGS_TO_SELECT +
          " SDGs, not " +
          this.selectedSDGs.length;
      }
    }
    return msg;
  }

  canSubmit(): boolean {
    return !this.saved && this.correctSelection();
  }

  onSubmit() {
    this.saved = false;
    console.log("submit");
    this.dialogRef = Dialog.open(
      1,
      new DialogData("Submitting", "please wait ...", "Cancel", null, true),
      { disableClose: true },
      function() {
        console.log("The dialog NEW was closed");
        //this.animal = result;
      }
    );
    this.sDGsService
      .saveSDGsSelection(this.selectedSDGs)
      .subscribe(this.sdgsSaved.bind(this));
  }

  private sdgsSaved(): void {
    console.log("SelectSdgsComponent::sdgsSaved");
    this.saved = true; //TODO: see if we want to keep this
    this.dialogRef.close();
    this.dialogRef = Dialog.open(
      1,
      new DialogData(
        "Submitted",
        "Thank you for your SDGs selection. You've finished this phase",
        "OK"
      )
    );
    //window.alert("Your selection is successfully saved");
  }

  private sdgsReceived(sdgsD: any[]): void {
    this.sdgs = sdgsD;
    // for (var sdg in this.sdgs) {
    // console.log(item); // 0,1,2
  }
  // console.log('sdgsReceived:', this.sdgs)

  onToggled(state: boolean, id: string) {
    console.log("SelectSdgsComponent::onToggled", state, id);
    if (state) {
      this.selectedSDGs.push(id);
    } else {
      let index = this.selectedSDGs.indexOf(id);
      if (index !== -1) this.selectedSDGs.splice(index, 1);
    }
    console.log(this.selectedSDGs.toString());
  }
}
