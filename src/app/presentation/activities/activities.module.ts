import { NgModule } from '@angular/core';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ActivitiesComponent } from './activities.component';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { PlanDialogComponent } from './plan-dialog/plan-dialog.component';


@NgModule({
  declarations: [
    ActivitiesComponent,
    ActivityDialogComponent,
    PlanDialogComponent
  ],
  imports: [
    SharedModule,
    ActivitiesRoutingModule,
  ]
})
export class ActivitiesModule { }
