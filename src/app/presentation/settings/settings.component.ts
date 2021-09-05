import { Component, OnDestroy, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { User } from 'src/app/abstraction/activities/models/user.model';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserApiService } from 'src/app/core/user/services/user-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  user!: User;

  dayStartHour!: number;
  dayEndHour!: number;

  constructor(public oktaAuth: OktaAuthService, private auth: AuthService, private apiUsers: UserApiService) {}

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (!this.isAuthenticated) {
      this.oktaAuth.signInWithRedirect();
    }

    if (!this.auth.user) {
      await this.auth.findUser();
    }

    this.auth.user$.subscribe((userRes) => {
      this.user = userRes;
      this.dayStartHour = this.user.dayStartHour;
      this.dayEndHour = this.user.dayEndHour;
    });

    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
  }

  ngOnDestroy(): void {
    if (this.dayStartHour !== this.user.dayStartHour || this.dayEndHour !== this.user.dayEndHour) {
      if (this.dayStartHour !== null && this.dayEndHour !== null ) {
        this.user.dayStartHour = this.dayStartHour;
        this.user.dayEndHour = this.dayEndHour;
        this.apiUsers.updateUser(this.user).subscribe();
      }
    }
  }

}
