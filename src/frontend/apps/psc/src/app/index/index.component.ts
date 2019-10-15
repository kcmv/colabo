import { Component, OnInit } from "@angular/core";
import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";
import { ColaboFlowService } from "@colabo-flow/f-core";
import { UserData } from "@colabo-rima/f-aaa/userData";
import { KNode } from "@colabo-knalledge/f-core/code/knalledge/kNode";
import { Observable } from "rxjs";
import * as config from "@colabo-utils/i-config";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"]
})
export class IndexComponent implements OnInit {
  public appTitle: string = config.GetGeneral("appTitle");
  // public static CF_WHERE: string = "INDEX";

  constructor(
    private rimaAAAService: RimaAAAService,
    private colaboFlowService: ColaboFlowService
  ) {}

  ngOnInit() {
    // this.colaboFlowService.startKeepingMyState(IndexComponent.CF_WHERE);
  }

  ngAfterViewChecked() {}

  get isLoggedIn(): Boolean {
    return this.rimaAAAService.getUser() !== null;
  }

  public userAvatar(): Observable<string> {
    return RimaAAAService.userAvatar(this.rimaAAAService.getUser());
  }

  get loggedUser(): KNode {
    return this.rimaAAAService.getUser();
  }

  logOut() {
    this.rimaAAAService.logOut();
  }

  get isModerator() {
    return this.rimaAAAService.isModerator();
  }
}
