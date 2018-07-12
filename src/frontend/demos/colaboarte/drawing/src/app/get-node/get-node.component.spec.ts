import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetNodeEdgeComponent } from './get-node-edge.component';

describe('GetNodeEdgeComponent', () => {
  let component: GetNodeEdgeComponent;
  let fixture: ComponentFixture<GetNodeEdgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetNodeEdgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetNodeEdgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
