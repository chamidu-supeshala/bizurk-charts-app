import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  _darkMode: boolean = true;

  get darkMode() {
    return this._darkMode;
  }

  set darkMode(darkMode: boolean) {
    this._darkMode = darkMode;
  }
}
