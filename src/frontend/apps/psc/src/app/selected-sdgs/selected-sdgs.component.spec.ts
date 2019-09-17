import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSdgsComponent } from './selected-sdgs.component';

describe('SelectedSdgsComponent', () => {
  let component: SelectedSdgsComponent;
  let fixture: ComponentFixture<SelectedSdgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedSdgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSdgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
