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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './presentation/home/home.component';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { SettingsComponent } from './presentation/settings/settings.component';

const apiProviderActivities = {
  provide: ActivitiesApiService,
  useClass: environment.useMockApi ? MockActivitiesApiService : ActivitiesApiService
};

const apiProviderPlan = {
  provide: PlanApiService,
  useClass: environment.useMockApi ? MockPlanApiService : PlanApiService
};

const oktaConfig = {
  issuer: 'https://dev-57080089.okta.com/oauth2/default',
  redirectUri: '/callback',
  clientId: '0oa1m0xrviRBXFsN15d7',
  scopes: ['openid', 'profile'],
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    OktaAuthModule,
    CalendarModule.forRoot({
      provide: DateAdapter, useFactory: adapterFactory,
     })
  ],
  providers: [
    apiProviderActivities,
    apiProviderPlan,
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
