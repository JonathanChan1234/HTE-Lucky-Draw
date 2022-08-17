import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { ParticipantDbService } from './participant-db.service';
import { ParticipantAction } from './participant.action';
import { AppState } from './participant.reducer';

@Injectable()
export class ParticipantEffect {
    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private participantDbService: ParticipantDbService
    ) {}

    loadParticipant$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ParticipantAction.loadParticipant),
            tap(() => this.store.dispatch(ParticipantAction.setLoading())),
            switchMap(({ drawId }) =>
                from(
                    this.participantDbService.getParticipants(drawId, 10, {
                        searchField: 'id',
                        searchValue: '',
                    })
                )
            ),
            map((participants) =>
                ParticipantAction.loadParticipantSuccess({
                    participants,
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
        )
    );
}
