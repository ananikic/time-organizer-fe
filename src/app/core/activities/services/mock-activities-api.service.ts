import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Activity } from 'src/app/abstraction/activities/models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class MockActivitiesApiService {

  constructor() { }

  public getActivities(): Observable<Activity[]> {
    return of([
      { name: 'yoga', icon: '1F9D8' },
      { name: 'work', icon: '1F469-200D-1F4BC' },
      { name: 'board games', icon: '1F3B2' },
      { name: 'exercise', icon: '1F3CA' },
      { name: 'family time', icon: '1F468-200D-1F469-200D-1F466' },
      { name: 'friends time', icon: 'E249' },
      { name: 'personal project', icon: 'E1C1' },
      { name: 'watching tv series', icon: '1F4FA' },
    ]);
  }
}
