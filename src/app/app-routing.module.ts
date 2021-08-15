import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'activities',
    loadChildren: () => import('./presentation/activities/activities.module').then(m => m.ActivitiesModule)
  },
  {
    path: 'plan',
    loadChildren: () => import('./presentation/plan/plan.module').then(m => m.PlanModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
