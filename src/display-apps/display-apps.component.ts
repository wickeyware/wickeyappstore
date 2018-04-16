import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { AppGroup } from './../app.models';

/**
 * @module
 * @ignore
 */
@Component({
  selector: 'display-apps',
  templateUrl: './display-apps.component.html',
  styleUrls: ['./display-apps.component.css']
})
export class DisplayAppsComponent implements OnInit {
  @Input() public apps = [];
  @Input() public featured: boolean;
  @Input() public showAppEmitter: EventEmitter<string>;
  @Input() public showAppListEmitter: EventEmitter<AppGroup>;

  constructor() { }

  ngOnInit() {
  }



}
