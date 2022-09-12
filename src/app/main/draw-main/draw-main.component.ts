import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    catchError,
    distinctUntilChanged,
    from,
    map,
    merge,
    Observable,
    of,
    switchMap,
} from 'rxjs';
import { Draw } from 'src/app/draw/draw';
import { Prize } from 'src/app/prize/prize';
import { LuckyDrawService } from 'src/app/service/lucky-draw.service';
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

    constructor(
        private drawService: LuckyDrawService,
        private route: ActivatedRoute,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.draw$ = this.route.paramMap.pipe(
            distinctUntilChanged(),
            switchMap((params) => {
                const drawId = params.get('drawId');
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
            })
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