import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ErrorTable } from '../../app.models';

@Component({
  selector: 'app-detail-page',
  templateUrl: './app-detail-page.component.html',
  styleUrls: ['./app-detail-page.component.css'],
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
export class AppDetailPageComponent implements OnInit {
  @Input() public showApp: number;
  @Input() public selected_app: any;
  @Output() close = new EventEmitter<number>();
  public error_message: ErrorTable;

  constructor() { }

  ngOnInit() {
  }

  goBack(): void {
    // TODO: hide modal
    this.showApp = null;
    this.close.emit(1);
    event.stopPropagation();
  }

  launchApp(): void {
    // This removes the spaces in the title name and uses it for the target
    const windowname = this.selected_app.name.replace(/\s/g, '-');
    window.open(this.selected_app.app_url, windowname);
  }
}
