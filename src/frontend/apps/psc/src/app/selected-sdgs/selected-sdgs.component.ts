import { concatMap } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";

import { SDGsService } from "@colabo-sdg/core";
import { KEdge, KNode } from "@colabo-knalledge/f-core";

@Component({
  selector: "selected-sdgs",
  templateUrl: "./selected-sdgs.component.html",
  styleUrls: ["./selected-sdgs.component.css"]
})
export class SelectedSdgsComponent implements OnInit {
  protected sdgs: KEdge[] = [];
  public sdgImagesPath: string = "assets/images/sdgs/s/";

  constructor(private sDGsService: SDGsService) {}

  ngOnInit() {
    this.sDGsService
      .getMySDGSelections()
      .pipe(concatMap(() => this.sDGsService.getSDGs()))
      .subscribe(this.sdgsReceived.bind(this));
  }

  get mySDGs(): string[] {
    return this.sDGsService.selectedSDGsIDs;
  }

  getSDG(id: string): KNode {
    return this.sDGsService.getSDG(id);
  }

  private sdgsReceived(): void {
    console.log("[SelectedSdgsComponent] sdgsReceived");
  }

  // private mySDGSelectionsReceived(selections: KEdge[]): void {
  //   console.log("[mySDGSelectionsReceived] selections:", selections);
  //   this.sdgs = selections;
  //   if (this.sdgs.length > 0) {
  //     if ((this.sdgs[0] as Object)["targetId"]) {
  //       console.log((this.sdgs[0] as Object)["targetId"].dataContent.humanID);
  //     }
  //   }

  //   //this.sDGsService.getSDGs().subscribe(this.sdgsReceived.bind(this));
  // }

  //   if(this.sDGsService.selectedSDGsIDs.length < SDGS_TO_SELECT){
  //     msg = 'Select ' + (SDGS_TO_SELECT - this.sDGsService.selectedSDGsIDs.length) + ' more SDGs';
  // } else if (this.sDGsService.selectedSDGsIDs.length == SDGS_TO_SELECT) {
  //     msg = 'Great! Please, submit ';
  // } else {
  //     msg = 'Too many SDGs selected! ' + SDGS_TO_SELECT + ' SDGs, not ' + this.sDGsService.selectedSDGsIDs.length;
  // }
}
