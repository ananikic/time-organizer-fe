import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInstanceDialogComponent } from './activity-instance-dialog.component';

describe('ActivityInstanceDialogComponent', () => {
  let component: ActivityInstanceDialogComponent;
  let fixture: ComponentFixture<ActivityInstanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityInstanceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityInstanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
