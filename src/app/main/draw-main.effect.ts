import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { PrizeService } from '../prize/prize.service';
import { DrawMainAction } from './draw-main.action';
import { DrawMainSelector } from './draw-main.selector';
import { DrawMainService } from './draw-main.service';

@Injectable()
export class DrawMainEffect {
    constructor(
        private actions$: Actions,
        private readonly store: Store,
        private readonly prizeService: PrizeService,
        private readonly drawMainService: DrawMainService
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

    loadWinnerGroups$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawMainAction.loadWinnerGroups),
            concatLatestFrom(() =>
                this.store.select(DrawMainSelector.selectDrawId)
            ),
            switchMap(([{ prizes, numberOfDraws }, drawId]) => {
                if (!drawId)
                    return of(
                        DrawMainAction.loadPrizeFailure({
                            error: 'Empty Draw ID',
                        })
                    );
                return from(
                    this.drawMainService.selectRandomParticipants(
                        drawId,
                        numberOfDraws
                    )
                ).pipe(
                    map((drawGroups) =>
                        DrawMainAction.loadWinnerGroupsSuccess({ drawGroups })
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
}
