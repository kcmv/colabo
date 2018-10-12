import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogameCardComponent } from './dialogame-card.component';

describe('DialogameCardComponent', () => {
  let component: DialogameCardComponent;
  let fixture: ComponentFixture<DialogameCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogameCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
