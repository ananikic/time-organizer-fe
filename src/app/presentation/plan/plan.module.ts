import { NgModule } from '@angular/core';

import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './plan.component';
import {  CalendarModule } from 'angular-calendar';
import { SharedModule } from '../shared/shared.module';
import { ActivityInstanceDialogComponent } from './activity-instance-dialog/activity-instance-dialog.component';



@NgModule({
  declarations: [
    PlanComponent,
    ActivityInstanceDialogComponent
  ],
  imports: [
    SharedModule,
    PlanRoutingModule,
    CalendarModule
  ]
})
export class PlanModule { }
