import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RimaRegisterComponent } from './rima-register.component';

describe('RimaRegisterComponent', () => {
  let component: RimaRegisterComponent;
  let fixture: ComponentFixture<RimaRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RimaRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RimaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
