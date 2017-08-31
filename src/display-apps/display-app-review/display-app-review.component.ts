import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Review } from '../../app.models';

@Component({
  selector: 'display-app-review',
  templateUrl: './display-app-review.component.html',
  styleUrls: ['./display-app-review.component.css']
})
export class DisplayAppReviewComponent implements OnInit {
  @Input() public review: Review;
  public stars = 4.5;

  constructor() { }

  ngOnInit() {
    // console.log('init display-app-review');
    this.stars = this.review.rating;
  }

}

