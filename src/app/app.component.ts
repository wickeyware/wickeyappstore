import { Component } from '@angular/core';
import { UserService, User, WasAlert, WasDataService } from 'wickeyappstore';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WickeyAppStore Demo';
  public highScore: any;

  constructor(
    public userService: UserService,
    public wasDataService: WasDataService,
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
      // this.dialog.open(WasAlert, {data: { title: 'Attention', body: `Is user logged in ${_isLogged}` }});
    });
    this.wasDataService.restore(this.onSaveConflict).subscribe(mydata => {
      console.log('demo:wasDataService.restore', mydata);
      this.highScore = this.wasDataService.get('highScore');
      // WasDataService is now loaded and restored (ready for use).
      // this.wasDataService.get('highScore');
      // this.wasDataService.save('highScore', 3000);
      // Then after the session (or game level), persist to cloud
      // wasDataService.persist();
    });
    this.highScore = this.wasDataService.get('highScore');
    console.log('get highScore', this.highScore);
    this.wasDataService.save('highScore', 20);
  }
  onSaveConflict(localSave: any, cloudSave: any) {
    let keepSave = localSave;
    console.log('onSaveConflict: localSave, cloudSave', localSave, cloudSave);
    if (localSave && cloudSave) {
      let _cHscore;
      let _lHscore;
      if (cloudSave.hasOwnProperty('highScore') && cloudSave['highScore'] !== undefined && cloudSave['highScore'] !== null) {
        _cHscore = cloudSave.highScore;
      } else {
        _cHscore = 0;
      }
      if (localSave.hasOwnProperty('highScore') && localSave['highScore'] !== undefined && localSave['highScore'] !== null) {
        _lHscore = localSave.highScore;
      } else {
        _lHscore = 0;
      }
      if (_cHscore > _lHscore) {
        console.log('onSaveConflict: keep cloud');
        keepSave = cloudSave;
      }
    }
    return keepSave;
  }
  pause() {
    console.log('wasmenu opened, pause game');
  }
  getScore() {
    this.highScore = this.wasDataService.get('highScore');
    console.log('get highScore', this.highScore);
    this.userService.getLeaderboard(this.userService.userObject.username);
  }
  setScore() {
    if (this.highScore >= 0) {
      this.highScore += 1;
      this.userService.addToLeaderboard(this.highScore);
    } else {
      this.highScore = 0;
    }
    this.wasDataService.save('highScore', this.highScore);
  }

  promptDialog(message: string, defaultVal?: string) {
    if (!defaultVal) {
      defaultVal = '';
    }
    return this.dialog.open(WasAlert, {
      data: { title: message, input: true, input_value: defaultVal, buttons: ['Cancel', 'Submit'],
      button_icons: ['cancel', 'assignment_turned_in'], button_colors: ['warning', 'primary'] }
    }).afterClosed();
  }
}
