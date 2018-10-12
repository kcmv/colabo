import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnSearchComponent } from './kn-search.component';

describe('KnSearchComponent', () => {
  let component: KnSearchComponent;
  let fixture: ComponentFixture<KnSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
