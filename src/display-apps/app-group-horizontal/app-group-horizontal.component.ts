import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppGroup } from '../../app.models';
/**
 * @module
 * @ignore
 */
@Component({
  selector: 'app-group-horizontal',
  templateUrl: './app-group-horizontal.component.html',
  styleUrls: ['./app-group-horizontal.component.css']
})
export class AppGroupHorizontalComponent implements OnInit {
  @Input() public title: string;
  @Input() public apps: AppGroup;
  @Input() public showAppEmitter: EventEmitter<string>;
  @Output() public showAppList = new EventEmitter<AppGroup>();

  public config: Object = {
    pagination: '.swiper-pagination',
    slidesPerView: 10,
    spaceBetween: 50,
    breakpoints: {
      1024: {
        slidesPerView: 8,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 6,
        spaceBetween: 30
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      360: {
        slidesPerView: 3,
        spaceBetween: 10
      }
    },
    paginationClickable: true,
    freeMode: true
  };

  constructor() { }

  ngOnInit() {
  }
  showVerticalListApps() {
    console.log('showVerticalListApps');
    this.showAppList.emit(this.apps);
  }

}
