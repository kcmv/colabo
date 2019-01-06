import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogameCardsComponent } from './dialogame-cards.component';

describe('DialogameCardsComponent', () => {
  let component: DialogameCardsComponent;
  let fixture: ComponentFixture<DialogameCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogameCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogameCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
