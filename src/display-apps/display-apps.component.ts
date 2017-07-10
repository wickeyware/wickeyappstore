import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'display-apps',
  templateUrl: './display-apps.component.html',
  styleUrls: ['./display-apps.component.css']
})
export class DisplayAppsComponent implements OnInit {
  @Input() public title: string;
  @Input() public apps = [];
  @Input() public featured: boolean;
  @Input() public showAppEmitter: EventEmitter<string>;

  constructor() { }

  ngOnInit() {
  }

  getFeaturedApp() {
    // return this.apps[0];
    for (const app of this.apps) {
      if (app.is_featured === true) {
        return app;
      }
    }
  }

}
