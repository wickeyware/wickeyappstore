import { Component } from '@angular/core';
import { UserService, User, WasAlert } from '../../dist/wickeyappstore';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WickeyAppStore Demo';

  constructor(
    public userService: UserService,
    public dialog: MatDialog
  ) {
    // Pushes update on all login status changes (also pushes status on initial load)
    this.userService.loginChange.subscribe((_isLogged: boolean) => {
      console.log('USER LOADED:', this.userService.userObject.user_id);
      if (_isLogged) {
        console.warn('LOGGED IN');
      } else {
        console.warn('LOGGED OUT');
        // reset progress
      }
      this.dialog.open(WasAlert, {data: { title: 'Attention', body: `Is user logged in ${_isLogged}` }});
    });
  }
  pause() {
    console.log('wasmenu opened, pause game');
  }
}
