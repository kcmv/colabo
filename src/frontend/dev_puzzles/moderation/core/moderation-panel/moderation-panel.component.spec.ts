import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationPanelComponent } from './moderation-panel.component';

describe('ModerationPanelComponent', () => {
  let component: ModerationPanelComponent;
  let fixture: ComponentFixture<ModerationPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModerationPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModerationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
