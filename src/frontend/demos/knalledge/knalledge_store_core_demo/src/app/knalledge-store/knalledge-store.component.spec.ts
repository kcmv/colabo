import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnalledgeStoreComponent } from './knalledge-store.component';

describe('KnalledgeStoreComponent', () => {
  let component: KnalledgeStoreComponent;
  let fixture: ComponentFixture<KnalledgeStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnalledgeStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnalledgeStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
