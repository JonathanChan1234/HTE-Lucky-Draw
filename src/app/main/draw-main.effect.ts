import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, from, map, of, switchMap } from 'rxjs';
import { DrawSelector } from '../draw/draw.selector';
import { PrizeService } from '../prize/prize.service';
import { DrawMainAction } from './draw-main.action';
import { LotteryService } from './lottery.service';

@Injectable()
export class DrawMainEffect {
    constructor(
        private actions$: Actions,
        private readonly store: Store,
        private readonly prizeService: PrizeService,
        private readonly lotteryService: LotteryService
    ) {}

    loadPrizes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawMainAction.loadPrizes),
            concatLatestFrom(() =>
                this.store.select(DrawSelector.selectCurrentDraw)
            ),
            switchMap(([, draw]) => {
                if (!draw)
                    return of(
                        DrawMainAction.loadPrizeFailure({
                            error: 'Invalid Draw',
                        })
                    );
                return from(
                    this.prizeService.getPrizes(draw.id, 10, {
                        assigned: false,
                        searchValue: '',
                    })
                ).pipe(
                    map((prizes) =>
                        DrawMainAction.loadPrizesSuccess({ prizes })
                    ),
                    catchError((error) =>
                        of(
                            DrawMainAction.loadPrizeFailure({
                                error: error.message,
                            })
                        )
                    )
                );
            })
        );
    });

    loadDrawGroups$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawMainAction.loadDrawGroups),
            concatLatestFrom(() =>
                this.store.select(DrawSelector.selectCurrentDraw)
            ),
            exhaustMap(([{ prizes }, draw]) => {
                if (!draw)
                    return of(
                        DrawMainAction.loadPrizeFailure({
                            error: 'Invalid Draw',
                        })
                    );
                return from(
                    this.lotteryService.selectRandomParticipants(
                        draw.id,
                        prizes
                    )
                ).pipe(
                    map((drawGroups) =>
                        DrawMainAction.loadDrawGroupsSuccess({
                            drawGroups,
                        })
                    ),
                    catchError((error) =>
                        of(
                            DrawMainAction.loadDrawGroupsError({
                                error: error.message,
                            })
                        )
                    )
                );
            })
        );
    });

    loadDrawGroupsSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawMainAction.loadDrawGroupsSuccess),
            map(() => DrawMainAction.loadPrizes())
        );
    });
}
