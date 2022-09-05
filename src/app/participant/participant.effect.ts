import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
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

    setDrawId$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ParticipantAction.setDrawId),
            map(() => ParticipantAction.loadParticipant())
        );
    });

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
                this.store.select(ParticipantSelector.selectDrawId),
                this.store.select(ParticipantSelector.selectPageOption),
            ]),
            switchMap(([, drawId, { filter, pageSize, paginator }]) => {
                if (!drawId) throw new Error('Empty Draw ID');
                return from(
                    this.participantDbService.getParticpantData(
                        drawId,
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
                        console.log(error);

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
