import { AfterViewInit, Component } from '@angular/core';
import { AppService } from './app.service';
import { zip, from, interval } from 'rxjs';
declare var Odometer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  private priceList = ['108.17', '108.18', '108.16', '108.14', '108.13', '108.11', '108.14', '108.16'];
  private current = 0;

  constructor (
    public appService: AppService
  ) {}

  ngAfterViewInit(): void {
    this.setPrice();

    interval(5000).subscribe(val =>  {
      const next = (this.current + 1) % this.priceList.length;
      this.current = next;
      this.setPrice(this.priceList[next]);
    });

    const that = this;
    window.onfocus = function () {
      that.appService.onWindowFocus.next(true);
      that.setPrice();
    };
  }

  onToggleDarkMode(event: any): void {
    console.log(event);
    this.appService.darkMode = !this.appService.darkMode;
    this.setPrice();
  }

  private setPrice(value: string | null = null): void {
    const price = document.getElementById("price-text");
    if (price && !value)
      price.innerText = '000.00';
    const odometer = new Odometer({
      el: price,
      value: 0
    });
    odometer.render();
    if (price)
      price.innerText = this.priceList[this.current];
  }
}
