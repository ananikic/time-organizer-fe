import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Activity, ActivityBinding } from 'src/app/abstraction/activities/models/activity.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesApiService {
  private apiServerUrl = environment.apiBaseUrl + '/activities';

  constructor(private http: HttpClient) { }

  public getActivities(userId: number): Observable<Activity[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Activity[]>(`${this.apiServerUrl}`, { params });
  }

  public createActivity(activity: ActivityBinding): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiServerUrl}`, activity);
  }

  public updateActivity(activity: ActivityBinding): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiServerUrl}`, activity);
  }

  public deleteActivity(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServerUrl}/${id}`);
  }
}
