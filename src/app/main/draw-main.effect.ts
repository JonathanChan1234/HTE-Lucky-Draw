import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
    catchError,
    exhaustMap,
    from,
    interval,
    map,
    of,
    switchMap,
    take,
} from 'rxjs';
import { PrizeService } from '../prize/prize.service';
import { DrawMainAction } from './draw-main.action';
import { DrawMainSelector } from './draw-main.selector';
import { DrawMainService } from './draw-main.service';

type ANIMATION_STATE = 'reset' | 'in' | 'out';
const ImmediateState: ANIMATION_STATE[] = ['in', 'out'];

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

    loadDrawGroups$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawMainAction.loadDrawGroups),
            concatLatestFrom(() =>
                this.store.select(DrawMainSelector.selectDrawId)
            ),
            exhaustMap(([{ prizes, numberOfDraws }, drawId]) => {
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
                    exhaustMap((groups) =>
                        interval(100).pipe(
                            take(20),
                            map((x) =>
                                DrawMainAction.setAnimationItems({
                                    items: groups.map((group) =>
                                        x !== 19
                                            ? {
                                                  text: group.candidates[
                                                      x %
                                                          group.candidates
                                                              .length
                                                  ].name,
                                                  state: ImmediateState[
                                                      x % ImmediateState.length
                                                  ],
                                              }
                                            : {
                                                  text: group.winner.name,
                                                  state: 'reset',
                                              }
                                    ),
                                    animating: x < 19,
                                })
                            )
                        )
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
}
