import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { DrawSelector } from '../draw/draw.selector';
import { ParticipantDbService } from './participant-db.service';
import { ParticipantAction } from './participant.action';
import { ParticipantSelector } from './participant.selector';

@Injectable()
export class ParticipantEffects {
    constructor(
        private actions$: Actions,
        private store: Store,
        private participantDbService: ParticipantDbService
    ) {}

    setParticipantFilter$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ParticipantAction.setParticipantFilter),
            map(() => ParticipantAction.loadParticipant())
        );
    });

    setPageSize$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ParticipantAction.setPageSize),
            map(() => ParticipantAction.loadParticipant())
        );
    });

    toNextPage$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ParticipantAction.goToNextPage),
            map(() => ParticipantAction.loadParticipant())
        );
    });

    toPreviousPage$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ParticipantAction.goToPreviousPage),
            map(() => ParticipantAction.loadParticipant())
        );
    });

    loadParticipant$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ParticipantAction.loadParticipant),
            concatLatestFrom(() => [
                this.store.select(DrawSelector.selectCurrentDraw),
                this.store.select(ParticipantSelector.selectPageOption),
            ]),
            switchMap(([, draw, { filter, pageSize, paginator }]) => {
                if (!draw)
                    return of(
                        ParticipantAction.loadParticipantError({
                            error: 'Empty Draw Data',
                        })
                    );
                return from(
                    this.participantDbService.getParticpantData(
                        draw.id,
                        pageSize,
                        filter,
                        paginator
                    )
                ).pipe(
                    map((participantData) =>
                        ParticipantAction.loadParticipantSuccess({
                            participantData,
                        })
                    ),
                    catchError((error) => {
                        return of(
                            ParticipantAction.loadParticipantError({
                                error: error.message,
                            })
                        );
                    })
                );
            })
        );
    });
}
