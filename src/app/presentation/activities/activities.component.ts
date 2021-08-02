import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/abstraction/activities/models/activity.model';
import { ActivitiesApiService } from 'src/app/core/activities/services/activities-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  activities!: Observable<Activity[]>;

  constructor(public apiActivities: ActivitiesApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.activities = this.apiActivities.getActivities();
  }

  openActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      width: '480px',
      data: { activity: {}, update: false },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.activity) {
        // TODO: Create Activity
      }

      if (data?.reopenDialog) {
        this.openActivityDialog();
      }
    });
  }

  openActivityUpdateDialog(activity: Activity): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      width: '480px',
      data: { activity, update: true },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.activity) {
        // TODO: Update Activity
      }
    });
  }

  onSelect(event: any): void {
    event.stopPropagation();
  }

}
