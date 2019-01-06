import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDecoratorComponent } from './card-decorator.component';

describe('CardDecoratorComponent', () => {
  let component: CardDecoratorComponent;
  let fixture: ComponentFixture<CardDecoratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDecoratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDecoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
