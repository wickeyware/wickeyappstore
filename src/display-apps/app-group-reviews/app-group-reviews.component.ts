import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AppGroup } from '../../app.models';
import { ApiConnectionService } from '../../api-connection.service';
import { Subscription } from 'rxjs/Rx';
import { WASAlertComponent } from '../../ui/popover/popover-alert/popover-alert.component';

@Component({
  selector: 'app-group-reviews',
  templateUrl: './app-group-reviews.component.html',
  styleUrls: ['./app-group-reviews.component.css'],
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
export class AppGroupReviewsComponent implements OnInit {
  @ViewChild(WASAlertComponent) wasalert: WASAlertComponent;
  @Input() public open: number;
  @Input() public title: string;
  @Input() public storeapp_id: string;
  @Output() close = new EventEmitter<string>();
  busy: Subscription;
  public reviews;

  constructor(
    private apiConnectionService: ApiConnectionService,
  ) { }

  ngOnInit() {
    console.log('init app-group-reviews');
    // get the reviews
    this.busy = this.apiConnectionService.getReviews({ 'storeapp_id': this.storeapp_id }).subscribe((_reviews: any) => {
      console.log(_reviews);
      this.reviews = _reviews;
    });

  }

  closeReviews(event: any) {
    this.open = null;
    this.close.emit('close');
    event.stopPropagation();
  }

}


