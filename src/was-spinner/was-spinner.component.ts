import { Component, DoCheck, OnInit, Input } from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import { Subscription } from 'rxjs/Rx';

const inactiveStyle = style({
  opacity: 0,
  transform: 'translateY(-40px)'
});
const timing = '.3s ease';

@Component({
  selector: 'was-spinner',
  templateUrl: './was-spinner.component.html',
  styleUrls: ['./was-spinner.component.css'],
  animations: [
    trigger('flyInOut', [
        transition('void => *', [
            inactiveStyle,
            animate(timing)
        ]),
        transition('* => void', [
            animate(timing, inactiveStyle)
        ])
    ])
  ]
})
export class WasSpinnerComponent implements DoCheck {
  @Input() public busy: Subscription;
  @Input() public message: string;
  public showSpinner: boolean;
  constructor() {
    this.showSpinner = false;
    if (!this.message) {
      this.message = 'Please wait...';
    }
  }

  ngDoCheck() {
    if (this.busy && this.busy.closed === true && this.showSpinner !== false) {
      // console.log('CLOSE SPINNER');
      this.showSpinner = false;
    } else if (this.busy && this.busy.closed === false && this.showSpinner !== true) {
      this.showSpinner = true;
      // console.log('SHOW SPINNER');
    }
  }

}
