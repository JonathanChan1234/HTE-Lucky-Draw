import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { DrawAction } from './draw.action';
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
            switchMap(() =>
                this.drawService.getDrawList().pipe(
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
                )
            )
        );
    });
}
