import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialoGameResponseComponent } from './dialo-game-response.component';

describe('DialoGameResponseComponent', () => {
  let component: DialoGameResponseComponent;
  let fixture: ComponentFixture<DialoGameResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialoGameResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialoGameResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
