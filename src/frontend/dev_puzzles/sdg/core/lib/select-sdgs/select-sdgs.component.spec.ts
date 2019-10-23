import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectSdgsComponent } from "./select-sdgs.component";

describe("SelectSdgsComponent", () => {
  let component: SelectSdgsComponent;
  let fixture: ComponentFixture<SelectSdgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectSdgsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSdgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show exactly `SDGS_TO_SELECT` sdgs in toolbar, after a correct selection", () => {
    //TODO:
    //server might return all the sellected SDGs for other users
    expect(true).toBeTruthy();
  });
});
