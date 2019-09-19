import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoGameComponent } from './dialo-game.component';

describe('DialoGameComponent', () => {
  let component: DialoGameComponent;
  let fixture: ComponentFixture<DialoGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialoGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialoGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
