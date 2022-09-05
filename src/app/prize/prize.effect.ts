import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, from, map, of, switchMap } from 'rxjs';
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

    setDrawId$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PrizeAction.setDrawId),
            map(() => PrizeAction.loadPrizes())
        );
    });

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
                this.store.select(PrizeSelector.selectDrawId),
                this.store.select(PrizeSelector.selectPageOption),
            ]),
            switchMap(([, drawId, { filter, pageSize, paginator }]) => {
                if (!drawId) throw new Error('Empty Draw Id');
                return from(
                    this.prizeService.getPrizeList(
                        drawId,
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
                this.store.select(PrizeSelector.selectDrawId)
            ),
            switchMap(([{ prizes }, drawId]) => {
                if (!drawId) throw new Error('Empty Draw Id');
                return from(
                    this.prizeService.createPrizes(drawId, prizes)
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
                this.store.select(PrizeSelector.selectDrawId)
            ),
            exhaustMap(([{ prize }, drawId]) => {
                if (!drawId) throw new Error('Empty Draw ID');
                return from(this.prizeService.editPrize(drawId, prize)).pipe(
                    map(() =>
                        PrizeAction.requestSuccess({
                            msg: 'Edit Prize Successfully',
                        })
                    ),
                    catchError((error) => {
                        console.log(error);
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
                this.store.select(PrizeSelector.selectDrawId)
            ),
            switchMap(([{ prizeId }, drawId]) => {
                if (!drawId) throw new Error('Empty Draw Id');
                return from(
                    this.prizeService.deletePrize(drawId, prizeId)
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
