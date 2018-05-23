import {
  Input,
  Component,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { WasAlert } from '../../../wickeyappstore/src/lib/ui/popover/wasalert/wasalert.dialog';
import { LocalStorageService } from '../../../wickeyappstore/src/lib/local-storage.service';
import { UserService } from '../../../wickeyappstore/src/lib/user.service';
import { WasDataService } from '../../../wickeyappstore/src/lib/was-data.service';


@Component({
  selector: 'wickey-appstore',
  template: `<was-menu-btn></was-menu-btn>`,
  styleUrls: ['./was.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class WickeyAppStoreComponent {
  @Input() label = 'default label';
  @Output() action = new EventEmitter<number>();
  @Output() userServiceOut = new EventEmitter<UserService>();
  @Output() wasDataServiceOut = new EventEmitter<WasDataService>();
  private clicksCt = 0;

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private wasDataService: WasDataService,
    public dialog: MatDialog
  ) {
    // Pushes update on all login status changes (also pushes status on initial load)
    this.userService.loginChange.subscribe((_isLogged: boolean) => {
      this.userServiceOut.emit(this.userService);
      this.wasDataServiceOut.emit(this.wasDataService);
      console.log('USER LOADED:', this.userService.userObject.user_id);
      if (_isLogged) {
        console.warn('LOGGED IN');
      } else {
        console.warn('LOGGED OUT');
        // reset progress
      }
    });
  }

  handleClick() {
    this.clicksCt++;
    this.action.emit(this.clicksCt);
    this.localStorageService.set('clicks_count', this.clicksCt);
  }
  button2Action() {
    console.log('WickeyAppStoreComponent button2Action');
    this.localStorageService.get('clicks_count').then((_cnt) => {
      this.dialog.open(WasAlert, {data: { title: 'Attention', body: `Clicks count ${_cnt}` }});
    });
  }
  button3Action() {
    console.log('WickeyAppStoreComponent button3Action save to local');
  }
}
