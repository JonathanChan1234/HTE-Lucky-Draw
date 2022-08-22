import { createFeatureSelector, createSelector } from '@ngrx/store';
import { participantFeatureKey, ParticipantState } from './participant.reducer';

export interface AppState {
    participant: ParticipantState;
}

const selectFeature = createFeatureSelector<ParticipantState>(
    participantFeatureKey
);

export const selectParticipant = createSelector(
    selectFeature,
    ({ participants }) => participants
);

export const selectLoading = createSelector(
    selectFeature,
    ({ loading }) => loading
);

export const selectError = createSelector(selectFeature, ({ error }) => error);

export const selectPageOption = createSelector(
    selectFeature,
    ({ pageOption }) => pageOption
);

export const selectReachStart = createSelector(
    selectFeature,
    ({ reachStart }) => reachStart
);

export const selectReachEnd = createSelector(
    selectFeature,
    ({ reachEnd }) => reachEnd
);
