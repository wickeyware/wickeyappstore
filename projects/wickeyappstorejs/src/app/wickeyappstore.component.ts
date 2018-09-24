import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { UserService } from '../../../wickeyappstore/src/lib/user.service';
import { WasDataService } from '../../../wickeyappstore/src/lib/was-data.service';

@Component({
  selector: 'wickey-appstore',
  template: `<was-menu-btn (open)="openEvent()"></was-menu-btn>`,
  styleUrls: ['./was.component.css']
})
export class WickeyAppStoreComponent implements OnInit {
  @Output() open = new EventEmitter<void>();
  @Output() userServiceOut = new EventEmitter<UserService>();
  @Output() wasDataServiceOut = new EventEmitter<WasDataService>();

  constructor(
    private userService: UserService,
    private wasDataService: WasDataService
  ) {}

  /** @ignore */
  ngOnInit() {
    console.log('%c WASjs 2.16.4 Initialized ', 'background: #222; color: #00BDFC');
    (<any>window).WAS = {};
    (<any>window).WAS.dataService = this.wasDataService;
    (<any>window).WAS.userService = this.userService;
  }

  /**@ignore*/
  openEvent() {
    this.open.emit();
  }
}
