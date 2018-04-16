import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
/**
 * @module
 * @ignore
 */
@Component({
  selector: 'display-app-mini',
  templateUrl: './display-app-mini.component.html',
  styleUrls: ['./display-app-mini.component.css']
})
export class DisplayAppMiniComponent implements OnInit {
  @Input() public store_app: any;
  @Output() showAppDetail = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  showApp_Detail() {
    this.showAppDetail.emit(this.store_app);
  }

}
