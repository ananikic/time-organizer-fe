import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public themeDark = false;
  public themeIcon = 'dark';

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
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
