import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isAuthenticated: boolean = false;
  public themeDark = false;
  public themeIcon = 'dark';

  constructor(public themeService: ThemeService, public oktaAuth: OktaAuthService) {}

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );

    const theme = this.themeService.currentActive();
    this.themeDark = theme === 'dark';
    this.themeDark ? this.themeIcon = 'light' : this.themeIcon = 'dark';
  }

  changeTheme() {
    this.themeDark = !this.themeDark;
    this.themeDark ? this.themeIcon = 'light' : this.themeIcon = 'dark';
    this.themeService.update(this.themeDark ? 'dark' : 'light');
  }

}
