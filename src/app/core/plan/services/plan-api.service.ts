import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivityInstance } from 'src/app/abstraction/activities/models/activityInstance.model';

@Injectable({
  providedIn: 'root'
})
export class PlanApiService {

  constructor() { }

  public getActivityInstances(): Observable<ActivityInstance[]> {
    return of();
  }
}
