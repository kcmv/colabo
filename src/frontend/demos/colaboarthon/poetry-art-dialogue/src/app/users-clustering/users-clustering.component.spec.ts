import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersClusteringComponent } from './users-clustering.component';

describe('UsersClusteringComponent', () => {
  let component: UsersClusteringComponent;
  let fixture: ComponentFixture<UsersClusteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersClusteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
