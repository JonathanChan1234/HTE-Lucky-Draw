import { createSelector } from '@ngrx/store';
import { AppState, ParticipantState } from './participant.reducer';

export const selectParticipant = createSelector(
    (state: AppState) => state.participant,
    (state: ParticipantState) => state.participants
);

export const selectLoading = createSelector(
    (state: AppState) => state.participant,
    (state: ParticipantState) => state.loading
);

export const selectError = createSelector(
    (state: AppState) => state.participant,
    (state: ParticipantState) => state.error
);
