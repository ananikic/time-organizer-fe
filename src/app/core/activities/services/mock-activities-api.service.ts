import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { COLOR } from 'src/app/abstraction/activities/constants/activity.constants';
import { Activity } from 'src/app/abstraction/activities/models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class MockActivitiesApiService {

  constructor() { }

  public getActivities(userId: number): Observable<Activity[]> {
    return of([
      { name: 'yoga', icon: '🧘‍♂️', duration: 30, frequency: 3, dayPreference: ['Monday', 'Tuesday'], timePreference: [], color: COLOR.ALMOND },
      { name: 'work', icon: '👩‍💼', duration: 480, frequency: 3, timePreference: ['Concrete Time'], concreteTime: "19:30:00", color: COLOR.ALMOND },
      { name: 'board games', icon: '🎲', duration: 180, frequency: 1, color: COLOR.ALMOND },
      { name: 'exercise', icon: '🏊‍♂️', duration: 60, frequency: 3, color: COLOR.ALMOND },
      { name: 'family time', icon: '👨‍👩‍👦', duration: 32, frequency: 3, color: COLOR.ALMOND },
      { name: 'friends time', icon: '🧑‍🤝‍🧑', duration: 65, frequency: 2, color: COLOR.ALMOND },
      { name: 'personal project', icon: '👨‍💻', duration: 119, frequency: 1, color: COLOR.ALMOND },
      { name: 'watching tv series', icon: '🎬', duration: 25, frequency: 3, color: COLOR.ALMOND },
    ]);
  }
}
