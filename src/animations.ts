import { animate, AnimationEntryMetadata, state, style, transition, trigger } from '@angular/core';

// Component transition animations
/**
 * Slides in from left to right. Closes by sliding down.
 */
export const slideInDownAnimation: AnimationEntryMetadata =
  trigger('routeAnimation', [
    state('*',
      style({
        opacity: 1,
        transform: 'translateX(0)'
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.1s ease-in')
    ]),
    transition(':leave', [
      animate('0.2s ease-out', style({
        opacity: 0,
        transform: 'translateY(100%)'
      }))
    ])
  ]);

/**
 * Used on Modals. Scales/Fades open and closed.
 */
export const enterLeaveAnim: AnimationEntryMetadata =
trigger('enterLeaveAnim', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scaleX(.98) scaleY(.9)' }),
    animate('300ms cubic-bezier(.61,.02,.44,1.01)', style({ opacity: 1, transform: 'scale(1)' })),
  ]),
  transition(':leave', [
    animate('300ms cubic-bezier(.61,.02,.44,1.01)', style({ opacity: 0, transform: 'scale(.5)' })),
  ])
]);
