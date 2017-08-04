import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
// import { trigger, style, animate, transition } from '@angular/animations';
import { ApiConnectionService } from '../../api-connection.service';
import { slideInDownAnimation } from '../../animations';
import { ErrorTable } from '../../app.models';

@Component({
  selector: 'app-detail-page',
  templateUrl: './app-detail-page.component.html',
  styleUrls: ['./app-detail-page.component.css'],
  animations: [ slideInDownAnimation ]
})
export class AppDetailPageComponent implements OnInit {
  // ANIMATION TO USE, Set the routeAnimation property to true since we only care about the :enter and :leave states
  // https://angular.io/guide/router#adding-animations-to-the-routed-component
  @HostBinding('@routeAnimation') routeAnimation = true;
  // STYLE OF OUTER DIV/PAGE
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'fixed';
  @HostBinding('style.z-index')  zIndex = 100;
  @HostBinding('style.top')  top = 0;
  @HostBinding('style.width')  width = '100%';
  @HostBinding('style.height')  height = '100%';
  public busy: Subscription;
  public selected_app: any;
  public error_message: ErrorTable;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiConnectionService: ApiConnectionService
  ) { }

  ngOnInit() {
    console.log('AppDetailPageComponent: ngOnInit');
    // TODO: add busy spinner here
    this.busy = this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.apiConnectionService.getApps({'slug': params.get('slug')})
      ).subscribe((_selected_app: any) => {
        console.log(_selected_app);
        this.selected_app = _selected_app[0];
        this.busy = null;
      });
  }

  private handleError(error: any): Promise<any> {
    // .catch(this.handleError);
    console.error('An error occurred', error);  // for demo purposes
    return Promise.reject(error.message || error);
  }

  goBack(): void {
    this.router.navigate(['']);
  }

}
