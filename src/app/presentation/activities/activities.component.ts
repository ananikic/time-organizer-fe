import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activity, ActivityBinding } from 'src/app/abstraction/activities/models/activity.model';
import { ActivitiesApiService } from 'src/app/core/activities/services/activities-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { PlanDialogComponent } from './plan-dialog/plan-dialog.component';
import { Plan, PlanBinding } from 'src/app/abstraction/activities/models/plan.model';
import { addDays, formatISO } from 'date-fns';
import { PlanApiService } from 'src/app/core/plan/services/plan-api.service';
import { Router } from '@angular/router';


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

  constructor(public apiActivities: ActivitiesApiService, public apiPlan: PlanApiService,
    public dialog: MatDialog, private router: Router) { }

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

    dialogRef.afterClosed().subscribe((data: {activity: Activity; update: boolean; delete: boolean; reopenDialog: boolean}) => {
      if (data?.delete) {
        this.apiActivities.deleteActivity(data.activity.id!).subscribe(() => {
          this.activities = this.activities.filter((a) => a.id !== data.activity.id);
        });
      } else if (data?.activity) {
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
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      data: {
        plan: {
        selectedActivities: this.selected,
        userId: this.userId,
        start: null,
      }
    },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((data: { plan: Plan; }) => {
      if (data?.plan) {
        const planBinding: PlanBinding = {
          activities: data.plan.selectedActivities,
          userId: data.plan.userId,
          start: formatISO(data.plan.start).slice(0, -6),
          end:  formatISO(addDays(data.plan.start, 7)).slice(0, -6),
        };

        this.apiPlan.createPlan(planBinding).subscribe(() => {
          this.router.navigate(['plan']);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.activitiesSub?.unsubscribe();
  }

}
