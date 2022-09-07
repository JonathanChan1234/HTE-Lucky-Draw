import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DrawMainService } from '../draw-main.service';

@Component({
    selector: 'app-draw-animation-block',
    templateUrl: './draw-animation-block.component.html',
    styleUrls: ['./draw-animation-block.component.scss'],
    animations: [
        trigger('flyInOut', [
            state('in', style({ transform: 'translateY(-100%)' })),
            state('out', style({ transform: 'translateY(-100%)' })),
            state('reset', style({ transform: 'translateY(0)' })),
            transition('* => reset', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate(50),
            ]),
            transition('* => out', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate(50),
            ]),
            transition('* => in', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate(50),
            ]),
        ]),
    ],
})
export class DrawAnimationBlockComponent implements OnInit, OnDestroy {
    @Input() group!: { winner: string; items: string[] };

    state: 'reset' | 'in' | 'out' = 'reset';
    itemShown = 'Lucky Draw Player';
    intervalId: NodeJS.Timeout | null = null;
    timeoutId: NodeJS.Timeout | null = null;

    constructor(private readonly drawMainService: DrawMainService) {}

    ngOnInit(): void {
        this.drawMainService.getRefresh().subscribe(() => this.startAnimate());
    }

    ngOnDestroy(): void {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.timeoutId) clearInterval(this.timeoutId);
    }

    startAnimate() {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.timeoutId) clearTimeout(this.timeoutId);
        let index = 0;
        let immediateState = true;
        this.intervalId = setInterval(() => {
            this.itemShown =
                this.group.items[++index % this.group.items.length];
            this.state = immediateState ? 'in' : 'out';
            immediateState = !immediateState;
        }, 100);
        this.timeoutId = setTimeout(() => {
            this.itemShown = this.group.winner;
            this.state = 'reset';
            if (this.intervalId) clearInterval(this.intervalId);
        }, 2000);
    }
}
