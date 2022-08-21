import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { ParticipantDbService } from './participant-db.service';
import { ParticipantAction } from './participant.action';
import { selectPageOption } from './participant.selector';

@Injectable()
export class ParticipantEffects {
    constructor(
        private actions$: Actions,
        private store: Store,
        private participantDbService: ParticipantDbService
    ) {}

    loadParticipant$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ParticipantAction.loadParticipant),
            concatLatestFrom(() => this.store.select(selectPageOption)),
            switchMap(([{ drawId }, { filter, pageSize, paginator }]) =>
                from(
                    this.participantDbService.getParticpantData(
                        drawId,
                        pageSize,
                        filter,
                        paginator
                    )
                )
            ),
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
    });
}
