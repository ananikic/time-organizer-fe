import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/abstraction/activities/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private apiServerUrlUsers = environment.apiBaseUrl + '/users';

  constructor(private http: HttpClient) { }


  public getUser(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrlUsers}/${email}`);
  }

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrlUsers}`, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrlUsers}/${user.id}`, user);
  }

}
