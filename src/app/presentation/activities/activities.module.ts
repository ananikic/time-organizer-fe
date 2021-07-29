import { NgModule } from '@angular/core';

import { ActivitiesRoutingModule } from './activities-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ActivitiesComponent } from './activities.component';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';


@NgModule({
  declarations: [
    ActivitiesComponent,
    ActivityDialogComponent
  ],
  imports: [
    SharedModule,
    ActivitiesRoutingModule,
    PickerModule,
    EmojiModule,
  ]
})
export class ActivitiesModule { }
