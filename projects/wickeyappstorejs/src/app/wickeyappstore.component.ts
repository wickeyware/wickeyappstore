import {
  Input,
  Component,
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
  template: `<was-menu-btn (open)="openEvent()"></was-menu-btn>`,
  styleUrls: ['./was.component.css']
})
export class WickeyAppStoreComponent {
  @Output() open = new EventEmitter<void>();
  @Output() userServiceOut = new EventEmitter<UserService>();
  @Output() wasDataServiceOut = new EventEmitter<WasDataService>();

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
    }, (error) => {
      console.warn('WASjs UserService and WasDataService locally loaded, so they might not work work correctly');
      this.userServiceOut.emit(this.userService);
      this.wasDataServiceOut.emit(this.wasDataService);
    });
  }

  /**@ignore*/
  openEvent() {
    this.open.emit();
  }
}
