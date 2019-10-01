import {} from "jasmine"; //https://stackoverflow.com/questions/45431458/typescript-errors-in-spec-files-in-visual-studio-web-application
// import { TestBed, async } from "@angular/core/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import * as GlobalTest from "../../../config/global-test";
import * as Config from "@colabo-utils/i-config";
Config.init(GlobalTest.globalSet);

import { CardDecoratorComponent } from "./card-decorator.component";

describe("CardDecoratorComponent", () => {
  let component: CardDecoratorComponent;
  let fixture: ComponentFixture<CardDecoratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardDecoratorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDecoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
