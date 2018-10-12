import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSmsComponent } from './ui-sms.component';

describe('UiSmsComponent', () => {
  let component: UiSmsComponent;
  let fixture: ComponentFixture<UiSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
