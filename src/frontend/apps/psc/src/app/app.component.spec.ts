import {} from "jasmine"; //https://stackoverflow.com/questions/45431458/typescript-errors-in-spec-files-in-visual-studio-web-application
import { TestBed, async } from "@angular/core/testing";

import * as GlobalTest from "../config/global-test";
import * as Config from "@colabo-utils/i-config";
Config.init(GlobalTest.globalSet);

import { AppComponent } from "./app.component";
describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();
  }));
  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("Colabo.Space - PSC");
  }));
  // TESTING
  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  // }));
});
