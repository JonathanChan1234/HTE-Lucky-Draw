import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { Component, Input } from '@angular/core';

export interface AnimateItem {
    prize: string;
    participant: string;
    state: AnimateItemState;
}

export type AnimateItemState = 'reset' | 'in' | 'out';

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
export class DrawAnimationBlockComponent {
    @Input() item: AnimateItem = {
        prize: '???',
        participant: '???',
        state: 'reset',
    };
}
