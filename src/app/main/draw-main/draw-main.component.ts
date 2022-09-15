import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    catchError,
    from,
    map,
    merge,
    Observable,
    of,
    shareReplay,
    switchMap,
} from 'rxjs';
import { Draw } from 'src/app/draw/draw';
import { LuckyDrawService } from 'src/app/draw/lucky-draw.service';
import { Prize } from 'src/app/prize/prize';
import { DrawMainAction } from '../draw-main.action';
import { DrawMainSelector } from '../draw-main.selector';

@Component({
    selector: 'app-draw-main',
    templateUrl: './draw-main.component.html',
    styleUrls: ['./draw-main.component.scss'],
})
export class DrawMainComponent implements OnInit {
    loading$!: Observable<boolean>;
    draw$!: Observable<Draw | null>;
    err = '';

    prizes$!: Observable<Prize[]>;
    loadingPrizes$!: Observable<boolean>;
    // currentDraw$!: Observable<Draw | undefined>;

    constructor(
        private drawService: LuckyDrawService,
        private route: ActivatedRoute,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.draw$ = this.route.params.pipe(
            map((params) => params['drawId']),
            switchMap((drawId) => {
                if (!drawId) {
                    this.err = 'Empty Draw ID';
                    return of(null);
                }
                this.store.dispatch(DrawMainAction.setDrawId({ drawId }));
                return from(this.drawService.getDrawById(drawId)).pipe(
                    catchError((error) => {
                        this.err = error.message;
                        return of(null);
                    })
                );
            }),
            shareReplay(1)
        );
        this.loading$ = merge(
            of(true),
            this.draw$.pipe(
                map(() => false),
                catchError(() => of(false))
            )
        );
        this.prizes$ = this.store.select(DrawMainSelector.selectPrizes);
        this.loadingPrizes$ = this.store.select(
            DrawMainSelector.selectLoadingPrizeList
        );
    }
}
