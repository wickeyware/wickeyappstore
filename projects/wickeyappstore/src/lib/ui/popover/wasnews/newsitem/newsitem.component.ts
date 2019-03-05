import { Component, OnInit, Input } from '@angular/core';
import { NewsFeedObj } from '../../../../app.models';

/**@ignore*/
@Component({
  selector: 'was-newsitem',
  templateUrl: './newsitem.component.html',
  styleUrls: ['./newsitem.component.css']
})
export class NewsitemComponent implements OnInit {
  @Input() public newsitem: NewsFeedObj;
  /**@ignore*/
  public showUrl = false;

  constructor() { }

  ngOnInit() {
    if (this.checkIfValue(this.newsitem, 'url') && window.location.href.startsWith(this.newsitem.url) === false) {
      this.showUrl = true;
    }
  }
  private checkIfValue(_obj: any, _key: string): boolean {
    let hasValue = false;
    if (_obj.hasOwnProperty(_key)) {
      if (_obj[_key] !== undefined && _obj[_key] !== null) {
        hasValue = true;
      }
    }
    return hasValue;
  }
  /**@ignore*/
  getFromName() {
    if (this.checkIfValue(this.newsitem, 'from')) {
      return this.newsitem.from;
    } else {
      return this.newsitem.appTitle;
    }
  }

}
