import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { ReplaySubject } from 'rxjs';
import { User } from 'src/app/abstraction/activities/models/user.model';
import { UserApiService } from '../user/services/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user = false;
  public user$ = new ReplaySubject<User>(1);

  constructor(private apiUsers: UserApiService, private oktaAuth: OktaAuthService) { }

  public async findUser() {
    const userEmail = (await this.oktaAuth.getUser()).preferred_username || '';
    this.apiUsers.getUser(userEmail).subscribe((userRes) => {
      if (!userRes) {
        this.apiUsers.createUser({ email: userEmail, username: userEmail, dayStartHour: 0, dayEndHour: 24 }).subscribe((created) => {
          this.user$.next(created);
          this.user = true;
        });
      } else {
        this.user$.next(userRes);
        this.user = true;
      }
    });
  }
}
