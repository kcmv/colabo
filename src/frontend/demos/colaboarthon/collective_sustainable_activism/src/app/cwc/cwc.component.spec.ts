import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwcComponent } from './cwc.component';

describe('CwcComponent', () => {
  let component: CwcComponent;
  let fixture: ComponentFixture<CwcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
