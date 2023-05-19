import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  _darkMode: boolean = true;
  onDarkModeUpdated = new  Subject<boolean>();
  onWindowFocus = new Subject<boolean>();

  get darkMode() {
    return this._darkMode;
  }

  set darkMode(darkMode: boolean) {
    this._darkMode = darkMode;
    this.onDarkModeUpdated.next(this.darkMode);
  }
}
