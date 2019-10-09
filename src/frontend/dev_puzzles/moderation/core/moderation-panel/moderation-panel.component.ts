import { Component, OnInit } from "@angular/core";
import { ColaboFlowMComponent } from "@colabo-flow/f-core/lib/moderation/colabo-flow-m.component";
import { InsightsComponent } from "./insights/insights.component";
import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { Observable } from "rxjs";
import * as config from "@colabo-utils/i-config";
import { TestFilesGenerator } from "../lib/util/testFileGenerator";

@Component({
  selector: "app-moderation-panel",
  templateUrl: "./moderation-panel.component.html",
  styleUrls: ["./moderation-panel.component.css"]
})
export class ModerationPanelComponent implements OnInit {
  static mapId = config.GetGeneral("mapId");

  constructor(private rimaAAAService: RimaAAAService) {}

  ngOnInit() {}

  generateTestFiles(): void {
    let temp = TestFilesGenerator.SDGsGen();
    console.log("[SDGsGen]", temp);
    temp = TestFilesGenerator.CWCsGen();
    console.log("[CWCsGen]", temp);
  }

  get activeMap(): string {
    return ModerationPanelComponent.mapId;
  }

  get isLoggedIn(): Boolean {
    return this.rimaAAAService.getUser() !== null;
  }

  get isModerator() {
    return this.rimaAAAService.isModerator();
  }

  // userImg():string{
  //   return 'assets/images/user_icons/performer.jpg';
  // }

  userName(): string {
    return this.rimaAAAService.userName();
  }

  public userAvatar(): Observable<string> {
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }
}
