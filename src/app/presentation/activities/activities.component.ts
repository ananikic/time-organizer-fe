import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activity, ActivityBinding } from 'src/app/abstraction/activities/models/activity.model';
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
  userId = 1;

  constructor(public apiActivities: ActivitiesApiService, public dialog: MatDialog) { }

  ngOnInit() {
    this.activitiesSub = this.apiActivities.getActivities(this.userId).subscribe((res) => {
      this.activities = res;
    });
  }

  openActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      width: '480px',
      data: { activity: {}, update: false },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((data: {activity: Activity; update: boolean; reopenDialog: boolean}) => {
      if (data?.activity) {
        const activityBinding: ActivityBinding = {
          name: data.activity.name,
          userId: this.userId,
          icon: data.activity.icon,
          secondaryColor: data.activity.color.secondaryColor,
          duration: data.activity.duration,
          frequency: data.activity.frequency,
          dayPreference: data.activity.dayPreference,
          timePreference: data.activity.timePreference,
          concreteTimeHour: data.activity.concreteTime ? +data.activity.concreteTime.split(":")[0] : undefined,
          concreteTimeMinute: data.activity.concreteTime ? +data.activity.concreteTime!.split(":")[1] : undefined,
        };

        this.apiActivities.createActivity(activityBinding).subscribe((activity: Activity) => {
          this.activities.push(activity);
        });
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

    dialogRef.afterClosed().subscribe((data: {activity: Activity; update: boolean; reopenDialog: boolean}) => {
      if (data?.activity) {
        const activityBinding: ActivityBinding = {
          id: data.activity.id,
          name: data.activity.name,
          userId: this.userId,
          icon: data.activity.icon,
          secondaryColor: data.activity.color.secondaryColor,
          duration: data.activity.duration,
          frequency: data.activity.frequency,
          dayPreference: data.activity.dayPreference,
          timePreference: data.activity.timePreference,
          concreteTimeHour: data.activity.concreteTime ? +data.activity.concreteTime.split(":")[0] : undefined,
          concreteTimeMinute: data.activity.concreteTime ? +data.activity.concreteTime!.split(":")[1] : undefined,
        };

        this.apiActivities.updateActivity(activityBinding).subscribe((updatedActivity: Activity) => {
          this.activities = this.activities.map((a) => a.id !== updatedActivity.id ? a : updatedActivity);
        });
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
    // TODO: Generate Plan
  }

  ngOnDestroy(): void {
    this.activitiesSub?.unsubscribe();
  }

}
