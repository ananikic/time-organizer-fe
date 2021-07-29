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
      { name: 'yoga', icon: '1F9D8', duration: 30, frequency: 3, dayPreference: ['Monday', 'Tuesday'], timePreference: []},
      { name: 'work', icon: '1F469-200D-1F4BC', duration: 45, frequency: 3, },
      { name: 'board games', icon: '1F3B2', duration: 180, frequency: 1, },
      { name: 'exercise', icon: '1F3CA', duration: 60, frequency: 3, },
      { name: 'family time', icon: '1F468-200D-1F469-200D-1F466', duration: 30, frequency: 3, },
      { name: 'friends time', icon: 'E249', duration: 60, frequency: 2, },
      { name: 'personal project', icon: 'E1C1', duration: 120, frequency: 1, },
      { name: 'watching tv series', icon: '1F4FA', duration: 25, frequency: 3, },
    ]);
  }
}
