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

const apiProviderActivities = {
  provide: ActivitiesApiService,
  useClass: environment.useMockApi ? MockActivitiesApiService : ActivitiesApiService
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
    NgbModule
  ],
  providers: [apiProviderActivities],
  bootstrap: [AppComponent]
})
export class AppModule { }
