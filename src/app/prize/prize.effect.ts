import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, from, map, of, switchMap } from 'rxjs';
import { DrawSelector } from '../draw/draw.selector';
import { PrizeAction } from './prize.action';
import { PrizeSelector } from './prize.selector';
import { PrizeService } from './prize.service';

@Injectable()
export class PrizeEffects {
    constructor(
        private actions$: Actions,
        private readonly store: Store,
        private readonly prizeService: PrizeService
    ) {}

    setPrizeFilter$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.setPrizeFilter),
            map(() => PrizeAction.loadPrizes())
        );
    });

    setPageSize$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.setPageSize),
            map(() => PrizeAction.loadPrizes())
        );
    });

    toNextPage$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.goToNextPage),
            map(() => PrizeAction.loadPrizes())
        );
    });

    toPreviousPage$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.goToPreviousPage),
            map(() => PrizeAction.loadPrizes())
        );
    });

    loadPrizes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.loadPrizes),
            concatLatestFrom(() => [
                this.store.select(DrawSelector.selectCurrentDraw),
                this.store.select(PrizeSelector.selectPageOption),
            ]),
            switchMap(([, draw, { filter, pageSize, paginator }]) => {
                if (!draw)
                    return of(
                        PrizeAction.loadPrizeError({ error: 'Invalid Draw' })
                    );
                return from(
                    this.prizeService.getPrizeList(
                        draw.id,
                        pageSize,
                        filter,
                        paginator
                    )
                ).pipe(
                    map((prizeList) =>
                        PrizeAction.loadPrizeSuccess({ prizeList })
                    ),
                    catchError((error) =>
                        of(PrizeAction.loadPrizeError({ error: error.message }))
                    )
                );
            })
        );
    });

    createPrize$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.createPrize),
            concatLatestFrom(() =>
                this.store.select(DrawSelector.selectCurrentDraw)
            ),
            switchMap(([{ prizes }, draw]) => {
                if (!draw)
                    return of(
                        PrizeAction.requestFailure({
                            msg: 'Invalid Draw',
                        })
                    );
                return from(
                    this.prizeService.createPrizes(draw.id, prizes)
                ).pipe(
                    map(() =>
                        PrizeAction.requestSuccess({
                            msg: 'Create New Prize Sucess',
                        })
                    ),
                    catchError((error) =>
                        of(PrizeAction.requestFailure({ msg: error.message }))
                    )
                );
            })
        );
    });

    editPrize$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.editPrize),
            concatLatestFrom(() =>
                this.store.select(DrawSelector.selectCurrentDraw)
            ),
            exhaustMap(([{ prize }, draw]) => {
                if (!draw)
                    return of(
                        PrizeAction.requestFailure({ msg: 'Invalid Draw' })
                    );
                return from(this.prizeService.editPrize(draw.id, prize)).pipe(
                    map(() =>
                        PrizeAction.requestSuccess({
                            msg: 'Edit Prize Successfully',
                        })
                    ),
                    catchError((error) => {
                        return of(
                            PrizeAction.requestFailure({ msg: error.message })
                        );
                    })
                );
            })
        );
    });

    deletePrize$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.deletePrize),
            concatLatestFrom(() =>
                this.store.select(DrawSelector.selectCurrentDraw)
            ),
            switchMap(([{ prizeId }, draw]) => {
                if (!draw)
                    return of(
                        PrizeAction.requestFailure({ msg: 'Invalid Draw' })
                    );
                return from(
                    this.prizeService.deletePrize(draw.id, prizeId)
                ).pipe(
                    map(() =>
                        PrizeAction.requestSuccess({
                            msg: 'Delete prize successfully',
                        })
                    ),
                    catchError((error) =>
                        of(PrizeAction.requestFailure({ msg: error.message }))
                    )
                );
            })
        );
    });

    requestSuccess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.requestSuccess),
            map(() => PrizeAction.loadPrizes())
        );
    });
}
