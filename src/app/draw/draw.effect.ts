import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DrawAction } from './draw.action';
import { DrawSelector } from './draw.selector';
import { LuckyDrawService } from './lucky-draw.service';

@Injectable()
export class DrawEffects {
    constructor(
        private actions$: Actions,
        private readonly store: Store,
        private readonly drawService: LuckyDrawService
    ) {}

    loadDraws$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawAction.loadDraws),
            concatLatestFrom(() => [
                this.store.select(DrawSelector.selectDrawList),
                this.store.select(DrawSelector.selectReachEnd),
            ]),
            switchMap(([, draws, reachEnd]) => {
                if (draws.length > (environment.production ? 10 : 1))
                    return of(
                        DrawAction.loadDrawsSuccess({
                            draws: { draws, reachEnd },
                        })
                    );
                return from(this.drawService.getDrawList()).pipe(
                    map((draws) =>
                        DrawAction.loadDrawsSuccess({
                            draws,
                        })
                    ),
                    catchError((error) =>
                        of(
                            DrawAction.loadDrawsFailure({
                                error: error.message,
                            })
                        )
                    )
                );
            })
        );
    });

    loadMoreDraws$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawAction.loadMoreDraws),
            concatLatestFrom(() =>
                this.store.select(DrawSelector.selectDrawList)
            ),
            switchMap(([, draws]) => {
                if (draws.length === 0)
                    return of(
                        DrawAction.loadMoreDrawsSuccess({
                            draws: { draws: [], reachEnd: true },
                        })
                    );
                return from(
                    this.drawService.getDrawList(draws[draws.length - 1].id)
                ).pipe(
                    map((draws) => DrawAction.loadMoreDrawsSuccess({ draws })),
                    catchError((error) =>
                        of(
                            DrawAction.loadDrawsFailure({
                                error: error.message,
                            })
                        )
                    )
                );
            })
        );
    });

    createDrawSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawAction.createDrawSuccess),
            concatLatestFrom(() => [
                this.store.select(DrawSelector.selectDrawList),
                this.store.select(DrawSelector.selectReachEnd),
            ]),
            switchMap(([{ name }, draws, reachEnd]) =>
                from(this.drawService.getDrawByName(name)).pipe(
                    map((draw) =>
                        DrawAction.loadDrawsSuccess({
                            draws: {
                                draws: draw ? [draw].concat(draws) : draws,
                                reachEnd,
                            },
                        })
                    ),
                    catchError((error) =>
                        of(
                            DrawAction.loadDrawsFailure({
                                error: error.message,
                            })
                        )
                    )
                )
            )
        );
    });

    loadCurrentDraw$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DrawAction.loadCurrentDraw),
            switchMap(({ drawId }) =>
                this.drawService.getDrawById(drawId).pipe(
                    map((draw) => DrawAction.loadCurrentDrawSuccess({ draw })),
                    catchError((error) =>
                        of(
                            DrawAction.loadCurrentDrawFailure({
                                error: error.message,
                            })
                        )
                    )
                )
            )
        );
    });
}
