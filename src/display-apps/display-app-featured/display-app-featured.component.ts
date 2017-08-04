import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'display-app-featured',
  templateUrl: './display-app-featured.component.html',
  styleUrls: ['./display-app-featured.component.css']
})
export class DisplayAppFeaturedComponent implements OnInit {
  @Input() public store_app: any;
  @Input() public apps = [];
  @Output() showAppDetail = new EventEmitter<string>();

  public config: Object = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 20,
    autoplay: 4750,
    autoplayDisableOnInteraction: false,
    initialSlide: 1, // slide number which you want to show-- 0 by default
    // loop: true, // This doesn't work. First slide doesn't load image
  };

  constructor() { }

  ngOnInit() {
  }

  showApp_Detail(_app: any) {
    console.log('show app detail');
    this.showAppDetail.emit(_app);
  }

}
