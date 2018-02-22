import { Component } from '@angular/core';
/**
 * Shows a button when clicked will open the WickeyAppStore {@link https://www.npmjs.com/package/wickeyappstore }
 *
 * @example
 * Add to your main html component template
 * <was-menu-btn></was-menu-btn>
 *
 * @returns      The store overlay
 */
@Component({
  selector: 'wickey-appstore',
  templateUrl: './wickeyappstore.component.html',
  styleUrls: ['./wickeyappstore.component.css'],
  animations: []
})
export class WickeyAppStoreComponent {
  // Add the main menu button
  constructor() {}
}
