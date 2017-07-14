import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { ErrorTable } from '../app.models';

// TODO: Use this as a template to post-detail.component, this will show the promotion options

// TODO: Make animation like stripe popup
@Component({
  // moduleId: module.id,
  selector: 'was-alert-popup',
  templateUrl: './was-alert-popup.component.html',
  styleUrls: ['./was-alert-popup.component.css'],
  animations: [
    trigger('buttonWobble', [
      state('start', style({
      })),
      transition('start => end', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ]),
    ]),
    // ANIMATION FOR MODAL BG and test ground //
    trigger('alertState', [
      // state('out', style({transform: 'translateX(0) scale(1)'})),
      // state('in',   style({transform: 'translateX(0) scale(1.1)'})),
      // transition('out => in', animate('100ms ease-in')),
      // transition('in => out', animate('100ms ease-out')),
      transition('* => void', [
        style({ opacity: '0' }),
        animate(10, style({ transform: 'translateX(0) scale(0)' }))
      ]),
      transition('void => *', [
        animate(50, keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(15px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ]),
    ]),
    // ANIMATION FOR MODAL //
    trigger('shrinkInOut', [
      state('in', style({ height: '*' })),
      transition('in => out', [
        // Animates back up and shrinks
        animate('350ms ease-out', style({ transform: 'translateY(-200%) scale(.2)' }))
        // Shrink to nothing
        // animate(50, style({transform: 'translateX(0) scale(0)'}))
        // style({height: '*'}),  // This animates height from 0 to height in css
        // animate(250, style({height: 0}))
      ]),
      transition('* => void', [
        animate('350ms ease-out', style({ transform: 'translateY(-200%) scale(.2)' }))
        // Shrink to nothing
        // animate(50, style({transform: 'translateX(0) scale(0)'}))
        // style({height: '*'}),  // This animates height from 0 to height in css
        // animate(250, style({height: 0}))
      ]),
      // This defines an animation on element create (nothing to something)
      transition('void => *', [
        // Set start style, this is a temp style only exists during the animation
        // NOTE: translateY moves element on the Y axis, so -200% is minus its height*2
        style({ transform: 'translateY(-200%) scale(.2)' }),
        // Define the animation, define easing out back function (http://cubic-bezier.com/#.23,.55,.11,1.21)
        // Set the end style, the goal of the animation
        animate('350ms cubic-bezier(.23,.55,.11,1.21)', style({ transform: 'translateY(0) scale(1)' }))
      ])
    ]),
  ]
})

export class WASAlertPopupComponent implements OnInit, OnChanges {
  @Input() public some_var: any;
  @Input() public alert_table: ErrorTable;
  @Output() close = new EventEmitter<any>();
  private show_video: boolean;
  private show_state = 'in';
  private show_test = false;
  private button_state = 'start';

  constructor() { }

  changeState(): void {
    console.log('changeState', this.show_state);
    this.show_state = (this.show_state === 'in' ? 'out' : 'in');
  }

  closeMe(): void {
    this.show_state = 'out';
  }

  buttonWobble(): void {
    this.button_state = 'end';
  }

  animationStarted(event: AnimationEvent) {
    //  console.warn('Animation started: ', event);
  }
  animationDone(event: AnimationEvent) {
    //  console.warn('Animation done: ', event);
    if (event.toState === 'out') {
      this.goBack();
    }
  }
  btnanimationDone(event: AnimationEvent) {
    console.log('Anim Done. Button state is: ', this.button_state);
    // this.button_state = 'start';
    if (event.toState === 'end') {
      this.button_state = 'start';
    }
  }

  onButtonAction(): void {
    this.goBack('button_action');
  }

  goBack(_pass_data?: any): void {
    // hide modal
    this.alert_table = null;
    this.show_video = null;
    this.close.emit(_pass_data);
  }
  openVideo(): void {
    console.log('openVideo');
    this.show_video = true;
    // Add video control, or listen for native fullscreen click
    // TIMEOUT till video element loads
    setTimeout(() => {
      // http://blog.teamtreehouse.com/building-custom-controls-for-html5-videos
      // http://www.intheloftstudios.com/blog/detecting-html5-video-fullscreen-and-events
      const my_video = document.getElementById('helpvideo');
      my_video.addEventListener('webkitfullscreenchange', (e) => {
        this.show_video = document.webkitIsFullScreen;
      });
      if (my_video.requestFullscreen) {
        my_video.requestFullscreen();
      } else if ((<any>my_video).msRequestFullscreen) {
        (<any>my_video).msRequestFullscreen();
      } else if ((<any>my_video).mozRequestFullScreen) {
        (<any>my_video).mozRequestFullScreen();
      } else if (my_video.webkitRequestFullScreen) {
        my_video.webkitRequestFullScreen();
      }
      (<any>my_video).play();
    }, 100 );
  }

  ngOnInit(): void {
    // console.log('AlertPopupComponent init');
  }

  ngOnChanges(): void {
    // console.log('AlertPopupComponent changes');
    if (this.alert_table) {
      this.show_state = 'in';
    }
  }
}
