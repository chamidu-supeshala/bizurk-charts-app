import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor (
    public appService: AppService
  ) {}

  onToggleDarkMode(event: any): void {
    console.log(event);
    this.appService.darkMode = !this.appService.darkMode;
  }
}
