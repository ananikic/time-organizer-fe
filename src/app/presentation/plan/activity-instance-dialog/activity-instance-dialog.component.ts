import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COLOR } from 'src/app/abstraction/activities/constants/activity.constants';
import { ActivityColor } from 'src/app/abstraction/activities/models/activity.model';
import { ActivityInstance } from 'src/app/abstraction/activities/models/activityInstance.model';

@Component({
  selector: 'app-activity-instance-dialog',
  templateUrl: './activity-instance-dialog.component.html',
  styleUrls: ['./activity-instance-dialog.component.scss']
})
export class ActivityInstanceDialogComponent implements OnInit {

  colors = Object.values(COLOR);
  startTime = { hour: 0, minute: 0 };
  endTime = { hour: 0, minute: 0 };

  constructor(public dialogRef: MatDialogRef<ActivityInstanceDialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: { activityInstance: ActivityInstance }) { }

  ngOnInit(): void {
    this.startTime = { hour: this.data.activityInstance.start.getHours(), minute: this.data.activityInstance.start.getMinutes()};
    this.endTime = { hour: this.data.activityInstance.end!.getHours(), minute: this.data.activityInstance.end!.getMinutes()};
  }

  onSelect(color: ActivityColor): void {
    this.data.activityInstance.color = color;
  }

  onUpdate(): void {
    this.data.activityInstance.start.setHours(this.startTime.hour);
    this.data.activityInstance.start.setMinutes(this.startTime.minute);
    this.data.activityInstance.end!.setHours(this.endTime.hour);
    this.data.activityInstance.end!.setMinutes(this.endTime.minute);

    this.dialogRef.close(this.data);
  }

  onDelete(): void {
    // TODO: Delete Activity Instance
  }

}
