import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfilingComponent } from './users-profiling.component';

describe('UsersProfilingComponent', () => {
  let component: UsersProfilingComponent;
  let fixture: ComponentFixture<UsersProfilingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersProfilingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersProfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
