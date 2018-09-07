import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSdgsComponent } from './select-sdgs.component';

describe('SelectSdgsComponent', () => {
  let component: SelectSdgsComponent;
  let fixture: ComponentFixture<SelectSdgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSdgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSdgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
