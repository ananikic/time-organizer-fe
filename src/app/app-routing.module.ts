import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { HomeComponent } from './presentation/home/home.component';
import { SettingsComponent } from './presentation/settings/settings.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: OktaCallbackComponent
  },
  {
    path: 'activities',
    loadChildren: () => import('./presentation/activities/activities.module').then(m => m.ActivitiesModule)
  },
  {
    path: 'plan',
    loadChildren: () => import('./presentation/plan/plan.module').then(m => m.PlanModule)
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
