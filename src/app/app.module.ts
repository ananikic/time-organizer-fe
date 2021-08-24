import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './presentation/navigation/navigation.component';
import { SharedModule } from './presentation/shared/shared.module';
import { environment } from 'src/environments/environment';
import { ActivitiesApiService } from './core/activities/services/activities-api.service';
import { MockActivitiesApiService } from './core/activities/services/mock-activities-api.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PlanApiService } from './core/plan/services/plan-api.service';
import { MockPlanApiService } from './core/plan/services/mock-plan-api.service';
import { HttpClientModule } from '@angular/common/http';

const apiProviderActivities = {
  provide: ActivitiesApiService,
  useClass: environment.useMockApi ? MockActivitiesApiService : ActivitiesApiService
};

const apiProviderPlan = {
  provide: PlanApiService,
  useClass: environment.useMockApi ? MockPlanApiService : PlanApiService
};

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter, useFactory: adapterFactory,
     })
  ],
  providers: [
    apiProviderActivities,
    apiProviderPlan
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
