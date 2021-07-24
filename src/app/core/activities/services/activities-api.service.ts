import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Activity } from 'src/app/abstraction/activities/models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesApiService {

  constructor() { }

  public getActivities(): Observable<Activity[]> {
    return of();
  }
}
