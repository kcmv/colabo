import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionCardsComponent } from './interaction-cards.component';

describe('InteractionCardsComponent', () => {
  let component: InteractionCardsComponent;
  let fixture: ComponentFixture<InteractionCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
