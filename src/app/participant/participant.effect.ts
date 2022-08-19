import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { ParticipantDbService } from './participant-db.service';
import { ParticipantAction } from './participant.action';
import { AppState } from './participant.reducer';
import { selectPageOption } from './participant.selector';

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
        )
    );
}
