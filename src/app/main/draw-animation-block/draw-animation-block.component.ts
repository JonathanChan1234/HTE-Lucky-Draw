import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DrawGroup } from '../draw-main.reducer';

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
    @Input() group!: DrawGroup;

    state: 'reset' | 'in' | 'out' = 'reset';
    itemShown = 'Lucky Draw Player';
    intervalId: NodeJS.Timeout | null = null;
    timeoutId: NodeJS.Timeout | null = null;

    ngOnInit(): void {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.timeoutId) clearTimeout(this.timeoutId);
        let index = 0;
        let immediateState = true;
        this.intervalId = setInterval(() => {
            const { name, id } =
                this.group.candidates[++index % this.group.candidates.length];
            this.itemShown = `${name} (ID: ${id})`;
            this.state = immediateState ? 'in' : 'out';
            immediateState = !immediateState;
        }, 100);
        this.timeoutId = setTimeout(() => {
            const { name, id } = this.group.winner;
            this.itemShown = `${name} (ID: ${id})`;
            this.state = 'reset';
            if (this.intervalId) clearInterval(this.intervalId);
        }, 2000);
    }

    ngOnDestroy(): void {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.timeoutId) clearInterval(this.timeoutId);
    }
}
