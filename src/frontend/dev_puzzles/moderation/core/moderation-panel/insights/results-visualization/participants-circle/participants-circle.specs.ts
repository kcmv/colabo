import { } from 'jasmine';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsCircleComponent } from './participants-circle';

describe('ParticipantsCircleComponent', () => {
  let component: ParticipantsCircleComponent;
  let fixture: ComponentFixture<ParticipantsCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
