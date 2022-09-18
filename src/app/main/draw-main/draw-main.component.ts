import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Prize } from 'src/app/prize/prize';
import { DrawMainAction } from '../draw-main.action';
import { DrawMainSelector } from '../draw-main.selector';

@Component({
    selector: 'app-draw-main',
    templateUrl: './draw-main.component.html',
    styleUrls: ['./draw-main.component.scss'],
})
export class DrawMainComponent implements OnInit {
    prizes$!: Observable<Prize[]>;
    loading$!: Observable<boolean>;
    error$!: Observable<string | undefined>;

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.store.dispatch(DrawMainAction.loadPrizes());
        this.prizes$ = this.store.select(DrawMainSelector.selectPrizes);
        this.loading$ = this.store.select(
            DrawMainSelector.selectLoadingPrizeList
        );
        this.error$ = this.store.select(
            DrawMainSelector.selectLoadingPrizeError
        );
    }
}
