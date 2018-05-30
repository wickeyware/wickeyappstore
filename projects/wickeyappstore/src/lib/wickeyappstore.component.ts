import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
/**
* WickeyAppStore Interface
*
* This is <b>REQUIRED</b> and is the hook into WickeyAppStore reviews, purchases, sso, and other functionality.
*
* WickeyAppStore on NPM: https://www.npmjs.com/package/wickeyappstore
*
* SIMPLY ADD to HTML in your main app page
* ```js
* <wickey-appstore></wickey-appstore>
* ```
* With event listeners
* ```js
* <wickey-appstore (open)="pauseGame()"></wickey-appstore>
* ```
*/
@Component({
  selector: 'wickey-appstore',
  templateUrl: './wickeyappstore.component.html',
  styleUrls: ['./wickeyappstore.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: []
})
export class WickeyAppStoreComponent {
  /** Event emitted when the associated menu is opened.*/
  @Output() open = new EventEmitter<void>();

  /**@ignore*/
  constructor() { }

  /**@ignore*/
  openEvent() {
    this.open.emit();
  }
}
