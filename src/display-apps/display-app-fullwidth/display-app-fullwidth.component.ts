import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GetCategoryPipe } from '../../pipes/get-category.pipe';

@Component({
  selector: 'display-app-fullwidth',
  templateUrl: './display-app-fullwidth.component.html',
  styleUrls: ['./display-app-fullwidth.component.css']
})
export class DisplayAppFullwidthComponent implements OnInit {
  @Input() public store_app: any;
  @Output() showAppDetail = new EventEmitter<string>();

  public hasInapps = null;

  constructor() { }

  ngOnInit() {
    console.log('display-app-fullwidth - on init');
    if(this.store_app.has_inapps) {
      this.hasInapps = '1';
    }
  }

  showApp_Detail() {
    console.log('showApp_Detail in full width');
    this.showAppDetail.emit(this.store_app);
  }

}
