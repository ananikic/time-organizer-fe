import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Activity } from 'src/app/abstraction/activities/models/activity.model';
import { ActivitiesApiService } from 'src/app/core/activities/services/activities-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  activities!: Activity[];
  activitiesSub!: Subscription;
  selected: Activity[] = [];

  constructor(public apiActivities: ActivitiesApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.activitiesSub = this.apiActivities.getActivities().subscribe((res) => {
      this.activities = res;
    });
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

  openActivityUpdateDialog(activity: Activity, event: any): void {
    event.stopPropagation();
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

  onSelect(activity: Activity): void {
    activity.selected = !activity.selected;
    if (activity.selected) {
      this.selected.push(activity);
    } else {
      this.selected = this.selected.filter((element) => element !== activity);
    }
  }

  onSelectAll(): void {
    if (this.activities.length === this.selected.length) {
      this.activities.forEach((activity) => activity.selected = false);
      this.selected = [];
    } else {
      this.activities.forEach((activity) => activity.selected = true);
      this.selected = this.activities;
    }
  }

  generatePlan(): void {

  }

  ngOnDestroy(): void {
    this.activitiesSub?.unsubscribe();
  }

}
