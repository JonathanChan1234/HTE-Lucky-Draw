import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DrawMainAction } from '../draw-main.action';

@Component({
    selector: 'app-draw-main',
    templateUrl: './draw-main.component.html',
    styleUrls: ['./draw-main.component.scss'],
})
export class DrawMainComponent implements OnInit {
    isAnimating = false;

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.store.dispatch(DrawMainAction.loadPrizes());
    }

    setAnimating(animating: boolean): void {
        this.isAnimating = animating;
    }
}
