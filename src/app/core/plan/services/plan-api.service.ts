import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityInstance, ActivityInstanceBinding } from 'src/app/abstraction/activities/models/activityInstance.model';
import { PlanBinding } from 'src/app/abstraction/activities/models/plan.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanApiService {
  private apiServerUrl = environment.apiBaseUrl + '/activity-instances';
  private apiServerUrlPlan = environment.apiBaseUrl + '/plan';

  constructor(private http: HttpClient) { }

  public getActivityInstances(userId: number): Observable<ActivityInstance[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<ActivityInstance[]>(`${this.apiServerUrl}`, { params });
  }

  public createActivityInstance(activityInstance: ActivityInstanceBinding): Observable<ActivityInstance> {
    return this.http.post<ActivityInstance>(`${this.apiServerUrl}`, activityInstance);
  }

  public updateActivityInstance(activityInstance: ActivityInstanceBinding): Observable<ActivityInstance> {
    return this.http.put<ActivityInstance>(`${this.apiServerUrl}`, activityInstance);
  }

  public deleteActivityInstance(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/${id}`);
  }

  public createPlan(plan: PlanBinding): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrlPlan}/week`, plan);
  }
}
