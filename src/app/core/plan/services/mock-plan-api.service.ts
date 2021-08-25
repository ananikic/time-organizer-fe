import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { COLOR } from 'src/app/abstraction/activities/constants/activity.constants';
import { ActivityInstance } from 'src/app/abstraction/activities/models/activityInstance.model';

@Injectable({
  providedIn: 'root'
})
export class MockPlanApiService {

  constructor() { }

  public getActivityInstances(userId: number): Observable<ActivityInstance[]> {
    return of([
      {
        id: 1,
        start: new Date(2021, 7, 16, 8, 30).toLocaleString(),
        end: new Date(2021, 7, 16, 12, 30).toLocaleString(),
        title: '👩‍💼 work pt.1',
        color: COLOR.ALMOND
      },
      {
        id: 8,
        start: new Date(2021, 7, 16, 12, 30).toLocaleString(),
        end: new Date(2021, 7, 16, 13, 30).toLocaleString(),
        title: '🥑 lunch',
        color: COLOR.LAVENDEL_FLORAL
      },
      {
        id: 2,
        start: new Date(2021, 7, 16, 14, 30).toLocaleString(),
        end: new Date(2021, 7, 16, 18, 30).toLocaleString(),
        title: '👩‍💼 work pt.2',
        color: COLOR.ALMOND
      },
      {
        id: 3,
        start: new Date(2021, 7, 16, 18, 30).toLocaleString(),
        end: new Date(2021, 7, 16, 19, 0).toLocaleString(),
        title: '🧘‍♂️ yoga',
        color: COLOR.COTTON_CANDY
      },
      {
        id: 4,
        start: new Date(2021, 7, 16, 19, 0).toLocaleString(),
        end: new Date(2021, 7, 16, 19, 30).toLocaleString(),
        title: '🧘 meditation',
        color: COLOR.MAGIC_MINT
      },
      {
        id: 5,
        start: new Date(2021, 7, 16, 19, 30).toLocaleString(),
        end: new Date(2021, 7, 16, 20, 30).toLocaleString(),
        title: '🧁 dinner',
        color: COLOR.MANGO_TANGO
      },
      {
        id: 6,
        start: new Date(2021, 7, 16, 20, 30).toLocaleString(),
        end: new Date(2021, 7, 16, 21, 30).toLocaleString(),
        title: '📺 watch netflix',
        color: COLOR.MAXIMUM_YELLOW_RED
      },
      {
        id: 7,
        start: new Date(2021, 7, 16, 22, 30).toLocaleString(),
        end: new Date(2021, 7, 17, 7, 30).toLocaleString(),
        title: '😴 sleep',
        color: COLOR.BLUE_SAPHIRE
      },
    ]);
  }
}
