import { createFeatureSelector, createSelector } from '@ngrx/store';
import { participantFeatureKey, ParticipantState } from './participant.reducer';

export interface AppState {
    participant: ParticipantState;
}

const selectFeature = createFeatureSelector<ParticipantState>(
    participantFeatureKey
);

const selectParticipant = createSelector(
    selectFeature,
    ({ participants }) => participants
);

const selectLoading = createSelector(selectFeature, ({ loading }) => loading);

const selectError = createSelector(selectFeature, ({ error }) => error);

const selectPageOption = createSelector(
    selectFeature,
    ({ pageOption }) => pageOption
);

const selectReachStart = createSelector(
    selectFeature,
    ({ reachStart }) => reachStart
);

const selectReachEnd = createSelector(
    selectFeature,
    ({ reachEnd }) => reachEnd
);

export const ParticipantSelector = {
    selectPageOption,
    selectParticipant,
    selectLoading,
    selectError,
    selectReachStart,
    selectReachEnd,
};
