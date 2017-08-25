/**
 * menu-wing.component
 */

import {
    Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter,
    ElementRef, Renderer2, HostBinding, ViewChild, AfterViewInit, ChangeDetectionStrategy
} from '@angular/core';
import { IMenuWing, MenuOptions } from './menu-options.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-menu-wing',
    templateUrl: './menu-wing.component.html',
    styleUrls: ['./menu-wing.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('rotateWing', [
            transition(':enter', [
                style({transform: 'rotate({{startAngles}}deg) scale(.1)'}),
                animate('100ms 10ms cubic-bezier(.42,0,.58,1)', style('*'))
            ]),
        ]),
        trigger('scaleWing', [
            state('0', style({ transform: 'scale(1)' })),
            state('1', style({ transform: 'scale(1.2)' })),
            transition('0<=>1', [
                animate('180ms cubic-bezier(.68,-0.55,.26,1.55)')
            ]),
        ]),
    ],
})
export class MenuWingComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {

    @ViewChild('wingIconElm') public wingIconElm: ElementRef;
    @Input() public wing: IMenuWing;
    @Input() public index: number;
    @Input() public svgPath: string;
    @Input() public position: string;
    @Output() public wingClicked = new EventEmitter<IMenuWing>();
    @Output() public wingHovered = new EventEmitter<IMenuWing>();

    public startAngles: number;
    public rotateDeg: number;
    public scaleWingState = false;
    public menuConfig: any;
    public iconX: number;
    public iconY: number;
    public iconSize: number;
    public wingTextStyle: any;


    /**
     * Binding to rotateWing animation
     * */
    @HostBinding('@rotateWing')
    public rotateWingState: any = { value: '', params: { startAngles: 0 } };

    constructor(private menuOptions: MenuOptions,
        private elm: ElementRef,
        private renderer: Renderer2) {
        this.menuConfig = this.menuOptions.MenuConfig;
    }

    public ngOnInit() {
        this.calculateWingIconSizeAndPosition();
    }

    public ngOnDestroy(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {

        // When the menu's position changes,
        // recalculate each wing's and its icon rotation degrees
        if (changes['position']) {
            console.log('ngOnChanges');
            console.log(this.position, this.menuOptions.StartAngles, this.menuOptions.StartAngles[this.position]);
            // bottomRight {topLeft: 20, topRight: 130, bottomRight: 186, bottomLeft: 324}

            this.startAngles = this.menuOptions.StartAngles[this.position];
            this.rotateWingState = { value: '', params: { startAngles: this.startAngles } };
            this.rotateDeg = this.startAngles +
                (this.index * this.menuConfig.angle);
            this.setWingTransformStyle();
            this.wingTextStyle = this.menuOptions.MenuPositions[this.position];

            console.log(this.rotateWingState, this.rotateDeg, this.wingTextStyle);

        }

        if (changes['position'] && !changes['position'].isFirstChange()) {
            this.setWingIconTransformStyle();
        }
    }

    public ngAfterViewInit(): void {
        this.setWingIconTransformStyle();
    }

    /**
     * Mouse hover on the wing
     * */
    public onMouseOver(): void {
        this.scaleWingState = true;
        this.wingHovered.emit(this.wing);
    }

    /**
     * Mouse out off the wing
     * */
    public onMouseOut(): void {
        this.scaleWingState = false;
    }

    /**
     * Click on the wing
     * */
    public onClick(): void {
        this.scaleWingState = true;
        this.wingClicked.emit(this.wing);
    }


    /**
     * Set wing transform style
     * */
    private setWingTransformStyle(): void {
        this.renderer.setStyle(this.elm.nativeElement, 'transform', 'rotate(' + this.rotateDeg + 'deg)');
        return;
    }

    /**
     * Set wing icon transform style
     * */
    private setWingIconTransformStyle(): void {
        if (this.menuConfig.showIcons || this.menuConfig.onlyIcons) {
            this.renderer.setStyle(this.wingIconElm.nativeElement,
                'transform', 'translate(' + this.iconX + 'px, ' + this.iconY + 'px) rotate(' + (this.rotateDeg) * -1 + 'deg)');
        }
        return;
    }

    /**
     * Calculate wing's icon size and position
     * */
    private calculateWingIconSizeAndPosition(): void {
        this.iconSize = this.wing.icon.size || this.menuConfig.wingIconSize;
        if (this.menuConfig.onlyIcons) {
            this.iconX = this.menuConfig.radius - this.menuConfig.radius / 2 + this.iconSize / 4;
        } else {
            this.iconX = this.menuConfig.radius - this.iconSize - 8;
        }
        this.iconY = -(this.menuConfig.radius / 2 + this.iconSize / 2 + 5);
        return;
    }
}
