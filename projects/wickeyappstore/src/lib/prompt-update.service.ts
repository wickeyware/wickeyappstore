import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatDialog } from '@angular/material/dialog';
import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
/**
 * @module
 * @ignore
 */
/**
 * Checks service worker if there is an available update.
 * If update available, try to use ngsw-config.json appData for shown dialog title, description, version, and askToUpdate.
 * Dialog will not be shown (thus new version will not be loaded until next page refresh) if askToUpdate is False.
 */
@Injectable({
  providedIn: 'root'
})
export class PromptUpdateService {
  constructor(updates: SwUpdate, public dialog: MatDialog) {
    updates.available.subscribe(event => {
      console.log('PromptUpdateService: NEW CONTENT', event);
      // event.available.name/description/version
      let app_title = 'Update Is Ready';
      let app_description = 'New Update is available. Click Refresh to get it now';
      let app_version = null;
      let app_askToUpdate = true;
      if (event.available.appData) {
        if (event.available.appData.hasOwnProperty('title') && event.available.appData['title'] !== null) {
          app_title = event.available.appData['title'];
        }
        if (event.available.appData.hasOwnProperty('description') && event.available.appData['description'] !== null) {
          app_description = event.available.appData['description'];
        }
        if (event.available.appData.hasOwnProperty('version') && event.available.appData['version'] !== null) {
          app_version = event.available.appData['version'];
        }
        if (event.available.appData.hasOwnProperty('askToUpdate') && event.available.appData['askToUpdate'] !== null) {
          app_askToUpdate = event.available.appData['askToUpdate'];
        }
      }
      if (app_version !== null) {
        app_description += ` [v${app_version}]`;
      }
      if (app_askToUpdate) {
        this.dialog.open(WasAlert, {
          data: { title: app_title, body: app_description,
            buttons: ['Cancel', 'Refresh'], button_icons: ['cancel', 'refresh'], button_colors: ['warning', 'primary'] }
        }).afterClosed().subscribe(result => {
          // result is the index of the button pressed
          if (result === 1) {
            updates.activateUpdate().then(() => document.location.reload());
          }
        });
      }
    });
  }
}
