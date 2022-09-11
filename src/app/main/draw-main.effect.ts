import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, from, map, of, switchMap } from 'rxjs';
import { PrizeService } from '../prize/prize.service';
import { DrawMainAction } from './draw-main.action';
import { DrawMainSelector } from './draw-main.selector';
import { LotteryService } from './lottery.service';

@Injectable()
export class DrawMainEffect {
    constructor(
        private actions$: Actions,
        private readonly store: Store,
        private readonly prizeService: PrizeService,
        private readonly lotteryService: LotteryService
    ) {}

    setDrawId$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawMainAction.setDrawId),
            map(() => DrawMainAction.loadPrizes())
        );
    });

    loadPrize$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawMainAction.loadPrizes),
            concatLatestFrom(() =>
                this.store.select(DrawMainSelector.selectDrawId)
            ),
            switchMap(([, drawId]) => {
                if (!drawId)
                    return of(
                        DrawMainAction.loadPrizeFailure({
                            error: 'Empty Draw Id',
                        })
                    );
                return from(
                    this.prizeService.getPrizes(drawId, 10, {
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
                this.store.select(DrawMainSelector.selectDrawId)
            ),
            exhaustMap(([{ prizes }, drawId]) => {
                if (!drawId)
                    return of(
                        DrawMainAction.loadPrizeFailure({
                            error: 'Empty Draw ID',
                        })
                    );
                return from(
                    this.lotteryService.selectRandomParticipants(drawId, prizes)
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
