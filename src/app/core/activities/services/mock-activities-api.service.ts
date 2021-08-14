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
      { name: 'yoga', icon: '🧘‍♂️', duration: 30, frequency: 3, dayPreference: ['Monday', 'Tuesday'], timePreference: []},
      { name: 'work', icon: '👩‍💼', duration: 45, frequency: 3, },
      { name: 'board games', icon: '🎲', duration: 180, frequency: 1, },
      { name: 'exercise', icon: '🏊‍♂️', duration: 60, frequency: 3, },
      { name: 'family time', icon: '👨‍👩‍👦', duration: 32, frequency: 3, },
      { name: 'friends time', icon: '🧑‍🤝‍🧑', duration: 65, frequency: 2, },
      { name: 'personal project', icon: '👨‍💻', duration: 119, frequency: 1, },
      { name: 'watching tv series', icon: '🎬', duration: 25, frequency: 3, },
    ]);
  }
}
