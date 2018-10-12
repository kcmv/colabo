import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMapComponent } from './get-map.component';

describe('GetMapComponent', () => {
  let component: GetMapComponent;
  let fixture: ComponentFixture<GetMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
