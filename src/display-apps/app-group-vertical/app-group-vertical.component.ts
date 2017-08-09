import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ErrorTable } from '../../app.models';
import { AppGroup } from '../../app.models';

@Component({
  selector: 'app-group-vertical',
  templateUrl: './app-group-vertical.component.html',
  styleUrls: ['./app-group-vertical.component.css'],
   animations: [
    // ANIMATION FOR MODAL //
    trigger('pageOpen', [
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'translateY(-100%)' }))
      ]),
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-out', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AppGroupVerticalComponent implements OnInit {
  @Input() public open: number;
  @Output() close = new EventEmitter<number>();
  @Input() public title: string;
  @Input() public apps: AppGroup;
  @Input() public showAppEmitter: EventEmitter<string>;
  public error_message: ErrorTable;
  constructor() { }

  ngOnInit() {
  }
  goBack(event: any): void {
    // TODO: hide modal
    this.open = null;
    this.close.emit(1);
    event.stopPropagation();
  }

}
