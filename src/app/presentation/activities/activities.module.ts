import { NgModule } from '@angular/core';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ActivitiesComponent } from './activities.component';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';


@NgModule({
  declarations: [
    ActivitiesComponent,
    ActivityDialogComponent
  ],
  imports: [
    SharedModule,
    ActivitiesRoutingModule,
  ]
})
export class ActivitiesModule { }
