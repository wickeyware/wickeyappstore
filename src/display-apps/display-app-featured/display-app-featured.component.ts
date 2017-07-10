import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'display-app-featured',
  templateUrl: './display-app-featured.component.html',
  styleUrls: ['./display-app-featured.component.css']
})
export class DisplayAppFeaturedComponent implements OnInit {
  @Input() public store_app: any;
  @Output() showAppDetail = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  showApp_Detail() {
    console.log('show app detail');
    this.showAppDetail.emit(this.store_app);
  }

}
